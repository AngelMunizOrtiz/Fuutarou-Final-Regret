// src/screens/SplashScreen.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_MENU_ROUTE } from "../constans";

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const navigate = useNavigate();
    const [hasStarted, setHasStarted] = useState(false); // Estado para el primer clic
    const [isExiting, setIsExiting] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Inicializar audio
    useEffect(() => {
        audioRef.current = new Audio("/audio/bgm/splash.wav");
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleStart = () => {
        if (hasStarted) return;
        setHasStarted(true);
        if (audioRef.current) {
            audioRef.current.play().catch(_ => console.log("Audio bloqueado"));
        }
    };

    const handleGoToMenu = () => {
        if (isExiting) return;
        setIsExiting(true);

        // Transición de audio: bajar volumen antes de cambiar
        const fadeAudio = setInterval(() => {
            if (audioRef.current && audioRef.current.volume > 0.1) {
                audioRef.current.volume -= 0.1;
            } else {
                clearInterval(fadeAudio);
                onFinish();
                navigate(MAIN_MENU_ROUTE);
            }
        }, 50);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!hasStarted) handleStart();
            else if (e.key !== "F12" && e.key !== "F5") handleGoToMenu();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasStarted, isExiting]);

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">

            {!hasStarted ? (
                /* PANTALLA NEGRA INICIAL PARA DESBLOQUEAR AUDIO */
                <div
                    className="z-50 flex flex-col items-center justify-center cursor-pointer animate-pulse"
                    onClick={handleStart}
                >
                    <p className="text-white text-2xl font-serif tracking-widest">CLIC PARA INICIAR</p>
                </div>
            ) : (
                /* CONTENIDO DEL SPLASH (Solo aparece tras el clic) */
                <div
                    className={`relative w-full h-full transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                    onClick={handleGoToMenu}
                >
                    <div className="absolute inset-0">
                        <img
                            src="/images/bg_title.webp"
                            className="w-full h-full object-contain bg-black select-none"
                            alt="Background"
                        />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative aspect-video h-full max-w-full">
                            <div className="absolute right-[5%] bottom-[10%] flex flex-col items-center gap-2">
                                <img
                                    src="/images/logo_game.webp"
                                    style={{ width: '280px' }}
                                    className="h-auto animate-in fade-in slide-in-from-bottom-2 duration-1000"
                                    alt="Game Logo"
                                />
                                <img
                                    src="/images/pressanybutton.webp"
                                    style={{ width: '300px' }}
                                    className="h-auto animate-pulse duration-[1.4s] mt-2"
                                    alt="Press Any Button"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}