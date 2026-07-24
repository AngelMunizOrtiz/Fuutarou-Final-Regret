import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { getInitialGameLanguage } from "../i18n";

type LoadingScreenProps = {
    label?: string;
    exiting?: boolean;
};

const QUINTUPLET_NAMES = ["Ichika", "Nino", "Miku", "Yotsuba", "Itsuki"] as const;

export default function LoadingScreen({ label, exiting = false }: LoadingScreenProps) {
    const { t, i18n } = useTranslation(["ui"]);
    const initialLanguage = getInitialGameLanguage();
    const loadingLabel =
        label ??
        (i18n.isInitialized
            ? t("loading_memories")
            : initialLanguage === "es"
              ? "Cargando recuerdos…"
              : "Loading memories…");
    const waitLabel = i18n.isInitialized
        ? t("please_wait")
        : initialLanguage === "es"
          ? "Por favor, espera."
          : "Please wait.";

    return (
        <div
            className={`vn-loading-screen${exiting ? " vn-loading-screen--exit" : ""}`}
            role='status'
            aria-live='polite'
            aria-label={loadingLabel}
        >
            <div className='vn-loading-aurora' aria-hidden='true' />
            <div className='vn-marble-stage' aria-hidden='true'>
                <div className='vn-marble-orbit'>
                    {QUINTUPLET_NAMES.map((name, index) => (
                        <span
                            key={name}
                            className={`vn-marble-runner vn-marble--${name.toLowerCase()}`}
                            style={{ "--marble-index": index } as CSSProperties}
                        >
                            <span className='vn-marble-trail' />
                            <span className='vn-marble-floor-shadow' />
                            <span className={`vn-marble vn-marble--${name.toLowerCase()}`}>
                                <span className='vn-marble-core' />
                            </span>
                        </span>
                    ))}
                </div>
                <div className='vn-marble-horizon' />
            </div>
            <div className='vn-loading-copy'>
                <span className='vn-loading-kicker'>Fuutarou's Final Regret</span>
                <span className='vn-loading-label'>{loadingLabel}</span>
            </div>
            <span className='vn-loading-sr-only'>{waitLabel}</span>
        </div>
    );
}
