import stills from "./mitsuki-assets.json";
import motion from "./mitsuki-motion.json";
export type Art = keyof typeof stills | keyof typeof motion;
export type MotionArt = keyof typeof motion;
export type Point = readonly [number, number];
export type Stage = "arrival" | "discover" | "home" | "grow";
export const stages: Record<Stage, string> = {
    arrival: "01 · Desde que llegaste", discover: "02 · Descubrir el mundo",
    home: "03 · Los días contigo", grow: "04 · Todo lo que vendrá",
};
export type Card = { kicker: string; title: string; note: string; side?: "left" | "right"; small?: boolean; lower?: boolean };
export type Shot = { art: Art; label: string; stage: Stage; seconds: number; zoom: Point; from: Point; to: Point;
    transition?: "dissolve" | "light" | "wipe" | "cut"; hopeTransition?: "bloom" | "light" | "dissolve" | "memory";
    frames?: Point; tilt?: Point; panels?: boolean; card?: Card };
const direction: Shot[] = [
    { art: "birth", stage: "arrival", label: "Miku y su recién nacida", seconds: 7, zoom: [1.04, 1.10], from: [.5, .5], to: [.54, .48],
        card: { kicker: "FUUTAROU FINAL REGRET", title: "Desde que\nllegaste.", note: "Todos los días, contigo." } },
    { art: "birth", stage: "arrival", label: "El primer abrazo", seconds: 3, zoom: [1.4, 1.47], from: [.65, .48], to: [.64, .47], frames: [.55, 1], hopeTransition: "bloom" },
    { art: "waking", stage: "arrival", label: "Un pequeño despertar", seconds: 8, zoom: [1.02, 1.07], from: [.5, .5], to: [.5, .47], hopeTransition: "light" },
    { art: "morningHug", stage: "arrival", label: "Esos brazos que te buscan", seconds: 4, zoom: [1.04, 1.01], from: [.5, .5], to: [.5, .5], transition: "cut", hopeTransition: "dissolve" },
    { art: "motherKiss", stage: "arrival", label: "Un beso de mamá", seconds: 5, zoom: [1.05, 1.11], from: [.5, .5], to: [.51, .47], hopeTransition: "bloom" },
    { art: "fatherKiss", stage: "arrival", label: "Y otro de papá", seconds: 5, zoom: [1.1, 1.03], from: [.52, .47], to: [.5, .5], hopeTransition: "dissolve" },
    { art: "farm", stage: "discover", label: "El mundo entre tus brazos", seconds: 6, zoom: [1.04, 1.1], from: [.5, .5], to: [.52, .49], hopeTransition: "light",
        card: { kicker: "DESCUBRIR EL MUNDO", title: "Todo parece\nnuevo.", note: "", side: "right", small: true, lower: true } },
    { art: "steps", stage: "discover", label: "Los primeros pasos", seconds: 5, zoom: [1.02, 1.06], from: [.5, .5], to: [.5, .5], hopeTransition: "bloom" },
    { art: "littleWorld", stage: "discover", label: "Cada pequeño intento", seconds: 4, zoom: [1.07, 1.12], from: [.5, .5], to: [.5, .5], tilt: [-.25, .25], hopeTransition: "memory" },
    { art: "pants", stage: "home", label: "No te vayas todavía", seconds: 4, zoom: [1.05, 1.11], from: [.5, .5], to: [.52, .48], hopeTransition: "light" },
    { art: "sleeve", stage: "home", label: "Una mano que no quiere soltarte", seconds: 6, zoom: [1.04, 1.09], from: [.5, .5], to: [.53, .48], hopeTransition: "dissolve" },
    { art: "hero", stage: "home", label: "La mirada de Mitsuki", seconds: 5, zoom: [1.05, 1.12], from: [.51, .48], to: [.53, .46], hopeTransition: "bloom",
        card: { kicker: "LOS DÍAS CONTIGO", title: "En las cosas\nmás pequeñas.", note: "", small: true } },
    { art: "comfort", stage: "home", label: "Mamá siempre está aquí", seconds: 6, zoom: [1.06, 1.16], from: [.49, .49], to: [.45, .48], hopeTransition: "dissolve" },
    { art: "secret", stage: "home", label: "La lección secreta de Raiha", seconds: 6, zoom: [1.1, 1.25], from: [.45, .48], to: [.4, .46], tilt: [-.25, .15], hopeTransition: "memory" },
    { art: "night", stage: "home", label: "El final de un día en casa", seconds: 4, zoom: [1.04, 1.09], from: [.5, .5], to: [.53, .48], hopeTransition: "light" },
    { art: "cuteBubble", stage: "home", label: "A la mañana siguiente", seconds: 4, zoom: [1.05, 1.13], from: [.5, .5], to: [.53, .47], hopeTransition: "bloom" },
    { art: "armsUp", stage: "home", label: "Aprendiendo a pedir un abrazo", seconds: 5, zoom: [1.03, 1.09], from: [.5, .5], to: [.52, .47], hopeTransition: "dissolve" },
    { art: "cute", stage: "home", label: "Un poquito más cerca", seconds: 4, zoom: [1.15, 1.08], from: [.54, .47], to: [.51, .48], hopeTransition: "bloom" },
    { art: "father", stage: "home", label: "Papá no sabe decir que no", seconds: 4, zoom: [1.05, 1.14], from: [.5, .48], to: [.5, .44], hopeTransition: "dissolve" },
    { art: "door", stage: "home", label: "La puerta de casa", seconds: 4, zoom: [1.14, 1.04], from: [.53, .47], to: [.5, .5], hopeTransition: "light" },
    { art: "pantsBubble", stage: "home", label: "El plan funciona", seconds: 3, zoom: [1.04, 1.10], from: [.51, .5], to: [.53, .49], hopeTransition: "memory" },
    { art: "carry", stage: "home", label: "Nos vamos juntos", seconds: 6, zoom: [1.14, 1.03], from: [.56, .42], to: [.5, .5], hopeTransition: "bloom" },
    { art: "nino", stage: "home", label: "También están las tías", seconds: 4, zoom: [1.03, 1.07], from: [.5, .5], to: [.5, .5], tilt: [-.35, .2], hopeTransition: "memory" },
    { art: "hero", stage: "home", label: "Un hogar entre todos", seconds: 4, zoom: [1.05, 1.1], from: [.5, .5], to: [.5, .5], panels: true, hopeTransition: "light" },
    { art: "lemonHands", stage: "grow", label: "Manos que aprenden", seconds: 4, zoom: [1.03, 1.08], from: [.5, .5], to: [.51, .5], hopeTransition: "bloom" },
    { art: "lemonGirl", stage: "grow", label: "Una pequeña cocinera", seconds: 5, zoom: [1.03, 1.10], from: [.5, .5], to: [.51, .47], hopeTransition: "dissolve" },
    { art: "lemonProud", stage: "grow", label: "Mira lo que ya puedo hacer", seconds: 5, zoom: [1.10, 1.03], from: [.52, .47], to: [.5, .5], hopeTransition: "memory" },
    { art: "birthday", stage: "grow", label: "Otro año de recuerdos", seconds: 8, zoom: [1.03, 1.10], from: [.5, .5], to: [.55, .48], frames: [0, .86], hopeTransition: "light" },
    { art: "birthday", stage: "grow", label: "Y todos los días que vendrán", seconds: 6, zoom: [1.16, 1.03], from: [.56, .42], to: [.5, .5], frames: [.76, 1], hopeTransition: "bloom",
        card: { kicker: "FUUTAROU FINAL REGRET", title: "Lo mejor aún\nestá por venir.", note: "Gracias por llegar hasta aquí.", small: true, lower: true } },
];
let start = 0;
export const shots = direction.map(shot => { const result = { ...shot, start }; start += shot.seconds; return result; });
export const ENDING_DURATION = start;
export const shotAt = (time: number) => {
    for (let i = shots.length - 1; i >= 0; i--) if (time >= shots[i].start) return i;
    return 0;
};
export const isMotion = (art: Art): art is MotionArt => Object.hasOwn(motion, art);
export { motion };
