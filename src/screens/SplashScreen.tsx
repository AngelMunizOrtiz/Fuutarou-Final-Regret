import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_MENU_ROUTE } from "../constans";
import useAudioSettingsStore from "../stores/useAudioSettingsStore";

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const masterVolume = useAudioSettingsStore((state) => state.volume);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const audio = new Audio();
        audio.src = "/audio/bgm/splash.wav";
        audio.preload = "metadata";
        audio.loop = true;
        audio.volume = 0.55 * useAudioSettingsStore.getState().volume;
        audioRef.current = audio;
        void audio.play().catch(() => undefined);

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

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = 0.55 * masterVolume;
    }, [masterVolume]);

    const finishSplash = useCallback(() => {
        onFinish();
        navigate(MAIN_MENU_ROUTE);
    }, [navigate, onFinish]);

    const handleGoToMenu = useCallback(() => {
        if (isExiting) return;

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
    }, [finishSplash, isExiting]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F12" || event.key === "F5") return;
            handleGoToMenu();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleGoToMenu]);

    return (
        <main
            className={`pointer-events-auto fixed inset-0 z-[9000] overflow-hidden bg-[#090916] transition-opacity duration-700 ${
                isExiting ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleGoToMenu}
        >
            <img
                src='/images/bg_title.webp'
                className='absolute inset-0 h-full w-full select-none object-contain'
                alt='Fuutarou Final Regret'
                draggable={false}
                fetchPriority='high'
            />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(4,3,12,0.44)_100%)]' />

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
        </main>
    );
}
