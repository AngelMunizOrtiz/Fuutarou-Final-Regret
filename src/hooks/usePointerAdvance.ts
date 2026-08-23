import { useEffect, useRef } from "react";

type PointerAdvanceOptions = {
    disabled?: boolean;
    onAdvance: () => void | Promise<unknown>;
};

type PointerGesture = {
    id: number;
    startedAt: number;
    x: number;
    y: number;
};

const MAX_TAP_DISTANCE_PX = 22;
const MAX_TAP_DURATION_MS = 900;
const MIN_ADVANCE_INTERVAL_MS = 160;

const INTERACTIVE_TARGET_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "label",
    "select",
    "summary",
    "textarea",
    "[contenteditable='true']",
    "[role='button']",
    "[role='link']",
    "[role='menuitem']",
    "[role='option']",
    "[role='slider']",
    "[data-story-advance='ignore']",
].join(",");

const BLOCKING_OVERLAY_SELECTOR = [
    "dialog[open]",
    "[aria-expanded='true']",
    "[aria-modal='true']",
    "[role='dialog']",
    "[role='menu']",
    "[data-story-advance='block']",
].join(",");

function isPrimaryPointer(event: PointerEvent) {
    if (!event.isPrimary) return false;
    return event.pointerType !== "mouse" || event.button === 0;
}

function isInteractiveTarget(target: EventTarget | null) {
    return target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGET_SELECTOR));
}

function hasBlockingOverlay() {
    return Boolean(document.querySelector(BLOCKING_OVERLAY_SELECTOR));
}

/**
 * Advances a visual-novel scene from a short primary-pointer tap. Pointer
 * events cover mouse, touch and pen without synthesised click delays. Controls,
 * choices and modal overlays are excluded so a UI action cannot also advance
 * the story underneath it.
 */
export default function usePointerAdvance({ disabled = false, onAdvance }: PointerAdvanceOptions) {
    const advanceRef = useRef(onAdvance);
    const disabledRef = useRef(disabled);
    const gestureRef = useRef<PointerGesture | null>(null);
    const lastAdvanceAtRef = useRef(0);

    useEffect(() => {
        advanceRef.current = onAdvance;
    }, [onAdvance]);

    useEffect(() => {
        disabledRef.current = disabled;
        if (disabled) gestureRef.current = null;
    }, [disabled]);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (
                disabledRef.current ||
                !isPrimaryPointer(event) ||
                isInteractiveTarget(event.target) ||
                hasBlockingOverlay()
            ) {
                gestureRef.current = null;
                return;
            }

            gestureRef.current = {
                id: event.pointerId,
                startedAt: performance.now(),
                x: event.clientX,
                y: event.clientY,
            };
        };

        const handlePointerUp = (event: PointerEvent) => {
            const gesture = gestureRef.current;
            gestureRef.current = null;

            if (
                !gesture ||
                gesture.id !== event.pointerId ||
                disabledRef.current ||
                !isPrimaryPointer(event) ||
                isInteractiveTarget(event.target) ||
                hasBlockingOverlay()
            ) {
                return;
            }

            const elapsed = performance.now() - gesture.startedAt;
            const distance = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y);
            const now = performance.now();

            if (
                elapsed > MAX_TAP_DURATION_MS ||
                distance > MAX_TAP_DISTANCE_PX ||
                now - lastAdvanceAtRef.current < MIN_ADVANCE_INTERVAL_MS
            ) {
                return;
            }

            lastAdvanceAtRef.current = now;
            void advanceRef.current();
        };

        const cancelGesture = () => {
            gestureRef.current = null;
        };

        window.addEventListener("pointerdown", handlePointerDown, { passive: true });
        window.addEventListener("pointerup", handlePointerUp, { passive: true });
        window.addEventListener("pointercancel", cancelGesture, { passive: true });

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", cancelGesture);
        };
    }, []);
}
