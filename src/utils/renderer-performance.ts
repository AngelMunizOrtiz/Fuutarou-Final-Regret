import { canvas } from "@drincs/pixi-vn";
import { performanceProfile } from "./performance-profile";

let configured = false;
let idleTimer: number | undefined;

/**
 * Pixi's ticker is useful while a scene changes, but a visual-novel frame is
 * static most of the time. Sleeping it after the transition removes the
 * permanent WebGL redraw that was especially expensive inside Android WebView.
 */
export function configureCanvasRendererPerformance() {
    if (configured) return;
    configured = true;

    const wake = () => wakeCanvasRenderer();
    window.addEventListener("pointerdown", wake, { capture: true, passive: true });
    window.addEventListener("touchstart", wake, { capture: true, passive: true });
    window.addEventListener("keydown", wake, { capture: true });
    window.addEventListener("wheel", wake, { capture: true, passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) sleepCanvasRenderer();
        else wakeCanvasRenderer();
    });

    wakeCanvasRenderer();
}

export function wakeCanvasRenderer(activeForMs = performanceProfile.rendererIdleSleepMs) {
    try {
        canvas.app.ticker.start();
    } catch {
        return;
    }

    if (idleTimer !== undefined) window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
        idleTimer = undefined;
        if (!document.hidden) sleepCanvasRenderer();
    }, activeForMs);
}

export function sleepCanvasRenderer() {
    if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
        idleTimer = undefined;
    }
    try {
        canvas.app.ticker.stop();
    } catch {
        // Game.init has not completed yet.
    }
}
