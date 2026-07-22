// src/data/dreamSequence.ts

export interface DreamFragment {
    id: number;
    text: string | null;
    image: string;
    mediaType?: "image" | "video";
    layout?: "dialogue" | "intro" | "info" | "note";
    title?: string;
    subtitle?: string;
    details?: string[];
    speaker?: string;
    isThought?: boolean;
    filter?: string;
    isDream?: boolean;
    autoAdvanceMs?: number;
    flash?: boolean;
    advanceOnVideoEnd?: boolean;
}

export const fuutarouDream: DreamFragment[] = [
    // --- FASE 1: INICIO DE LA PESADILLA (Contexto previo) ---
    { id: 1, text: null, image: '/images/memories/frame1.webp', isDream: false, autoAdvanceMs: 1000 },
    { id: 2, text: null, image: '/images/memories/frame2.webp', isDream: false, autoAdvanceMs: 1000 },
    { id: 3, text: null, image: '/images/memories/frame3.webp', isDream: false, autoAdvanceMs: 1000 },
    { id: 4, text: null, image: '/images/memories/frame4.webp', isDream: false, autoAdvanceMs: 1000 },

    // --- FASE 2: LOS RECUERDOS (Por clics) ---
    { id: 5, text: '"Uesugi-san!"', image: '/images/memories/Arrepentimiento Final.webp', speaker: '¿?', isDream: true },
    { id: 6, text: '"There\'s still a lot I\'m holding back."', image: '/images/memories/Arrepentimiento Final2.webp', speaker: '¿?', isDream: true },
    { id: 7, text: '[Why?]', image: '/images/memories/Arrepentimiento Final2.webp', isThought: true, isDream: true },
    { id: 8, text: '"Next... It\'s your turn"', image: '/images/memories/Arrepentimiento Final3.webp', speaker: '¿?', isDream: true },
    { id: 9, text: '"Please... Don\'t say you won\'t pick anyone."', image: '/images/memories/Arrepentimiento Final4.webp', speaker: '¿?', isDream: true },
    { id: 10, text: '"Let\'s work hard together!"', image: '/images/memories/Arrepentimiento Final5.webp', speaker: '¿?', isDream: true },
    { id: 11, text: '[I only... wanted to be needed]', image: '/images/memories/Arrepentimiento Final5.webp', isThought: true, isDream: true },
    { id: 12, text: '"Fuutarou"', image: '/images/memories/Arrepentimiento Final6.webp', speaker: '¿?', filter: 'blur(2px) opacity(0.8)', isDream: true },

    // --- FASE 3: EL DESPERTAR (Automático por ID >= 13) ---
    { id: 13, text: null, image: '/images/memories/frame5.webp', isDream: false, autoAdvanceMs: 800 },
    { id: 14, text: null, image: '/images/memories/frame5_5.webp', isDream: false, autoAdvanceMs: 800 },
    { id: 15, text: null, image: '/images/memories/frame6.webp', isDream: false, autoAdvanceMs: 800 },
    { id: 16, text: '"...!"', image: '/images/memories/frame7.webp', speaker: 'Fuutarou', isDream: false, flash: true }
];
