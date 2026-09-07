// Live direction: the timeline holds art choices and framing, never rendered video.
import { NeonTreatment } from "./neon-treatment";
import { HopeTreatment } from "./hope-treatment";
import { shots, shotAt, ENDING_DURATION, isMotion, motion, type Art, type MotionArt, type Shot, type Card, type Point } from "./mitsuki-sequence";
export { shots, shotAt, ENDING_DURATION, stages } from "./mitsuki-sequence";
const urls = import.meta.glob<string>("./assets/mitsuki/*.webp", { eager: true, query: "?url", import: "default" });
export const thumbnail = (art: Art, quality: string) => urls[`./assets/mitsuki/${art}-${quality}.webp`];
const W = 1672, H = 941;
const clamp = (v: number, low = 0, high = 1) => Math.max(low, Math.min(high, v));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export type EndingLook = "warm" | "neon" | "hope";
export type EndingOptions = { original: boolean; hold: boolean; reduced: boolean; depth: boolean; blink: boolean;
    breath: boolean; atmosphere: boolean; look: EndingLook; intensity: number; quality: "lite" | "full"; pointerX: number; pointerY: number };
export type EndingFrame = { index: number; card?: Card; opacity: number; label: string };
type Images = Record<Art | "room" | "child" | "eyes", HTMLImageElement>;

