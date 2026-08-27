import { useEffect, useRef } from "react";

export default function useEventListener<K extends keyof WindowEventMap>({
    type,
    listener,
}: {
    type: K;
    listener: (this: Window, ev: WindowEventMap[K]) => any;
}) {
    // Keep one DOM listener per event type. Several game hooks pass inline
    // callbacks; re-binding those listeners on every render adds avoidable
    // work and used to leave a stale callback because the effect depended on
    // the global `window.onkeydown` property by mistake.
    const listenerRef = useRef(listener);

    useEffect(() => {
        listenerRef.current = listener;
    }, [listener]);

    useEffect(() => {
        const handleEvent = (event: WindowEventMap[K]) => {
            listenerRef.current.call(window, event);
        };

        // The DOM overload cannot preserve the generic event map through the
        // ref wrapper; the runtime listener is still the same event type.
        window.addEventListener(type, handleEvent as never);

        return () => {
            window.removeEventListener(type, handleEvent as never);
        };
    }, [type]);

    return null;
}
