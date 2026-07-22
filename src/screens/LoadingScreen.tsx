type LoadingScreenProps = {
    label?: string;
};

const QUINTUPLET_NAMES = ["Ichika", "Nino", "Miku", "Yotsuba", "Itsuki"] as const;

export default function LoadingScreen({ label = "Cargando recuerdos…" }: LoadingScreenProps) {
    return (
        <div className='vn-loading-screen' role='status' aria-live='polite' aria-label={label}>
            <div className='vn-loading-aurora' aria-hidden='true' />
            <div className='vn-marble-stage' aria-hidden='true'>
                <div className='vn-marble-orbit'>
                    {QUINTUPLET_NAMES.map((name, index) => (
                        <span
                            key={name}
                            className={`vn-marble vn-marble--${name.toLowerCase()}`}
                            style={{ "--marble-index": index } as CSSProperties}
                        />
                    ))}
                </div>
                <div className='vn-marble-shadow' />
            </div>
            <div className='vn-loading-copy'>
                <span className='vn-loading-kicker'>Fuutarou's Final Regret</span>
                <span className='vn-loading-label'>{label}</span>
            </div>
            <span className='vn-loading-sr-only'>Por favor, espera.</span>
        </div>
    );
}
import type { CSSProperties } from "react";