export class MitsukiEnding {
    private neon = new NeonTreatment();
    private hope = new HopeTreatment();
    private images: Images;
    private sheets = new Map<MotionArt, HTMLImageElement>();
    private pending = new Map<MotionArt, Promise<void>>();
    private failed = new Set<MotionArt>();
    private wanted = new Set<MotionArt>();
    private currentLook: EndingLook = "hope";
    private disposed = false;
    private quality: "lite" | "full";
    private loadImage: (url: string) => Promise<HTMLImageElement>;
    private invalidate: () => void;
    private buffers = [document.createElement("canvas"), document.createElement("canvas")];
    private transitionMask = document.createElement("canvas");
    private glow = document.createElement("canvas");
    private motes = Array.from({ length: 40 }, (_, i) => ({
        x: ((i * 73 + 19) % 211) / 211, y: ((i * 47 + 5) % 157) / 157,
        r: 1.3 + (i % 5) * 1.1, speed: .008 + (i % 7) * .0012,
    }));
    private constructor(images: Images, quality: "lite" | "full", loadImage: (url: string) => Promise<HTMLImageElement>, invalidate: () => void) {
        this.images = images;
        this.quality = quality; this.loadImage = loadImage; this.invalidate = invalidate;
        this.glow.width = this.glow.height = 96;
        const c = this.glow.getContext("2d")!;
        const glow = c.createRadialGradient(48, 48, 0, 48, 48, 48);
        glow.addColorStop(0, "#fff5d9cc"); glow.addColorStop(.25, "#ffe8ba80"); glow.addColorStop(1, "#ffd5a000");
        c.fillStyle = glow; c.fillRect(0, 0, 96, 96);
    }
    static async load(quality: "lite" | "full", loadImage: (url: string) => Promise<HTMLImageElement>, invalidate: () => void = () => {}) {
        const names = [...new Set(shots.map(shot => shot.art)), "room", "child", "eyes"] as (keyof Images)[];
        const entries = await Promise.all(names.map(async name => [name, await loadImage(name === "eyes" ?
            urls["./assets/mitsuki/eyes.webp"] : urls[`./assets/mitsuki/${name}-${quality}.webp`])] as const));
        const ending = new MitsukiEnding(Object.fromEntries(entries) as Images, quality, loadImage, invalidate);
        await ending.ensureFrames(0);
        return ending;
    }
    prepareLook(look: EndingLook) {
        this.currentLook = look;
        if (look !== "hope") this.hope.clear();
        if (look !== "neon") this.neon.clear();
        if (look === "neon") this.neon.prepare([...new Set(shots.map(shot => shot.art))].map(art => this.images[art]), this.images.child, this.images.eyes);
        if (look === "hope") this.hope.prepare(Object.values(this.images));
        for (const image of this.sheets.values()) this.colored(image, look);
    }
    private colored(image: HTMLImageElement, look: EndingLook) {
        return look === "hope" ? this.hope.plate(image) : look === "neon" ? this.neon.plate(image) : image;
    }
    private ensureFrames(time: number) {
        const index = shotAt(time);
        const nearby = [shots[index], shots[Math.min(index + 1, shots.length - 1)]];
        if (index > 0 && time - shots[index].start < 2) nearby.push(shots[index - 1]);
        this.wanted = new Set(nearby.map(shot => shot.art).filter(isMotion));
        // Only the current, next and outgoing animation sheets are retained.
        for (const [art, image] of this.sheets) if (!this.wanted.has(art)) {
            this.sheets.delete(art); this.hope.release(image); this.neon.release(image);
        }
        const tasks: Promise<void>[] = [];
        for (const art of this.wanted) {
            if (this.sheets.has(art) || this.failed.has(art)) continue;
            let task = this.pending.get(art);
            if (!task) {
                task = this.loadImage(urls[`./assets/mitsuki/${art}-motion-${this.quality}.webp`]).then(image => {
                    if (this.disposed || !this.wanted.has(art)) return;
                    this.sheets.set(art, image); this.colored(image, this.currentLook); this.invalidate();
                }).catch(() => {
                    // A failed optional sheet leaves its poster visible and seekable.
                    this.failed.add(art);
                }).finally(() => { this.pending.delete(art); });
                this.pending.set(art, task);
            }
            tasks.push(task);
        }
        return Promise.all(tasks);
    }
    dispose() {
        this.disposed = true; this.wanted.clear(); this.sheets.clear(); this.hope.clear(); this.neon.clear();
        this.invalidate = () => {};
    }
    private motionFrame(c: CanvasRenderingContext2D, art: MotionArt, progress: number, look: EndingLook) {
        const sheet = this.sheets.get(art);
        if (!sheet) { c.drawImage(this.colored(this.images[art], look), 0, 0, W, H); return; }
        const total = motion[art].frames, columns = 4, rows = Math.ceil(total / columns);
        const width = sheet.naturalWidth / columns, height = sheet.naturalHeight / rows;
        const position = clamp(progress) * (total - 1), first = Math.floor(position), next = Math.min(first + 1, total - 1);
        const source = this.colored(sheet, look);
        c.drawImage(source, first % columns * width, Math.floor(first / columns) * height, width, height, 0, 0, W, H);
        if (next !== first) {
            c.save(); c.globalAlpha *= position - first;
            c.drawImage(source, next % columns * width, Math.floor(next / columns) * height, width, height, 0, 0, W, H); c.restore();
        }
    }
    private blink(t: number) {
        for (const at of [2.5, 5.4, 10.7, 10.98, 16.4, 21.8]) {
            const elapsed = (t % 24) - at;
            if (elapsed >= 0 && elapsed < .07) return smooth(elapsed / .07);
            if (elapsed >= .07 && elapsed < .14) return 1;
            if (elapsed >= .14 && elapsed < .27) return 1 - smooth((elapsed - .14) / .13);
        }
        return 0;
    }
    private art(c: CanvasRenderingContext2D, art: Art, t: number, o: EndingOptions, progress = 0) {
        if (isMotion(art)) { this.motionFrame(c, art, progress, o.look); return; }
        if (art === "nino") {
            // A portrait photograph in an album; never stretch the original 4:3 art.
            c.fillStyle = o.look === "neon" ? "#faff00" : "#fff4e9"; c.fillRect(0, 0, W, H);
            const image = this.images.nino, height = H * .9, width = height * image.naturalWidth / image.naturalHeight;
            c.save(); c.translate(W / 2, H / 2); c.rotate(-.007);
            c.fillStyle = "#68425624"; c.fillRect(-width / 2 + 2, -height / 2 + 4, width + 16, height + 16);
            c.fillStyle = "#fffaf4"; c.fillRect(-width / 2 - 9, -height / 2 - 9, width + 18, height + 18);
            c.drawImage(this.colored(image, o.look), -width / 2, -height / 2, width, height); c.restore(); return;
        }
        if (o.look === "neon") {
            if (art !== "hero") { c.drawImage(this.neon.plate(this.images[art]), 0, 0, W, H); return; }
            const time = o.reduced ? 0 : t;
            this.neon.backdrop(c, time, o.atmosphere ? o.intensity : 0);
            c.save();
            const breathing = !o.reduced && o.breath ? Math.sin(time * Math.PI * 2 / 5.4) : 0;
            c.translate(850 + (!o.reduced && o.depth ? o.pointerX * 8 + Math.sin(time * .28) * 2 : 0), 805 + breathing * .65);
            c.scale(1.003, 1.003 + breathing * .0016); c.translate(-850, -805);
            if (o.atmosphere) {
                const spread = (12 + Math.sin(time * .65) * 4) * o.intensity;
                c.drawImage(this.neon.echo(this.images.child, "#ff0065"), -spread * 2, 4, W, H);
                c.drawImage(this.neon.echo(this.images.child, "#00eae4"), spread, -3, W, H);
            }
            c.drawImage(this.neon.plate(this.images.child, true), 0, 0, W, H);
            if (o.blink && !o.reduced) {
                c.globalAlpha = this.blink(time); c.drawImage(this.neon.plate(this.images.eyes, true), 731, 292, 257, 139); c.globalAlpha = 1;
            }
            c.restore(); return;
        }
        const plate = (image: HTMLImageElement) => o.look === "hope" ? this.hope.plate(image) : image;
        if (art !== "hero" || o.reduced || (!o.depth && !o.breath && !o.blink)) {
            c.drawImage(plate(this.images[art]), 0, 0, W, H); return;
        }
        c.drawImage(plate(this.images.room), 0, 0, W, H);
        c.save();
        // A contact shadow anchors the feet; only a few pixels of independent movement.
        c.save(); c.translate(857, 766); c.rotate(.32); c.scale(1, .3);
        const shadow = c.createRadialGradient(0, 0, 15, 0, 0, 178);
        shadow.addColorStop(0, "#5d381434"); shadow.addColorStop(1, "#5d381400");
        c.fillStyle = shadow; c.fillRect(-178, -178, 356, 356); c.restore();
        const breath = o.breath ? Math.sin(t * 2 * Math.PI / 5.4) : 0;
        c.translate(850 + (o.depth ? o.pointerX * 7 + Math.sin(t * .28) * 2 : 0), 805 + breath * .65);
        c.scale(1.003, 1.003 + breath * .0016); c.translate(-850, -805);
        c.drawImage(plate(this.images.child), 0, 0, W, H);
        if (o.blink) {
            c.globalAlpha = this.blink(t); c.drawImage(plate(this.images.eyes), 731, 292, 257, 139); c.globalAlpha = 1;
        }
        c.restore();
    }
    private camera(c: CanvasRenderingContext2D, shot: Shot, t: number, o: EndingOptions, override?: Art) {
        const p = o.reduced || !o.depth ? .5 : o.hold ? (1 - Math.cos(t * Math.PI * 2 / shot.seconds)) / 2 : smooth(t / shot.seconds);
        const zoom = mix(shot.zoom[0], shot.zoom[1], p);
        // Clamp framing so camera travel never uncovers empty canvas edges.
        const x = clamp(W / 2 - mix(shot.from[0], shot.to[0], p) * W * zoom, W - W * zoom, 0);
        const y = clamp(H / 2 - mix(shot.from[1], shot.to[1], p) * H * zoom, H - H * zoom, 0);
        c.save();
        if (shot.tilt && o.depth && !o.reduced) {
            c.translate(W / 2, H / 2); c.rotate(mix(shot.tilt[0], shot.tilt[1], p) * Math.PI / 180); c.translate(-W / 2, -H / 2);
        }
        c.translate(x, y); c.scale(zoom, zoom);
        const frameProgress = o.reduced ? .5 : o.hold ? (1 - Math.cos(t * Math.PI * 2 / shot.seconds)) / 2 : clamp(t / shot.seconds);
        const range = shot.frames ?? [0, 1];
        this.art(c, override ?? shot.art, t, o, mix(range[0], range[1], frameProgress)); c.restore();
    }
    private atmosphere(c: CanvasRenderingContext2D, t: number, night: boolean, o: EndingOptions) {
        if (!o.atmosphere || o.intensity === 0) return;
        const time = o.reduced ? 0 : t;
        const strength = o.intensity;
        c.save(); c.globalCompositeOperation = "screen";
        // Broad diagonal window light, kept gentle enough to retain the line art.
        const x = 140 + Math.sin(time * .16) * 90;
        const light = c.createLinearGradient(x, 0, x + 880, H);
        light.addColorStop(0, night ? "#cbb6ef00" : "#ffe4ae00");
        light.addColorStop(.27, night ? "#e8d8f516" : "#fff1d23c");
        light.addColorStop(.56, "#ffeac900"); light.addColorStop(.75, "#fff0ca15"); light.addColorStop(1, "#fff0ca00");
        c.globalAlpha = strength; c.fillStyle = light; c.fillRect(0, 0, W, H);
        if (!o.reduced) {
            const count = o.quality === "lite" ? 20 : 34;
            for (let i = 0; i < count; i++) {
                const mote = this.motes[i];
                const px = (mote.x * W + Math.sin(time * .18 + i) * 24 + time * 3) % (W + 40);
                const py = ((mote.y - time * mote.speed) % 1 + 1) % 1 * H;
                c.globalAlpha = strength * (.16 + .23 * (1 + Math.sin(time * .6 + i)) / 2);
                const radius = mote.r * (i % 6 === 0 ? 7 : 1);
                c.drawImage(this.glow, px - radius, py - radius, radius * 2, radius * 2);
            }
        }
        // Foreground bokeh has independent movement; never a full-screen blur filter.
        c.globalAlpha = strength * .24;
        for (let i = 0; i < 4; i++) {
            const size = 90 + i * 70;
            const px = i % 2 ? W - size * .3 : -size * .2;
            c.drawImage(this.glow, px + Math.sin(time * .13 + i) * 60, H * (i / 4) - size / 2, size, size);
        }
        c.restore();
    }
    private paint(buffer: HTMLCanvasElement, index: number, time: number, o: EndingOptions) {
        const c = buffer.getContext("2d", { alpha: false })!;
        c.setTransform(buffer.width / W, 0, 0, buffer.height / H, 0, 0);
        const shot = shots[index], t = Math.max(0, time - shot.start);
        c.fillStyle = "#f3eadb"; c.fillRect(0, 0, W, H);
        if (shot.panels) {
            const panels: { art: Art; from: Point; zoom: Point }[] = [
                { art: "comfort", from: [.33, .39], zoom: [1.42, 1.5] },
                { art: "hero", from: [.54, .4], zoom: [1.24, 1.3] },
                { art: "father", from: [.5, .32], zoom: [1.3, 1.36] },
            ];
            panels.forEach((panel, i) => {
                const left = i * W / 3 + 5, width = W / 3 - 10;
                const reveal = o.reduced || o.look === "hope" ? 1 : smooth((t - i * .18) / .65);
                c.save(); c.beginPath(); c.rect(left, 0, width * reveal, H); c.clip();
                c.translate(left + width / 2 - W / 2, 0);
                this.camera(c, { ...shot, ...panel, to: panel.from }, t, o, panel.art);
                c.restore();
            });
        } else this.camera(c, shot, t, o);
        if (o.look === "neon") {
            if (o.atmosphere) this.neon.marks(c, t, o.intensity, o.reduced);
            return;
        }
        const romantic = o.look === "hope";
        if (!romantic) this.atmosphere(c, t, shot.art === "night", o);
        const shade = c.createLinearGradient(0, 0, 0, H);
        shade.addColorStop(0, romantic ? "#fff4e61c" : "#20162a10"); shade.addColorStop(.5, "#20162a00"); shade.addColorStop(1, romantic ? "#eab8d01c" : "#23182b35");
        c.fillStyle = shade; c.fillRect(0, 0, W, H);
        if (shot.card && !o.hold) {
            const right = shot.card.side === "right";
            const shade = c.createLinearGradient(right ? W : 0, 0, right ? W * .54 : W * .5, 0);
            shade.addColorStop(0, romantic ? "#fff5ead9" : "#1915219c"); shade.addColorStop(1, romantic ? "#fff5ea00" : "#19152100");
            c.fillStyle = shade; c.fillRect(0, 0, W, H);
        }
    }
    draw(c: CanvasRenderingContext2D, time: number, o: EndingOptions): EndingFrame {
        const index = shotAt(time), shot = shots[index];
        const local = time - shot.start;
        void this.ensureFrames(time);
        if (o.original) {
            if (isMotion(shot.art)) {
                const range = shot.frames ?? [0, 1];
                this.motionFrame(c, shot.art, mix(range[0], range[1], o.reduced ? .5 : clamp(local / shot.seconds)), "warm");
            } else {
                const image = this.images[shot.art], height = Math.min(H, W * image.naturalHeight / image.naturalWidth), width = height * image.naturalWidth / image.naturalHeight;
                c.fillStyle = "#fff4e9"; c.fillRect(0, 0, W, H); c.drawImage(image, (W - width) / 2, (H - height) / 2, width, height);
            }
            return { index, opacity: 0, label: shot.label };
        }
        const size = c.canvas;
        for (const buffer of [...this.buffers, this.transitionMask]) if (buffer.width !== size.width || buffer.height !== size.height) {
            buffer.width = size.width; buffer.height = size.height;
        }
        const romantic = o.look === "hope";
        const transition = romantic ? "dissolve" : o.look === "neon" ? shot.transition === "cut" ? "cut" : "wipe" : shot.transition ?? "dissolve";
        const duration = romantic ? shot.hopeTransition === "bloom" ? 1.8 : 1.4 : transition === "cut" ? 0 : transition === "wipe" ? .9 : 1.05;
        const transitioning = index > 0 && local < duration && !o.hold && !o.reduced;
        this.paint(this.buffers[0], index, time, o);
        if (transitioning) {
            this.paint(this.buffers[1], index - 1, shot.start + local, o);
            c.drawImage(this.buffers[1], 0, 0, W, H);
            const progress = smooth(local / duration);
            c.save();
            if (romantic && shot.hopeTransition === "bloom") {
                const mask = this.transitionMask.getContext("2d")!;
                mask.setTransform(size.width / W, 0, 0, size.height / H, 0, 0);
                mask.globalCompositeOperation = "source-over"; mask.clearRect(0, 0, W, H);
                mask.drawImage(this.buffers[0], 0, 0, W, H);
                const radius = Math.max(2, Math.hypot(W, H) * progress);
                const reveal = mask.createRadialGradient(W * .58, H * .44, 0, W * .58, H * .44, radius);
                reveal.addColorStop(0, "#fff"); reveal.addColorStop(.7, "#fff"); reveal.addColorStop(1, "#fff0");
                mask.globalCompositeOperation = "destination-in"; mask.fillStyle = reveal; mask.fillRect(0, 0, W, H);
                mask.globalCompositeOperation = "source-over";
                c.drawImage(this.transitionMask, 0, 0, W, H);
            } else if (romantic && shot.hopeTransition === "memory") {
                c.globalAlpha = progress; c.translate(W / 2, H / 2); c.rotate((1 - progress) * -.014);
                c.scale(.945 + progress * .055, .945 + progress * .055);
                c.fillStyle = "#fff9f0"; c.fillRect(-W / 2 - 8, -H / 2 - 8, W + 16, H + 16);
                c.drawImage(this.buffers[0], -W / 2, -H / 2, W, H);
            } else {
                if (transition === "wipe") {
                const edge = progress * (W + 210) - 210;
                c.beginPath(); c.moveTo(0, 0); c.lineTo(edge + 210, 0); c.lineTo(edge, H); c.lineTo(0, H); c.closePath(); c.clip();
                } else c.globalAlpha = progress;
                c.drawImage(this.buffers[0], 0, 0, W, H);
            }
            c.restore();
            if (romantic && shot.hopeTransition === "light") {
                const x = (progress * 1.6 - .3) * W;
                const light = c.createLinearGradient(x - 400, 0, x + 280, H);
                light.addColorStop(0, "#fff6e900"); light.addColorStop(.5, "#fff8eac2"); light.addColorStop(1, "#ffe3d800");
                c.save(); c.globalCompositeOperation = "screen"; c.globalAlpha = Math.sin(progress * Math.PI) * .28;
                c.fillStyle = light; c.fillRect(0, 0, W, H); c.restore();
            }
            if (transition === "light") {
                c.fillStyle = `rgba(255,242,219,${Math.sin(progress * Math.PI) * .26})`; c.fillRect(0, 0, W, H);
            }
        } else c.drawImage(this.buffers[0], 0, 0, W, H);
        // Brief displaced image strips near a cut, without full-screen flashes.
        if (o.look === "neon" && o.atmosphere && !o.reduced && local > .18 && local < .52) {
            const source = this.buffers[0];
            for (let i = 0; i < 3; i++) {
                const y = 190 + i * 205;
                const shift = Math.sin(Math.floor(local * 18) * 2.7 + i) * 28 * o.intensity;
                c.drawImage(source, 0, y / H * source.height, source.width, 17 / H * source.height, shift, y, W, 17);
            }
        }
        if (romantic && o.atmosphere) this.hope.atmosphere(c, time, o.intensity, o.reduced, o.quality === "lite", shot.art === "night" || shot.art === "birthday", time / ENDING_DURATION);
        const fade = o.hold || o.reduced ? 0 : 1 - smooth(time / 1.15) * smooth((ENDING_DURATION - time) / (romantic ? 2.3 : 1.7));
        if (fade > 0) { c.fillStyle = romantic ? `rgba(255,246,237,${fade})` : `rgba(17,16,24,${fade})`; c.fillRect(0, 0, W, H); }
        const opacity = o.hold ? 0 : o.reduced ? 1 : smooth((local - .8) / 1.1) * smooth((shot.seconds - local - .3) / .9) * (1 - fade);
        return { index, card: shot.card, opacity, label: shot.label };
    }
}
