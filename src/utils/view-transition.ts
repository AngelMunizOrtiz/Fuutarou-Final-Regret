type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => void | Promise<void>) => {
        finished: Promise<void>;
        ready: Promise<void>;
        updateCallbackDone: Promise<void>;
        skipTransition: () => void;
    };
};

export function runViewTransition(callback: () => void | Promise<void>) {
    const startViewTransition = (document as ViewTransitionDocument).startViewTransition?.bind(document);

    if (!startViewTransition) {
        void callback();
        return;
    }

    try {
        startViewTransition(callback);
    } catch {
        void callback();
    }
}
