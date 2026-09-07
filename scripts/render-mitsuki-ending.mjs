import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const planFile = path.join(root, "experiments/ending-mitsuki/sequence.json");
const plan = JSON.parse(await readFile(planFile, "utf8"));
const preview = process.argv.includes("--preview");
const width = preview ? 960 : 1920;
const height = width * 9 / 16;
const fps = plan.fps;
const transition = plan.transitionFrames / fps;
const source = path.resolve(root, plan.sourceDirectory);
const temp = path.join(root, ".codex-tmp/ending-mitsuki", preview ? "preview" : "1080p");
const outDir = path.join(root, "artifacts/ending-mitsuki-v1");
await mkdir(temp, { recursive: true });
await mkdir(outDir, { recursive: true });
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const safeSource = name => {
    const target = path.resolve(source, name);
    if (!target.startsWith(source + path.sep)) throw new Error(`Asset outside selected folder: ${name}`);
    return target;
};
const font = "C:/Windows/Fonts/georgia.ttf";
const sansFont = "C:/Windows/Fonts/segoeui.ttf";
// Filter escaping is not shell escaping: spawn receives an argument array, with no shell.
const filterPath = value => value.replaceAll("\\", "/").replaceAll(":", "\\:").replaceAll("'", "\\'");
const fontFilter = filterPath(sansFont);
const run = (args, logName) => new Promise((resolve, reject) => {
    const process = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-nostdin", "-y", ...args], { cwd: root, windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
    let error = "";
    process.stderr.on("data", data => { error += data; });
    process.on("error", reject);
    process.on("close", async code => {
        await writeFile(path.join(temp, `${logName}.log`), error);
        if (code === 0) resolve(); else reject(new Error(`${logName} failed (${code}): ${error.slice(-3000)}`));
    });
});
const encoder = ["-c:v", "libx264", "-preset", preview ? "veryfast" : "fast", "-crf", preview ? "22" : "18", "-pix_fmt", "yuv420p", "-threads", "2"];
const files = [];
const timings = [];
let start = 0;
for (let index = 0; index < plan.shots.length; index++) {
    const shot = plan.shots[index];
    const file = safeSource(shot.file);
    await stat(file);
    const frames = Math.round(shot.duration * fps) + (index < plan.shots.length - 1 ? plan.transitionFrames : 0);
    const duration = frames / fps;
    const progress = `min(on/${frames - 1},1)`;
    const ease = `(${progress})*(${progress})*(3-2*(${progress}))`;
    const interpolate = (a, b) => `(${a}+(${b - a})*(${ease}))`;
    const zoom = interpolate(...shot.zoom);
    const fx = interpolate(shot.focus[0][0], shot.focus[1][0]);
    const fy = interpolate(shot.focus[0][1], shot.focus[1][1]);
    const isVideo = /\.mp4$/i.test(shot.file);
    const inputArgs = isVideo ? ["-threads", "1", "-i", file] : ["-threads", "1", "-loop", "1", "-framerate", String(fps), "-i", file];
    const prefix = isVideo ? `trim=start=${shot.trim[0]}:end=${shot.trim[1]},setpts=(PTS-STARTPTS)*${duration / (shot.trim[1] - shot.trim[0])},fps=${fps},tpad=stop_mode=clone:stop_duration=1,` : "";
    const overscan = width * 2;
    let vf = `${prefix}scale=${overscan}:${overscan * 9 / 16}:force_original_aspect_ratio=increase:flags=lanczos,crop=${overscan}:${overscan * 9 / 16},setsar=1,` +
        `zoompan=z='${zoom}':x='max(0,min(iw-iw/zoom,iw*${fx}-iw/zoom/2))':y='max(0,min(ih-ih/zoom,ih*${fy}-ih/zoom/2))':d=1:s=${width}x${height}:fps=${fps},` +
        `eq=contrast=1.015:saturation=${shot.mood === "night" ? 1.025 : 1.015}:brightness=0.004,` +
        `colorbalance=rs=0.014:gs=0.005:bs=-0.009:rh=0.015:bh=-0.012,vignette=angle=0.30`;
    // A few drifting motes of light; sparse and kept outside the central faces.
    for (let dot = 0; dot < 7; dot++) {
        const x = (dot % 2 ? 0.83 : 0.07) * width + (dot % 3) * 0.025 * width;
        const y = 0.13 * height + dot * 0.105 * height;
        vf += `,drawtext=fontfile='${fontFilter}':text='·':fontsize=${Math.round(width * (0.018 + dot * 0.001))}:fontcolor=0xFFF1CD@0.17:x='${x}+sin(t*0.45+${dot})*${width * 0.012}':y='${y}-t*${height * 0.012}'`;
    }
    vf += `,trim=end_frame=${frames},setpts=PTS-STARTPTS,format=yuv420p`;
    const clip = path.join(temp, `${shot.id}.mp4`);
    const info = await stat(file);
    const signature = createHash("sha256").update(JSON.stringify({ shot, vf, width, frames, size: info.size, mtime: info.mtimeMs })).digest("hex");
    const signatureFile = clip + ".sha256";
    let cached = false;
    try { cached = (await readFile(signatureFile, "utf8")) === signature && (await stat(clip)).size > 0; } catch { /* No cached render. */ }
    if (!cached) {
        await run([...inputArgs, "-an", "-vf", vf, "-frames:v", String(frames), ...encoder, clip], shot.id);
        await writeFile(signatureFile, signature);
    }
    files.push(clip);
    timings.push({ ...shot, start, end: start + shot.duration, renderedDuration: duration });
    start += shot.duration;
    console.log(`${index + 1}/${plan.shots.length} ${shot.id} ${cached ? "cached" : "rendered"}`);
}

