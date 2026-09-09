import "./style.css";
import street from "./assets/street.webp";
import miku from "./assets/miku.webp";
import original from "./assets/original.webp";
import streetLite from "./assets/street-lite.webp";
import mikuLite from "./assets/miku-lite.webp";
import originalLite from "./assets/original-lite.webp";
import eyes from "./assets/eyes-closed.webp";
import { MitsukiEnding, ENDING_DURATION, shots, shotAt, thumbnail, stages, type EndingLook } from "./mitsuki-ending";
import referenceMusic from "./assets/mitsuki/reference.mp3";

type Mode = "live" | "original" | "ending";
type Quality = "lite" | "full";
type Experiment = "mitsuki" | "miku";
type Plates = { street: HTMLImageElement; miku: HTMLImageElement; original: HTMLImageElement; eyes: HTMLImageElement };
type Report = { durationSeconds: number; frames: number; renderedFps: number; intervalP95Ms: number;
    drawSubmissionP95Ms: number; intervalsOver50Ms: number; targetFps: number; quality: Quality;
    resolution: string; mode: Mode; experiment: Experiment; effects: object; userAgent: string; capturedAt: string; note: string };
const $ = <T extends HTMLElement>(id: string) => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing ending-lab element: ${id}`);
    return element as T;
};
const canvas = $<HTMLCanvasElement>("canvas");
const context = canvas.getContext("2d", { alpha: false });
if (!context) throw new Error("Este navegador no dispone de Canvas 2D.");
const ctx = context;
const scene = $("scene");
const viewer = $("viewer");
const play = $<HTMLButtonElement>("play");
const timeline = $<HTMLInputElement>("timeline");
const quality = $<HTMLSelectElement>("quality");
const credits = $("credits");
const reduceMedia = matchMedia("(prefers-reduced-motion: reduce)");
const abort = new AbortController();
const eventOptions = { signal: abort.signal };
const W = 1672, H = 941;
const search = new URLSearchParams(location.search);
const automaticLite = /android|iphone|ipad/i.test(navigator.userAgent) || navigator.hardwareConcurrency <= 4;
const state = {
    experiment: (search.get("scene") === "miku" ? "miku" : "mitsuki") as Experiment,
    mode: (search.get("scene") === "miku" ? "live" : "ending") as Mode, holdShot: 0,
    quality: (search.get("quality") === "lite" ||
        (search.get("quality") !== "full" && automaticLite) ? "lite" : "full") as Quality,
    playing: !reduceMedia.matches, time: 0, depth: true, blink: true, breath: true, rain: true,
    look: (search.get("look") === "warm" ? "warm" : search.get("look") === "neon" ? "neon" : "hope") as EndingLook,
    intensity: 0.5, reduced: reduceMedia.matches, sound: false,
};
quality.value = state.quality;
$<HTMLInputElement>("reduced").checked = state.reduced;
let plates: Plates | undefined;
let mitsukiEnding: MitsukiEnding | undefined;
const duration = () => state.experiment === "mitsuki" ? ENDING_DURATION : 24;
const isReady = () => state.experiment === "mitsuki" ? Boolean(mitsukiEnding) : Boolean(plates);
const formatTime = (time: number) => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
let loadVersion = 0;
let disposed = false;
let raf = 0;
let lastTick = 0;
let lastDraw = 0;
let lastUi = 0;
let lastCredit = -1;
let lastShot = -1;
let originalWasPlaying = state.playing;
let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
let report: Report | undefined;
let measuring: { warmUntil: number; start: number; last: number; intervals: number[]; costs: number[]; frames: number } | undefined;
const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const notice = (message: string) => { $("notice").textContent = message; };

function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => { image.decode().then(() => resolve(image), reject); };
        image.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
        image.src = src;
    });
}

async function loadPlates(next: Quality) {
    const version = ++loadVersion;
    quality.disabled = true;
    try {
        if (state.experiment === "mitsuki") {
            const ending = await MitsukiEnding.load(next, loadImage, () => { if (!disposed) { draw(state.time); schedule(); } });
            if (disposed || version !== loadVersion) { ending.dispose(); return; }
            ending.prepareLook(state.look);
            mitsukiEnding?.dispose();
            mitsukiEnding = ending; plates = undefined;
        } else {
            const sources = next === "lite" ? [streetLite, mikuLite, originalLite, eyes] : [street, miku, original, eyes];
            const [background, character, comparison, closed] = await Promise.all(sources.map(loadImage));
            if (disposed || version !== loadVersion) return;
            plates = { street: background, miku: character, original: comparison, eyes: closed }; mitsukiEnding?.dispose(); mitsukiEnding = undefined;
        }
        state.quality = next;
        $("loading").hidden = true;
        for (const element of document.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button:disabled, #timeline")) {
            if (element.id !== "download") element.disabled = false;
        }
        quality.value = next;
        resize();
        updateUi();
        schedule();
    } catch (error) {
        if (disposed || version !== loadVersion) return;
        if (!isReady()) $("loading").textContent = "No se pudieron cargar las imágenes. Recarga para reintentar.";
        notice(error instanceof Error ? error.message : "No se pudieron cargar las imágenes.");
        quality.value = state.quality;
    } finally {
        if (version === loadVersion) quality.disabled = false;
    }
}

// Seeded particles give the same rain at the same timeline position, including after seeking.
let seed = 83;
const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const drops = Array.from({ length: 240 }, () => ({ x: random(), y: random(), speed: 0.24 + random() * 0.26, length: 8 + random() * 20 }));
function drawRain(time: number, front: boolean) {
    if (!state.rain || state.reduced || state.intensity === 0) return;
    const count = Math.floor((state.quality === "lite" ? 75 : 150) * (0.4 + state.intensity));
    ctx.strokeStyle = front ? "rgba(215,233,239,0.25)" : "rgba(195,219,228,0.16)";
    ctx.lineWidth = front ? 1.3 : 0.8;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
        const drop = drops[(i + (front ? 70 : 0)) % drops.length];
        const progress = (drop.y + time * drop.speed * (front ? 1.25 : 0.8)) % 1;
        const x = (drop.x * W + progress * 50) % W;
        const y = progress * (H + 60) - 30;
        const length = drop.length * (front ? 1.4 : 0.65);
        ctx.moveTo(x, y); ctx.lineTo(x + length * 0.13, y + length);
    }
    ctx.stroke();
    if (front) {
        // Small ground rings, kept away from Miku's face and coat.
        ctx.strokeStyle = "rgba(210,228,234,0.12)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < (state.quality === "lite" ? 8 : 16); i++) {
            const drop = drops[i];
            const phase = (time * 0.7 + drop.y) % 1;
            const x = i % 2 ? W * (0.74 + drop.x * 0.24) : W * drop.x * 0.3;
            const y = H * (0.6 + drop.y * 0.37);
            ctx.globalAlpha = (1 - phase) * state.intensity;
            ctx.beginPath(); ctx.ellipse(x, y, 2 + phase * 20, 1 + phase * 4, 0, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
}

function blinkAmount(time: number) {
    if (!state.blink || state.reduced) return 0;
    for (const start of [2.5, 6.9, 10.6, 10.94, 16.2, 21.3]) {
        const t = time - start;
        if (t >= 0 && t < 0.075) return smooth(t / 0.075);
        if (t >= 0.075 && t < 0.125) return 1;
        if (t >= 0.125 && t < 0.25) return 1 - smooth((t - 0.125) / 0.125);
    }
    return 0;
}

const titleCards = [
    { start: 1, end: 7, kicker: "UN RECUERDO", title: "Después\nde la lluvia", note: "Fuutarou Final Regret" },
    { start: 9, end: 15, kicker: "MIKU NAKANO", title: "Lo que\npermanece.", note: "Estudio de un posible ending" },
    { start: 17, end: 23, kicker: "FUUTAROU FINAL REGRET", title: "Gracias por\nllegar hasta aquí.", note: "Fin de la prueba visual" },
];
function draw(time: number) {
    if (!isReady()) return;
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    ctx.globalAlpha = 1;
    if (state.experiment === "mitsuki" && mitsukiEnding) {
        const frame = mitsukiEnding.draw(ctx, time, { original: state.mode === "original", hold: state.mode === "live",
            reduced: state.reduced, depth: state.depth, blink: state.blink, breath: state.breath, atmosphere: state.rain,
            look: state.look, intensity: state.intensity, quality: state.quality, pointerX, pointerY });
        const creditKey = frame.index + (frame.finale ? 1000 : 0);
        if (creditKey !== lastCredit) {
            $("credit-kicker").textContent = frame.card?.kicker ?? "";
            $("credit-title").textContent = frame.card?.title ?? "";
            $("credit-note").textContent = frame.card?.note ?? "";
            credits.classList.toggle("right", frame.card?.side === "right");
            credits.classList.toggle("small", Boolean(frame.card?.small));
            credits.classList.toggle("lower", Boolean(frame.card?.lower));
            credits.classList.toggle("finale", Boolean(frame.finale));
            lastCredit = creditKey;
        }
        credits.style.opacity = frame.card ? String(frame.opacity) : "0";
        if (frame.index !== lastShot) {
            lastShot = frame.index;
            $("scene-label").textContent = `MITSUKI · ${String(frame.index + 1).padStart(2, "0")} / ${shots.length}`;
            $("scene-caption").textContent = frame.label;
            $<HTMLSelectElement>("shot").value = String(frame.index);
            for (const button of document.querySelectorAll<HTMLButtonElement>("[data-shot]")) {
                const active = Number(button.dataset.shot) === frame.index;
                button.setAttribute("aria-current", String(active));
            }
            for (const button of document.querySelectorAll<HTMLButtonElement>("[data-chapter]")) button.setAttribute("aria-current", String(button.dataset.chapter === shots[frame.index].stage));
            canvas.setAttribute("aria-label", `${frame.label}. Recuerdos de Mitsuki con efectos en tiempo real.`);
        }
        return;
    }
    if (!plates) return;
    if (state.mode === "original") {
        ctx.drawImage(plates.original, 0, 0, W, H);
        credits.style.opacity = "0";
        return;
    }
    const motion = state.reduced ? 0 : 1;
    const depth = state.depth ? motion : 0;
    const arc = (1 - Math.cos((time / 24) * Math.PI * 2)) * 0.5;
    const drift = Math.sin(time * Math.PI * 2 / 24);
    const ending = state.mode === "ending";
    ctx.save();
    ctx.translate(W / 2 + depth * (drift * 5 - pointerX * 8), H / 2 - depth * pointerY * 4);
    const backgroundScale = 1.045 + depth * arc * 0.015;
    ctx.scale(backgroundScale, backgroundScale);
    ctx.drawImage(plates.street, -W / 2, -H / 2, W, H);
    ctx.restore();
    drawRain(time, false);

    ctx.save();
    const breathe = state.breath ? motion * Math.sin(time * Math.PI * 2 / 5.4) : 0;
    ctx.translate(W / 2 + (ending ? 95 : 0) + depth * (pointerX * 11 + drift * 3), H * 0.72 + breathe * 1.2 + depth * pointerY * 4);
    const characterScale = 1.012 + depth * arc * 0.021;
    ctx.scale(characterScale, characterScale + breathe * 0.0018);
    ctx.translate(-W / 2, -H * 0.72);
    ctx.drawImage(plates.miku, 0, 0, W, H);
    const blink = blinkAmount(time);
    if (blink > 0) {
        ctx.globalAlpha = blink;
        ctx.drawImage(plates.eyes, 680, 135, 224, 116);
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    drawRain(time, true);

    const vignette = ctx.createLinearGradient(0, 0, 0, H);
    vignette.addColorStop(0, "rgba(7,17,24,0.13)");
    vignette.addColorStop(0.55, "rgba(7,17,24,0)");
    vignette.addColorStop(1, "rgba(7,17,24,0.34)");
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);
    if (ending) {
        const shade = ctx.createLinearGradient(0, 0, W * 0.65, 0);
        shade.addColorStop(0, "rgba(6,16,22,0.8)"); shade.addColorStop(1, "rgba(6,16,22,0)");
        ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
        const cardIndex = titleCards.findIndex(card => time >= card.start && time <= card.end);
        if (cardIndex !== lastCredit) {
            const card = titleCards[cardIndex];
            $("credit-kicker").textContent = card?.kicker ?? "";
            $("credit-title").textContent = card?.title ?? "";
            $("credit-note").textContent = card?.note ?? "";
            lastCredit = cardIndex;
        }
        const card = titleCards[cardIndex];
        credits.style.opacity = card ? String(state.reduced ? 1 : smooth((time - card.start) / 1.1) * smooth((card.end - time) / 1.1)) : "0";
        if (!state.reduced) {
            const fade = 1 - smooth(time / 1.25) * smooth((24 - time) / 1.25);
            ctx.fillStyle = `rgba(7,14,19,${fade})`; ctx.fillRect(0, 0, W, H);
        }
    } else credits.style.opacity = "0";
}

function resize() {
    cancelMeasurement("Medición cancelada por cambio de tamaño.");
    const cap = state.quality === "lite" ? 1152 : 1920;
    canvas.width = Math.max(320, Math.min(cap, Math.round(scene.clientWidth * Math.min(devicePixelRatio || 1, 1.5))));
    canvas.height = Math.round(canvas.width * H / W);
    draw(state.time);
}

function updateUi() {
    document.body.dataset.presentation = state.mode;
    const active = state.playing && state.mode !== "original";
    play.textContent = active ? "Ⅱ" : "▶";
    play.setAttribute("aria-label", active ? "Pausar" : "Reproducir");
    play.title = active ? "Pausar (Espacio)" : "Reproducir (Espacio)";
    play.disabled = !isReady() || state.mode === "original";
    timeline.disabled = !isReady() || state.mode === "original";
    timeline.max = String(duration());
    timeline.value = String(state.time);
    $("time").innerHTML = `${formatTime(state.time)} <span>/ ${formatTime(duration())}</span>`;
    $("mode-label").textContent = { live: state.experiment === "mitsuki" ? "PLANO EN BUCLE" : "ESCENA VIVA", original: "ORIGINAL · SIN EFECTOS", ending: `ENDING · ${formatTime(duration())}` }[state.mode];
    $("hint").textContent = state.mode === "original" ? "El CG original, sin capas ni efectos añadidos. Vuelve a Escena viva para comparar." : state.reduced ?
        "Movimiento reducido: cámara, respiración, parpadeo y lluvia animada desactivados." :
        matchMedia("(pointer: coarse)").matches ? "Usa los controles para comparar la ilustración y su versión animada." :
        "Mueve suavemente el cursor sobre la imagen para explorar la profundidad.";
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-mode]")) button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
    if (state.experiment === "mitsuki") $("hint").textContent = state.mode === "original" ?
        "La ilustración o el fotograma de origen. Vuelve al pase para ver la composición y los efectos." : state.reduced ?
        "Movimiento reducido: encuadres fijos y cortes directos. La reproducción queda a tu elección." :
        state.mode === "live" ? "Este plano se repite. Cambia de recuerdo en la tira inferior o vuelve al pase completo." :
        "Ilustraciones animadas en tiempo real. Elige un plano para explorarlo o activa la música para ver el pase completo.";
    $<HTMLButtonElement>("measure").disabled = !isReady() || !active;
}

function schedule() {
    if (!disposed && !raf && isReady() && state.playing && state.mode !== "original" && !document.hidden) raf = requestAnimationFrame(tick);
}
function stopLoop() {
    cancelAnimationFrame(raf); raf = 0; lastTick = 0; lastDraw = 0;
}
function tick(now: number) {
    raf = 0;
    if (disposed || !state.playing || document.hidden || state.mode === "original") return;
    const dt = lastTick ? Math.min((now - lastTick) / 1000, 0.25) : 0;
    lastTick = now;
    state.time += dt;
    if (state.experiment === "mitsuki" && state.sound && !music.paused && !music.seeking) state.time = music.currentTime;
    if (state.experiment === "mitsuki" && state.mode === "live") {
        const shot = shots[state.holdShot];
        if (state.time >= shot.start + shot.seconds) { state.time = shot.start; syncAudio(); }
    } else if (state.time >= duration()) {
        if (state.mode === "ending") { state.time = duration(); state.playing = false; syncAudio(); }
        else state.time %= duration();
    }
    if (state.experiment === "mitsuki" && state.sound) music.volume = .7 * (state.mode === "ending" ? smooth((duration() - state.time) / 2) : 1);
    const interval = 1000 / (state.quality === "lite" ? 30 : 60);
    if (!lastDraw || now - lastDraw >= interval - 0.6 || !state.playing) {
        const elapsed = lastDraw ? now - lastDraw : interval;
        pointerX += (targetX - pointerX) * (1 - Math.exp(-elapsed / 160));
        pointerY += (targetY - pointerY) * (1 - Math.exp(-elapsed / 160));
        lastDraw = now - Math.max(0, (now - lastDraw) % interval);
        const started = performance.now();
        draw(state.time);
        sample(now, performance.now() - started);
    }
    if (now - lastUi > 100 || !state.playing) { updateUi(); lastUi = now; }
    schedule();
}

function cancelMeasurement(message: string) {
    if (!measuring) return;
    measuring = undefined;
    $("measurement").textContent = message;
    $("measure").textContent = "Medir durante 10 s";
}
const percentile95 = (values: number[]) => [...values].sort((a, b) => a - b)[Math.max(0, Math.ceil(values.length * 0.95) - 1)] ?? 0;
function sample(now: number, cost: number) {
    if (!measuring || now < measuring.warmUntil) return;
    if (!measuring.start) { measuring.start = now; measuring.last = now; }
    else measuring.intervals.push(now - measuring.last);
    measuring.last = now;
    measuring.costs.push(cost);
    measuring.frames++;
    const duration = now - measuring.start;
    $("measure").textContent = `Midiendo… ${Math.max(0, Math.ceil((10000 - duration) / 1000))} s`;
    if (duration < 10000) return;
    report = {
        durationSeconds: +(duration / 1000).toFixed(2), frames: measuring.frames,
        renderedFps: +((measuring.frames - 1) * 1000 / duration).toFixed(1),
        intervalP95Ms: +percentile95(measuring.intervals).toFixed(2),
        drawSubmissionP95Ms: +percentile95(measuring.costs).toFixed(2),
        intervalsOver50Ms: measuring.intervals.filter(t => t > 50).length,
        targetFps: state.quality === "lite" ? 30 : 60, quality: state.quality,
        resolution: `${canvas.width} × ${canvas.height}`, mode: state.mode, experiment: state.experiment,
        effects: { depth: state.depth, blink: state.blink, breath: state.breath, rain: state.rain, look: state.look, intensity: state.intensity, reduced: state.reduced },
        userAgent: navigator.userAgent, capturedAt: new Date().toISOString(),
        note: "Canvas draw submissions, not GPU timings or hardware emulation. Test on the physical Android device before drawing performance conclusions.",
    };
    $("measurement").textContent = `${report.renderedFps} FPS dibujados / objetivo ${report.targetFps} · intervalo p95 ${report.intervalP95Ms} ms · envío de dibujo p95 ${report.drawSubmissionP95Ms} ms · ${report.intervalsOver50Ms} intervalos >50 ms · ${report.resolution}. Medido aquí; no es una medición de GPU ni una simulación de Android.`;
    measuring = undefined;
    $("measure").textContent = "Medir durante 10 s";
    $<HTMLButtonElement>("download").disabled = false;
}

// Optional locally synthesized rain ambience; starts only after an explicit click.
const music = $<HTMLAudioElement>("music");
music.src = referenceMusic;
music.preload = "none";
let customMusicUrl: string | undefined;
function soundLabel() {
    const noun = state.experiment === "mitsuki" ? "música" : "lluvia";
    $("sound").textContent = `${state.sound ? "Silenciar" : "Activar"} ${noun}`;
    $("sound").setAttribute("aria-pressed", String(state.sound));
}
let audio: AudioContext | undefined;
let audioSource: AudioBufferSourceNode | undefined;
let gain: GainNode | undefined;
function syncAudio() {
    const audible = state.sound && state.playing && !document.hidden && state.mode !== "original";
    const musicAvailable = !Number.isFinite(music.duration) || state.time < music.duration - .01;
    if (state.experiment === "mitsuki" && Math.abs(music.currentTime - state.time) > .2) music.currentTime = state.time;
    if (state.experiment === "mitsuki" && audible && musicAvailable) {
        if (music.paused) void music.play().catch(() => {
            if (disposed || !state.sound || !state.playing || document.hidden || state.experiment !== "mitsuki") return;
            state.sound = false; soundLabel(); notice("No se pudo reproducir la música. Puedes elegir otro archivo en Ajustar efectos.");
        });
    } else music.pause();
    if (audio && gain) gain.gain.setTargetAtTime(audible && state.experiment === "miku" ? 0.14 : 0, audio.currentTime, 0.16);
}
async function toggleSound() {
    if (state.experiment === "mitsuki") {
        state.sound = !state.sound;
        if (state.sound && state.mode !== "original") {
            if (state.time >= duration()) state.time = 0;
            state.playing = true;
        }
        soundLabel(); changed(); return;
    }
    try {
        if (!audio) {
            audio = new AudioContext();
            const buffer = audio.createBuffer(1, audio.sampleRate * 4, audio.sampleRate);
            const data = buffer.getChannelData(0);
            let previous = 0;
            for (let i = 0; i < data.length; i++) { previous = (previous + (Math.random() * 2 - 1) * 0.035) / 1.035; data[i] = previous * 4; }
            audioSource = audio.createBufferSource(); audioSource.buffer = buffer; audioSource.loop = true;
            const filter = audio.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 2300;
            gain = audio.createGain(); gain.gain.value = 0;
            audioSource.connect(filter).connect(gain).connect(audio.destination); audioSource.start();
        }
        await audio.resume();
        state.sound = !state.sound;
        soundLabel();
        syncAudio();
    } catch { notice("El navegador no permitió reproducir el ambiente de lluvia."); }
}

function changed() {
    cancelMeasurement("Ajustes modificados. Inicia una nueva medición para comparar.");
    draw(state.time); updateUi(); syncAudio(); schedule();
}
function togglePlay() {
    if (!isReady() || state.mode === "original") return;
    cancelMeasurement("Medición cancelada al pausar o reanudar.");
    if (state.time >= duration()) state.time = 0;
    state.playing = !state.playing;
    stopLoop(); changed();
}
function setMode(mode: Mode) {
    if (state.mode === mode || !isReady()) return;
    if (mode === "original") { originalWasPlaying = state.playing; state.playing = false; }
    else if (state.mode === "original") state.playing = originalWasPlaying;
    if (mode === "ending" && state.experiment === "miku") { state.time = 0; state.playing = !state.reduced; }
    if (mode === "live" && state.experiment === "mitsuki") {
        state.holdShot = shotAt(state.time);
        if (state.time >= duration()) state.time = shots[state.holdShot].start;
    }
    state.mode = mode;
    lastCredit = -1;
    stopLoop(); changed();
}

function selectShot(index: number) {
    if (state.experiment !== "mitsuki" || !isReady()) return;
    state.holdShot = index; state.time = shots[index].start + 1.2;
    lastCredit = -1; stopLoop(); changed();
}
function presentExperiment() {
    const isMitsuki = state.experiment === "mitsuki";
    document.body.dataset.experiment = state.experiment;
    document.body.dataset.look = isMitsuki ? state.look : "warm";
    $<HTMLSelectElement>("experiment").value = state.experiment;
    $("title").innerHTML = isMitsuki ? "Todos los días, <span>contigo.</span>" : "Después de la lluvia<span>.</span>";
    document.title = `${isMitsuki ? "Todos los días, contigo" : "Después de la lluvia"} · Final Regret`;
    $("intro-note").innerHTML = isMitsuki ? "Del primer abrazo a todos los días que vendrán.<br />Recuerdos que crecen con ella." :
        "Un CG, un pequeño gesto, otra forma de recordar.<br />La primera prueba de movimiento.";
    viewer.setAttribute("aria-label", isMitsuki ? "Ending interactivo de Mitsuki" : "Miku bajo la lluvia");
    canvas.setAttribute("aria-label", isMitsuki ? "Ending de Mitsuki con ilustraciones animadas" : "Miku bajo la lluvia con profundidad y parpadeo");
    $("storyboard").hidden = !isMitsuki;
    $("look-controls").hidden = !isMitsuki;
    $("music-settings").hidden = !isMitsuki;
    $("rain-label").textContent = isMitsuki ? { neon: "Líneas y eco de color", warm: "Luz y partículas", hope: "Luz y ambiente" }[state.look] : "Lluvia";
    $("breath-label").textContent = isMitsuki ? "Respiración de Mitsuki" : "Respiración";
    $("blink-label").textContent = isMitsuki ? "Parpadeo de Mitsuki" : "Parpadeo";
    $("live-label").textContent = isMitsuki ? "Mantener plano" : "Escena viva";
    $("ending-length").textContent = formatTime(duration());
    credits.classList.remove("right", "small", "lower", "finale");
    lastShot = lastCredit = -1;
    if (!isMitsuki) {
        $("scene-label").textContent = "MIKU · CALLE EIEN";
        $("scene-caption").textContent = "La lluvia pasa. El recuerdo permanece.";
    } else if (!$("filmstrip").children.length) {
        const select = $<HTMLSelectElement>("shot");
        let group: HTMLOptGroupElement;
        shots.forEach((shot, index) => {
            if (!index || shots[index - 1].stage !== shot.stage) {
                group = document.createElement("optgroup"); group.label = stages[shot.stage]; select.append(group);
                const chapter = document.createElement("button"); chapter.type = "button"; chapter.dataset.chapter = shot.stage;
                chapter.textContent = stages[shot.stage]; chapter.addEventListener("click", () => selectShot(index), eventOptions);
                $("chapters").append(chapter);
            }
            const option = document.createElement("option"); option.value = String(index);
            option.textContent = `${String(index + 1).padStart(2, "0")} · ${shot.label}`; group.append(option);
            const button = document.createElement("button"); button.dataset.shot = String(index);
            button.type = "button"; button.setAttribute("aria-label", `${shot.label}, ${formatTime(shot.start)}`);
            const image = document.createElement("img"); image.src = thumbnail(shot.art, "lite"); image.alt = ""; image.width = 124; image.height = 70;
            const span = document.createElement("span"); span.textContent = `${String(index + 1).padStart(2, "0")} · ${formatTime(shot.start)}`;
            button.append(image, span); button.addEventListener("click", () => selectShot(index), eventOptions);
            $("filmstrip").append(button);
        });
    }
    soundLabel(); updateUi();
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-look]")) button.setAttribute("aria-pressed", String(button.dataset.look === state.look));
}
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-look]")) button.addEventListener("click", () => {
    state.look = button.dataset.look as EndingLook;
    mitsukiEnding?.prepareLook(state.look);
    presentExperiment(); changed();
}, eventOptions);
$<HTMLSelectElement>("experiment").addEventListener("change", event => {
    stopLoop(); cancelMeasurement("La escena cambió. Inicia una nueva medición.");
    state.experiment = (event.target as HTMLSelectElement).value as Experiment;
    state.mode = state.experiment === "mitsuki" ? "ending" : "live";
    state.time = 0; state.holdShot = 0; state.playing = !state.reduced; state.sound = false;
    pointerX = pointerY = targetX = targetY = 0;
    plates = undefined; mitsukiEnding?.dispose(); mitsukiEnding = undefined; credits.style.opacity = "0";
    $("loading").hidden = false; $("loading").textContent = "Preparando el recuerdo…";
    presentExperiment(); syncAudio(); void loadPlates(state.quality);
}, eventOptions);
$<HTMLSelectElement>("shot").addEventListener("change", event => selectShot(Number((event.target as HTMLSelectElement).value)), eventOptions);
$<HTMLInputElement>("music-file").addEventListener("change", event => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    music.pause();
    if (customMusicUrl) URL.revokeObjectURL(customMusicUrl);
    customMusicUrl = URL.createObjectURL(file); music.src = customMusicUrl;
    $("music-name").textContent = file.name; state.sound = false; soundLabel();
    notice("Música elegida para esta sesión. Pulsa Activar música para escucharla con el ending.");
}, eventOptions);

play.addEventListener("click", togglePlay, eventOptions);
$("restart").addEventListener("click", () => {
    state.time = state.experiment === "mitsuki" && state.mode === "live" ? shots[state.holdShot].start : 0;
    lastCredit = -1; stopLoop(); changed();
}, eventOptions);
timeline.addEventListener("input", () => {
    state.time = Number(timeline.value); state.holdShot = shotAt(state.time); stopLoop(); changed();
}, eventOptions);
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-mode]")) button.addEventListener("click", () => setMode(button.dataset.mode as Mode), eventOptions);
for (const id of ["depth", "blink", "breath", "rain", "reduced"] as const) {
    const input = $<HTMLInputElement>(id);
    input.addEventListener("change", () => {
        state[id] = input.checked;
        targetX = targetY = pointerX = pointerY = 0;
        if (id === "reduced" && input.checked) { state.playing = false; stopLoop(); }
        changed();
    }, eventOptions);
}
$<HTMLInputElement>("intensity").addEventListener("input", event => { state.intensity = Number((event.target as HTMLInputElement).value); changed(); }, eventOptions);
quality.addEventListener("change", () => { cancelMeasurement("Cambio de perfil. Inicia otra medición cuando cargue."); void loadPlates(quality.value as Quality); }, eventOptions);
$("settings-toggle").addEventListener("click", () => {
    const settings = $("settings"); settings.hidden = !settings.hidden;
    $("settings-toggle").setAttribute("aria-expanded", String(!settings.hidden));
}, eventOptions);
$("sound").addEventListener("click", () => { void toggleSound(); }, eventOptions);
$("fullscreen").addEventListener("click", async () => {
    try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (viewer.requestFullscreen) await viewer.requestFullscreen();
        else notice("Pantalla completa no disponible en este navegador.");
    } catch { notice("El navegador no permitió abrir la pantalla completa."); }
}, eventOptions);
document.addEventListener("fullscreenchange", () => { $("restore").hidden = !document.fullscreenElement; resize(); }, eventOptions);
$("restore").addEventListener("click", () => { if (document.fullscreenElement) void document.exitFullscreen(); }, eventOptions);
scene.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || !state.playing || state.reduced) return;
    const rect = scene.getBoundingClientRect();
    targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
}, eventOptions);
scene.addEventListener("pointerleave", () => { targetX = targetY = 0; }, eventOptions);
document.addEventListener("keydown", event => {
    if ((event.target as HTMLElement).closest("button,input,select,a,textarea")) return;
    if (event.code === "Space") { event.preventDefault(); togglePlay(); }
}, eventOptions);
document.addEventListener("visibilitychange", () => {
    stopLoop(); cancelMeasurement("Medición cancelada: la pestaña dejó de estar visible."); syncAudio();
    if (!document.hidden) schedule();
}, eventOptions);
reduceMedia.addEventListener("change", event => {
    state.reduced = event.matches; $<HTMLInputElement>("reduced").checked = event.matches;
    if (event.matches) { state.playing = false; stopLoop(); }
    changed();
}, eventOptions);
$("measure").addEventListener("click", () => {
    if (!state.playing || state.mode === "original") return;
    // Leave enough playback time for the warmup and the complete sample.
    if (state.mode === "ending" && state.time > duration() - 12) { state.time = 0; syncAudio(); }
    report = undefined;
    $<HTMLButtonElement>("download").disabled = true;
    measuring = { warmUntil: performance.now() + 1000, start: 0, last: 0, intervals: [], costs: [], frames: 0 };
    $("measurement").textContent = "Calentamiento de 1 s y muestra de 10 s. Mantén esta pestaña visible y los ajustes sin cambios.";
}, eventOptions);
$("download").addEventListener("click", () => {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `final-regret-ending-${report.quality}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}, eventOptions);
const observer = new ResizeObserver(resize); observer.observe(scene);
presentExperiment();
void loadPlates(state.quality);
if (import.meta.hot) import.meta.hot.dispose(() => {
    disposed = true; loadVersion++; abort.abort(); observer.disconnect(); stopLoop();
    audioSource?.stop(); void audio?.close(); plates = undefined; mitsukiEnding?.dispose(); mitsukiEnding = undefined;
    music.pause(); music.removeAttribute("src"); music.load();
    if (customMusicUrl) URL.revokeObjectURL(customMusicUrl);
});
