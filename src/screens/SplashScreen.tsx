import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_MENU_ROUTE } from "../constans";

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const navigate = useNavigate();
    const [hasStarted, setHasStarted] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const audio = new Audio();
        audio.src = "/audio/bgm/splash.wav";
        audio.preload = "metadata";
        audio.loop = true;
        audio.volume = 0.55;
        audioRef.current = audio;

        return () => {
            if (fadeFrameRef.current !== null) {
                window.cancelAnimationFrame(fadeFrameRef.current);
            }
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            audioRef.current = null;
        };
    }, []);

    const handleStart = useCallback(() => {
        if (hasStarted || isExiting) return;

        setHasStarted(true);
        void audioRef.current?.play().catch(() => undefined);
    }, [hasStarted, isExiting]);

    const finishSplash = useCallback(() => {
        onFinish();
        navigate(MAIN_MENU_ROUTE);
    }, [navigate, onFinish]);

    const handleGoToMenu = useCallback(() => {
        if (!hasStarted || isExiting) return;

        setIsExiting(true);
        const audio = audioRef.current;
        if (!audio || audio.paused) {
            finishSplash();
            return;
        }

        const fadeAudio = () => {
            audio.volume = Math.max(0, audio.volume - 0.045);
            if (audio.volume > 0) {
                fadeFrameRef.current = window.requestAnimationFrame(fadeAudio);
                return;
            }

            audio.pause();
            fadeFrameRef.current = null;
            finishSplash();
        };

        fadeFrameRef.current = window.requestAnimationFrame(fadeAudio);
    }, [finishSplash, hasStarted, isExiting]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F12" || event.key === "F5") return;
            if (!hasStarted) {
                handleStart();
                return;
            }
            handleGoToMenu();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleGoToMenu, handleStart, hasStarted]);

    return (
        <main
            className={`pointer-events-auto fixed inset-0 z-[9000] overflow-hidden bg-[#090916] transition-opacity duration-700 ${
                isExiting ? "opacity-0" : "opacity-100"
            }`}
            onClick={hasStarted ? handleGoToMenu : handleStart}
        >
            <img
                src='/images/bg_title.webp'
                className='absolute inset-0 h-full w-full select-none object-contain'
                alt='Fuutarou Final Regret'
                draggable={false}
                fetchPriority='high'
            />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(4,3,12,0.44)_100%)]' />

            {!hasStarted ? (
                <button
                    type='button'
                    className='pointer-events-auto absolute bottom-[9%] left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 border-0 bg-transparent px-8 py-5 text-white'
                    aria-label='Iniciar experiencia'
                    onClick={(event) => {
                        event.stopPropagation();
                        handleStart();
                    }}
                >
                    <span className='flex gap-2' aria-hidden='true'>
                        <span className='h-2.5 w-2.5 rounded-full bg-[var(--quint-ichika)] shadow-[0_0_12px_var(--quint-ichika)]' />
                        <span className='h-2.5 w-2.5 rounded-full bg-[var(--quint-nino)] shadow-[0_0_12px_var(--quint-nino)]' />
                        <span className='h-2.5 w-2.5 rounded-full bg-[var(--quint-miku)] shadow-[0_0_12px_var(--quint-miku)]' />
                        <span className='h-2.5 w-2.5 rounded-full bg-[var(--quint-yotsuba)] shadow-[0_0_12px_var(--quint-yotsuba)]' />
                        <span className='h-2.5 w-2.5 rounded-full bg-[var(--quint-itsuki)] shadow-[0_0_12px_var(--quint-itsuki)]' />
                    </span>
                    <span className='font-[MPLUSRounded] text-sm font-black tracking-[0.32em] text-white/90 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] sm:text-lg'>
                        CLIC PARA INICIAR
                    </span>
                </button>
            ) : (
                <button
                    type='button'
                    className='pointer-events-auto absolute inset-0 z-10 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0'
                    aria-label='Ir al menú principal'
                    onClick={(event) => {
                        event.stopPropagation();
                        handleGoToMenu();
                    }}
                >
                    <div className='relative aspect-video h-full max-w-full'>
                        <div className='absolute right-[5%] bottom-[10%] flex flex-col items-center gap-2'>
                            <img
                                src='/images/logo_game.webp'
                                className='h-auto w-[clamp(190px,18vw,280px)] motion-blur-in-md'
                                alt='Fuutarou Final Regret'
                                draggable={false}
                            />
                            <img
                                src='/images/pressanybutton.webp'
                                className='mt-2 h-auto w-[clamp(210px,20vw,300px)] animate-pulse'
                                alt='Presiona cualquier botón'
                                draggable={false}
                            />
                        </div>
                    </div>
                </button>
            )}
        </main>
    );
}
