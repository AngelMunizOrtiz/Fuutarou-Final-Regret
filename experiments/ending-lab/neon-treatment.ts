// Canvas-native graphic treatment. Quantization is cached per source texture,
// never run over the full output framebuffer on every animation frame.
export class NeonTreatment {
    private cache = new Map<string, HTMLCanvasElement>();
    private echoes = new Map<string, HTMLCanvasElement>();
    clear() { this.cache.clear(); this.echoes.clear(); }
    release(image: HTMLImageElement) {
        this.cache.delete(`${image.src}:false`); this.cache.delete(`${image.src}:true`);
    }
    plate(image: HTMLImageElement, portrait = false) {
        const key = `${image.src}:${portrait}`;
        const existing = this.cache.get(key);
        if (existing) return existing;
        const plate = document.createElement("canvas");
        plate.width = image.naturalWidth; plate.height = image.naturalHeight;
        const c = plate.getContext("2d", { willReadFrequently: true })!;
        c.drawImage(image, 0, 0);
        const pixels = c.getImageData(0, 0, plate.width, plate.height);
        const p = pixels.data;
        for (let i = 0; i < p.length; i += 4) {
            const r = p[i], g = p[i + 1], b = p[i + 2];
            const luma = .2126 * r + .7152 * g + .0722 * b;
            let color: readonly number[];
            if (luma < 48) color = [15, 25, 95];
            else if (portrait && r > g * 1.28 && g > b * 1.35 && r - b > 80) color = luma < 130 ? [183, 0, 107] : [255, 0, 101];
            else if (luma < 100) color = [0, 83, 158];
            else if (luma < 153) color = [0, 169, 207];
            else if (luma < 212 || portrait) color = [0, 236, 231];
            else color = [250, 255, 0];
            p[i] = color[0]; p[i + 1] = color[1]; p[i + 2] = color[2];
        }
        c.putImageData(pixels, 0, 0); this.cache.set(key, plate); return plate;
    }
    echo(image: HTMLImageElement, color: string) {
        const key = image.src + color;
        const existing = this.echoes.get(key);
        if (existing) return existing;
        const plate = document.createElement("canvas"); plate.width = image.naturalWidth; plate.height = image.naturalHeight;
        const c = plate.getContext("2d")!; c.drawImage(image, 0, 0);
        c.globalCompositeOperation = "source-in"; c.fillStyle = color; c.fillRect(0, 0, plate.width, plate.height);
        this.echoes.set(key, plate); return plate;
    }
    prepare(images: HTMLImageElement[], child: HTMLImageElement, eyes: HTMLImageElement) {
        for (const image of images) this.plate(image);
        this.plate(child, true); this.plate(eyes, true);
        this.echo(child, "#ff0065"); this.echo(child, "#00eae4");
    }
    backdrop(c: CanvasRenderingContext2D, t: number, strength: number) {
        c.fillStyle = "#faff00"; c.fillRect(0, 0, 1672, 941);
        c.save();
        c.fillStyle = "#ff0065";
        c.beginPath(); c.moveTo(1140, 0); c.lineTo(1672, 0); c.lineTo(1672, 941); c.lineTo(920 + Math.sin(t * .25) * 18 * strength, 941); c.closePath(); c.fill();
        c.fillStyle = "#14215f";
        for (let i = 0; i < 12; i++) {
            c.beginPath(); c.moveTo(30 + i * 24, 805); c.lineTo(40 + i * 24, 805); c.lineTo(86 + i * 24, 735); c.lineTo(76 + i * 24, 735); c.fill();
        }
        c.globalAlpha = .24;
        for (let y = 78; y < 260; y += 14) for (let x = 1360; x < 1630; x += 14) {
            c.beginPath(); c.arc(x, y, 2, 0, Math.PI * 2); c.fill();
        }
        c.restore();
    }
    marks(c: CanvasRenderingContext2D, t: number, strength: number, reduced: boolean) {
        c.save();
        const drift = reduced ? 0 : Math.sin(t * .7) * 12 * strength;
        c.fillStyle = "#faff00"; c.fillRect(52, 79, 110 + drift, 8);
        c.fillStyle = "#ff0065"; c.fillRect(52, 94, 55, 8);
        c.strokeStyle = "#faff00"; c.lineWidth = 3;
        c.beginPath(); c.moveTo(1536, 775); c.lineTo(1575, 775); c.lineTo(1575, 816); c.stroke();
        c.beginPath(); c.moveTo(1450, 837); c.lineTo(1575, 837); c.stroke();
        c.globalAlpha = .08 * strength; c.fillStyle = "#091658";
        for (let y = 0; y < 941; y += 7) c.fillRect(0, y, 1672, 1);
        c.restore();
    }
}
