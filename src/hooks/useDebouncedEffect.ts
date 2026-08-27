import { useEffect, useRef, type DependencyList } from "react";

/**
 * A custom hook that debounces a callback function.
 * @param callback The callback function to debounce.
 * @param options The options object.
 * @param dependencies The dependencies array that determines when to re-run the effect.
 */
export default function useDebouncedEffect(
    callback: () => void,
    options: {
        /**
         * The delay in milliseconds before the callback is executed.
         * @default 1000
         */
        delay?: number;
        /**
         * Whether the effect is enabled or not.
         * @default true
         */
        enabled?: boolean;
    } = {},
    dependencies: DependencyList = []
) {
    const { delay = 1000, enabled = true } = options;
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (enabled && delay > 0) {
            const timeout = window.setTimeout(() => callbackRef.current(), delay);
            return () => clearTimeout(timeout);
        }
    }, [delay, enabled, ...dependencies]);
}
