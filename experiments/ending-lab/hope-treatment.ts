// Soft pastel grading is baked into an in-memory texture once per source.
// The moving light and petals use small reusable sprites, without frame readbacks.
export class HopeTreatment {
    private plates = new Map<HTMLImageElement, HTMLCanvasElement>();
    private glow = document.createElement("canvas");
    private petal = document.createElement("canvas");
    constructor() {
        this.glow.width = this.glow.height = 96;
        const g = this.glow.getContext("2d")!;
        const light = g.createRadialGradient(48, 48, 2, 48, 48, 48);
        light.addColorStop(0, "#fffcebc9"); light.addColorStop(.28, "#ffebdb6b"); light.addColorStop(1, "#ffd3d800");
        g.fillStyle = light; g.fillRect(0, 0, 96, 96);
        this.petal.width = this.petal.height = 72;
        const p = this.petal.getContext("2d")!;
        const rose = p.createLinearGradient(14, 8, 49, 61);
        rose.addColorStop(0, "#fffaf4"); rose.addColorStop(.5, "#f8d1da"); rose.addColorStop(1, "#dc8fad");
        p.fillStyle = rose;
        p.beginPath(); p.moveTo(48, 10); p.bezierCurveTo(13, 6, 10, 38, 29, 62);
        p.bezierCurveTo(57, 53, 63, 31, 48, 10); p.fill();
        p.strokeStyle = "#fff8f28a"; p.lineWidth = 1.5;
        p.beginPath(); p.moveTo(29, 58); p.quadraticCurveTo(30, 30, 47, 15); p.stroke();
    }
    clear() { this.plates.clear(); }
    release(image: HTMLImageElement) { this.plates.delete(image); }
    prepare(images: HTMLImageElement[]) { for (const image of images) this.plate(image); }
    plate(image: HTMLImageElement) {
        const cached = this.plates.get(image);
        if (cached) return cached;
        const plate = document.createElement("canvas");
        plate.width = image.naturalWidth; plate.height = image.naturalHeight;
        const c = plate.getContext("2d", { willReadFrequently: true })!;
        c.drawImage(image, 0, 0);
        const pixels = c.getImageData(0, 0, plate.width, plate.height), p = pixels.data;
        for (let i = 0; i < p.length; i += 4) {
            const highlight = (.2126 * p[i] + .7152 * p[i + 1] + .0722 * p[i + 2]) / 255;
            p[i] = p[i] * .94 + 12 + highlight * 6;
            p[i + 1] = p[i + 1] * .93 + 10 + highlight * 3;
            p[i + 2] = p[i + 2] * .92 + 19 - highlight * 11;
            // Alpha stays untouched, including the feathered eyelid patches.
        }
        c.putImageData(pixels, 0, 0); this.plates.set(image, plate); return plate;
    }
    atmosphere(c: CanvasRenderingContext2D, time: number, intensity: number, reduced: boolean, lite: boolean, night: boolean, journey = 0) {
        if (intensity === 0) return;
        const W = 1672, H = 941, t = reduced ? 0 : time;
        c.save(); c.globalCompositeOperation = "screen";
        // A large dawn glow at the frame edge, leaving the central faces readable.
        const x = 35 + Math.sin(t * .12) * 70;
        const dawn = c.createRadialGradient(x, 30, 0, x, 30, 1050);
        dawn.addColorStop(0, night ? "#ffdabab3" : "#fff9dfdb");
        dawn.addColorStop(.3, "#ffe1c563"); dawn.addColorStop(1, "#ffdfd000");
        c.globalAlpha = intensity * (night ? .42 : .64 + journey * .16); c.fillStyle = dawn; c.fillRect(0, 0, W, H);
        const rose = c.createRadialGradient(W + 30, H * .85, 0, W + 30, H * .85, 680);
        rose.addColorStop(0, "#f2bfdcb3"); rose.addColorStop(1, "#e9c6df00");
        c.globalAlpha = intensity * (.46 + journey * .16); c.fillStyle = rose; c.fillRect(0, 0, W, H);
        // A few out-of-focus circles; no blur pass over the whole scene.
        for (let i = 0; i < 8; i++) {
            const size = 75 + (i % 3) * 62;
            const side = i % 2 ? W - 120 : -20;
            const y = (i * 137 + t * (i % 2 ? -7 : 5) + H * 20) % (H + 240) - 120;
            const px = side + Math.sin(t * .14 + i * 1.7) * 95;
            c.globalAlpha = intensity * (.24 + .1 * Math.sin(t * .3 + i));
            c.drawImage(this.glow, px - size / 2, y - size / 2, size, size);
        }
        c.restore();
        if (reduced) return;
        // Petals travel through the outer thirds, with two speeds for depth.
        const count = lite ? 9 : 15;
        for (let i = 0; i < count; i++) {
            const progress = ((i * .137 + t * (.015 + i % 3 * .003)) % 1 + 1) % 1;
            const left = i % 2 === 0;
            const px = (left ? .03 + (i % 4) * .05 : .79 + (i % 4) * .05) * W + Math.sin(t * .4 + i * 2) * 36;
            const py = progress * (H + 160) - 80;
            const size = i % 4 === 0 ? 44 : 23 + i % 3 * 5;
            c.save(); c.translate(px, py); c.rotate(t * .22 + i * 1.6);
            c.scale(.62 + .38 * Math.abs(Math.sin(t * .55 + i)), 1);
            c.globalAlpha = intensity * (i % 4 === 0 ? .66 : .9);
            c.drawImage(this.petal, -size / 2, -size / 2, size, size); c.restore();
        }
    }
}
