import type { TFunction } from "i18next";
import { performanceProfile } from "../utils/performance-profile";

export type GalleryItem =
    | {
          id: string;
          kind: "image";
          title: string;
          subtitle: string;
          src: string;
      }
    | {
          id: string;
          kind: "video";
          title: string;
          subtitle: string;
          src: string;
          poster: string;
      }
    | {
          id: string;
          kind: "sequence";
          title: string;
          subtitle: string;
          frames: string[];
      };

export const galleryItems: GalleryItem[] = [
    {
        id: "dream-sequence",
        kind: "sequence",
        title: "Secuencia del sueno",
        subtitle: "Recuerdos animados",
        frames: [
            "/images/memories/frame1.webp",
            "/images/memories/frame2.webp",
            "/images/memories/frame3.webp",
            "/images/memories/frame4.webp",
            "/images/memories/frame5.webp",
            "/images/memories/frame5_5.webp",
            "/images/memories/frame6.webp",
            "/images/memories/frame7.webp",
        ],
    },
    {
        id: "menu-loop",
        kind: "video",
        title: "Menu principal",
        subtitle: "Animacion de fondo",
        src: performanceProfile.menuVideoSrc,
        poster: "/images/bg_title.webp",
    },
    {
        id: "regret-1",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 1",
        src: "/images/memories/Arrepentimiento Final.webp",
    },
    {
        id: "regret-2",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 2",
        src: "/images/memories/Arrepentimiento Final2.webp",
    },
    {
        id: "regret-3",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 3",
        src: "/images/memories/Arrepentimiento Final3.webp",
    },
    {
        id: "regret-4",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 4",
        src: "/images/memories/Arrepentimiento Final4.webp",
    },
    {
        id: "regret-5",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 5",
        src: "/images/memories/Arrepentimiento Final5.webp",
    },
    {
        id: "regret-6",
        kind: "image",
        title: "Arrepentimiento Final",
        subtitle: "Ilustracion 6",
        src: "/images/memories/Arrepentimiento Final6.webp",
    },
    {
        id: "dream-frame-1",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 1",
        src: "/images/memories/frame1.webp",
    },
    {
        id: "dream-frame-2",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 2",
        src: "/images/memories/frame2.webp",
    },
    {
        id: "dream-frame-3",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 3",
        src: "/images/memories/frame3.webp",
    },
    {
        id: "dream-frame-4",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 4",
        src: "/images/memories/frame4.webp",
    },
    {
        id: "dream-frame-5",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 5",
        src: "/images/memories/frame5.webp",
    },
    {
        id: "dream-frame-6",
        kind: "image",
        title: "Suenos rotos",
        subtitle: "Frame 6",
        src: "/images/memories/frame6.webp",
    },
    {
        id: "dream-frame-7",
        kind: "image",
        title: "Despertar",
        subtitle: "Frame final",
        src: "/images/memories/frame7.webp",
    },
];

export function getGalleryThumbnail(item: GalleryItem) {
    if (item.kind === "image") return item.src;
    if (item.kind === "video") return item.poster;
    return item.frames[0];
}

export function getLocalizedGalleryItems(t: TFunction<"gallery">) {
    return galleryItems.map((item) => ({
        ...item,
        title: t(`${item.id}.title`, { defaultValue: item.title }),
        subtitle: t(`${item.id}.subtitle`, { defaultValue: item.subtitle }),
    })) as GalleryItem[];
}
