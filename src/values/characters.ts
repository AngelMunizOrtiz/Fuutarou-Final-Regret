import { RegisteredCharacters } from "@drincs/pixi-vn";
import Character from "../models/Character";

export const mc = new Character("mc", {
    name: "Me",
});

export const james = new Character("james", {
    name: "James",
    color: "#0084ac",
});

export const steph_fullname = "Stephanie";
export const steph = new Character("steph", {
    name: "Steph",
    color: "#ac5900",
});

export const sly = new Character("sly", {
    name: "Sly",
    color: "#6d00ac",
});

const storyCharacters = [
    new Character("narrator", { name: "", color: "#f2f2f2" }),
    new Character("fuutarou", { name: "Fuutarou", color: "#7a8fa6" }),
    new Character("fuutarou_past", { name: "Fuutarou", color: "#7a8fa6" }),
    new Character("fuutarou_child", { name: "Fuutarou", color: "#7a8fa6" }),
    new Character("takeda", { name: "Takeda", color: "#82cfff" }),
    new Character("miku", { name: "Miku", color: "#7bb7ff" }),
    new Character("yotsuba", { name: "Yotsuba", color: "#8be36f" }),
    new Character("ichika", { name: "Ichika", color: "#f5d36f" }),
    new Character("nino", { name: "Nino", color: "#ff8fb4" }),
    new Character("itsuki", { name: "Itsuki", color: "#ff786f" }),
    new Character("raiha", { name: "Raiha", color: "#f5b46f" }),
    new Character("isanari", { name: "Isanari", color: "#d8d8d8" }),
    new Character("isanari_whispers", { name: "Isanari", color: "#bdbdbd" }),
    new Character("maruo", { name: "Maruo", color: "#b7b7c9" }),
    new Character("grandpa", { name: "Grandpa", color: "#c9bea3" }),
    new Character("grandpa_ren", { name: "Grandpa Ren", color: "#c9bea3" }),
    new Character("aoi", { name: "Aoi", color: "#e2a2c3" }),
    new Character("doctor", { name: "Doctor", color: "#b7e0ff" }),
    new Character("ebata", { name: "Ebata", color: "#c8c8ff" }),
    new Character("kiku", { name: "Kiku", color: "#e8ca7a" }),
    new Character("matsui", { name: "Matsui", color: "#e8b27a" }),
    new Character("mr_jirou", { name: "Mr. Jirou", color: "#c8d8a8" }),
    new Character("oda", { name: "Oda", color: "#d8c77a" }),
    new Character("shimoda", { name: "Shimoda", color: "#d8a87a" }),
    new Character("tsubaki", { name: "Tsubaki", color: "#d77ac2" }),
    new Character("sisters", { name: "The sisters", color: "#ffffff" }),
    new Character("rena_1", { name: "Rena 1", color: "#ffffff" }),
    new Character("rena_2", { name: "Rena 2", color: "#ffffff" }),
    new Character("rena_3", { name: "Rena 3", color: "#ffffff" }),
    new Character("rena_4", { name: "Rena 4", color: "#ffffff" }),
    new Character("miku_fuutarou", { name: "Miku/Fuutarou", color: "#c4d8ff" }),
    new Character("fuutarou_miku", { name: "Fuutarou/Miku", color: "#c4d8ff" }),
    new Character("aoi_isanari", { name: "Aoi/Isanari", color: "#e5d0d8" }),
    new Character("ichika_itsuki_nino", { name: "Ichika/Itsuki/Nino", color: "#ffd9ec" }),
    new Character("oda_kiku", { name: "Oda/Kiku", color: "#e8d28a" }),
];

RegisteredCharacters.add([mc, james, steph, sly, ...storyCharacters]);
