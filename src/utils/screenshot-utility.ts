import { invoke } from "@tauri-apps/api/core";

const MAX_SCREENSHOT_DIMENSION = 4096;

function findGameCanvas() {
    const byId = document.getElementById("canvas");
    if (byId instanceof HTMLCanvasElement) return byId;

    const nested = byId?.querySelector<HTMLCanvasElement>("canvas");
    if (nested) return nested;

    return [...document.querySelectorAll<HTMLCanvasElement>("canvas")]
        .filter((item) => {
            const rect = item.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        })
        .sort((a, b) => b.width * b.height - a.width * a.height)[0];
}

async function waitForImage(image: HTMLImageElement) {
    if (!image.complete) {
        await new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
        });
    }

    if (image.decode) {
        await image.decode().catch(() => undefined);
    }
}

function toPngBlob(canvas: HTMLCanvasElement) {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("The screenshot canvas could not be encoded."));
        }, "image/png");
    });
}

function downloadInBrowser(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function captureGameScreenshot() {
    const sourceCanvas = findGameCanvas();
    if (!sourceCanvas) throw new Error("Game canvas not found.");

    const sourceRect = sourceCanvas.getBoundingClientRect();
    if (!sourceRect.width || !sourceRect.height) throw new Error("Game canvas is not visible.");

    const output = document.createElement("canvas");
    output.width = Math.min(sourceCanvas.width || 1920, MAX_SCREENSHOT_DIMENSION);
    output.height = Math.min(sourceCanvas.height || 1080, MAX_SCREENSHOT_DIMENSION);
    const context = output.getContext("2d");
    if (!context) throw new Error("2D screenshot context is unavailable.");

    context.drawImage(sourceCanvas, 0, 0, output.width, output.height);

    const scaleX = output.width / sourceRect.width;
    const scaleY = output.height / sourceRect.height;
    const sprites = [...document.querySelectorAll<HTMLImageElement>(".vn-character-slot img")];

    for (const sprite of sprites) {
        await waitForImage(sprite);
        if (!sprite.naturalWidth || !sprite.naturalHeight) continue;

        const rect = sprite.getBoundingClientRect();
        const targetX = (rect.left - sourceRect.left) * scaleX;
        const targetY = (rect.top - sourceRect.top) * scaleY;
        const targetWidth = rect.width * scaleX;
        const targetHeight = rect.height * scaleY;
        const body = sprite.closest<HTMLElement>(".vn-character-body");
        const bodyStyle = body ? window.getComputedStyle(body) : null;
        const flip = Number.parseFloat(body?.style.getPropertyValue("--character-flip") || "1");

        context.save();
        context.globalAlpha = Number.parseFloat(bodyStyle?.opacity || "1");
        if (bodyStyle?.filter && bodyStyle.filter !== "none") context.filter = bodyStyle.filter;

        if (flip < 0) {
            context.translate(targetX + targetWidth, targetY);
            context.scale(-1, 1);
            context.drawImage(sprite, 0, 0, targetWidth, targetHeight);
        } else {
            context.drawImage(sprite, targetX, targetY, targetWidth, targetHeight);
        }
        context.restore();
    }

    const blob = await toPngBlob(output);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `final-regret-${timestamp}.png`;

    if ("__TAURI_INTERNALS__" in window) {
        const bytes = Array.from(new Uint8Array(await blob.arrayBuffer()));
        return invoke<string>("save_screenshot", { bytes, fileName });
    }

    downloadInBrowser(blob, fileName);
    return fileName;
}