const totalDuration = start;
const assTime = seconds => {
    const cs = Math.round(seconds * 100);
    return `${Math.floor(cs / 360000)}:${String(Math.floor(cs / 6000) % 60).padStart(2,"0")}:${String(Math.floor(cs / 100) % 60).padStart(2,"0")}.${String(cs % 100).padStart(2,"0")}`;
};
const titleCards = [
    [0.7, 5.4, "Title", "{\\an1\\pos(118,940)\\fad(900,900)}Fuutarou\\N{\\fs78}Final Regret"],
    [7.2, 12.4, "Name", "{\\an3\\pos(1785,948)\\fad(900,1000)}M I K U"],
    [15.5, 20.8, "Name", "{\\an1\\pos(118,948)\\fad(900,1000)}M I T S U K I"],
    [33.0, 39.5, "Name", "{\\an3\\pos(1785,948)\\fad(900,1000)}R A I H A"],
    [50.0, 53.8, "Name", "{\\an1\\pos(118,948)\\fad(900,1000)}F U U T A R O U"],
    [81.0, 87.9, "Closing", "{\\an1\\pos(118,940)\\fad(1200,1400)}Todos los días, contigo."],
];
let ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Title,Georgia,42,&H00F1F7FF,&H00FFFFFF,&H802D211A,&H802D211A,0,0,0,0,100,100,1,0,1,1,1,1,100,100,90,1\nStyle: Name,Segoe UI,31,&H00F1F7FF,&H00FFFFFF,&H802D211A,&H802D211A,0,0,0,0,100,100,3,0,1,1,1,1,100,100,90,1\nStyle: Closing,Georgia,47,&H00F1F7FF,&H00FFFFFF,&H802D211A,&H802D211A,0,-1,0,0,100,100,0,0,1,1,1,1,100,100,90,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
for (const [begin, end, style, text] of titleCards) ass += `Dialogue: 0,${assTime(begin)},${assTime(end)},${style},,0,0,0,,${text}\n`;
await stat(font); await stat(sansFont);
const assFile = path.join(temp, "titles.ass");
await writeFile(assFile, ass);

const inputs = files.flatMap(file => ["-threads", "1", "-i", file]);
let graph = files.map((_, i) => `[${i}:v]settb=AVTB,fps=${fps},format=yuv420p[v${i}]`).join(";\n") + ";\n";
let previous = "v0";
for (let i = 1; i < files.length; i++) {
    const label = `mix${i}`;
    graph += `[${previous}][v${i}]xfade=transition=${plan.shots[i].transition || "fade"}:duration=${transition}:offset=${timings[i].start}[${label}];\n`;
    previous = label;
}
graph += `[${previous}]ass=filename='${filterPath(assFile)}',fade=t=in:st=0:d=1.2,fade=t=out:st=${totalDuration - 2.3}:d=2.3,format=yuv420p[video];\n`;
graph += `[${files.length}:a]atrim=start=${plan.audioStart}:duration=${totalDuration},asetpts=PTS-STARTPTS,volume=0.85,afade=t=in:st=0:d=1.4,afade=t=out:st=${totalDuration - 5}:d=5[audio]`;
const graphFile = path.join(temp, "assembly.ffscript");
await writeFile(graphFile, graph);
const output = path.join(outDir, preview ? "ending-mitsuki-preview.mp4" : "ending-mitsuki-1080p-v1.mp4");
console.log(`Assembling ${totalDuration} seconds at ${width}x${height}...`);
await run([...inputs, "-i", safeSource(plan.audio), "-filter_complex_threads", "1", "-filter_complex_script", graphFile,
    "-map", "[video]", "-map", "[audio]", "-t", String(totalDuration), ...encoder,
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", output], "assembly");
await writeFile(path.join(outDir, "timeline.json"), JSON.stringify({ title: plan.title, duration: totalDuration, fps, sourceDirectory: plan.sourceDirectory, audio: plan.audio, audioStart: plan.audioStart, provisional: true, shots: timings }, null, 2) + "\n");
await writeFile(path.join(outDir, "titles.ass"), ass);
console.log(`Completed: ${output}`);
