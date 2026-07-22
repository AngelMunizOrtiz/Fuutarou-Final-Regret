import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CollectionsIcon from "@mui/icons-material/Collections";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import { Box, Button, Chip, IconButton, Typography } from "@mui/joy";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { MAIN_MENU_ROUTE } from "../constans";
import { galleryItems, getGalleryThumbnail } from "../data/galleryItems";
import useMyNavigate from "../hooks/useMyNavigate";
import { runViewTransition } from "../utils/view-transition";

function getKindLabel(kind: string) {
    if (kind === "video") return "Animacion";
    if (kind === "sequence") return "Secuencia";
    return "Imagen";
}

function getKindIcon(kind: string) {
    if (kind === "video") return <MovieIcon />;
    if (kind === "sequence") return <CollectionsIcon />;
    return <ImageIcon />;
}

export default function GalleryScreen() {
    const navigate = useMyNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [sequenceFrame, setSequenceFrame] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const [collectionPage, setCollectionPage] = useState(0);
    const galleryRootRef = useRef<HTMLDivElement | null>(null);
    const selectedItem = galleryItems[selectedIndex];
    const itemsPerPage = 6;
    const collectionAutoAdvanceMs = 9000;
    const collectionPageCount = Math.ceil(galleryItems.length / itemsPerPage);
    const visibleGalleryItems = galleryItems.slice(
        collectionPage * itemsPerPage,
        collectionPage * itemsPerPage + itemsPerPage
    );

    const selectedVisual = useMemo(() => {
        if (selectedItem.kind === "sequence") {
            return selectedItem.frames[sequenceFrame] || selectedItem.frames[0];
        }
        return getGalleryThumbnail(selectedItem);
    }, [selectedItem, sequenceFrame]);

    const goToItem = (index: number) => {
        const nextIndex = (index + galleryItems.length) % galleryItems.length;
        setSelectedIndex(nextIndex);
        setCollectionPage(Math.floor(nextIndex / itemsPerPage));
        setSequenceFrame(0);
    };

    const goToCollectionPage = (page: number) => {
        setCollectionPage((page + collectionPageCount) % collectionPageCount);
    };

    const exitGallery = useCallback(() => {
        if (isLeaving) return;

        setIsLeaving(true);
        runViewTransition(() => navigate(MAIN_MENU_ROUTE));
    }, [isLeaving, navigate]);

    const handleWheelCapture = (event: WheelEvent<HTMLDivElement>) => {
        const root = galleryRootRef.current;
        if (!root || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

        event.preventDefault();
        root.scrollTop += event.deltaY;
    };

    useEffect(() => {
        if (selectedItem.kind !== "sequence") return;

        const timer = window.setInterval(() => {
            setSequenceFrame((current) => (current + 1) % selectedItem.frames.length);
        }, 900);

        return () => window.clearInterval(timer);
    }, [selectedItem]);

    useEffect(() => {
        if (collectionPageCount <= 1) return;

        const timer = window.setTimeout(() => {
            setCollectionPage((current) => (current + 1) % collectionPageCount);
        }, collectionAutoAdvanceMs);

        return () => window.clearTimeout(timer);
    }, [collectionAutoAdvanceMs, collectionPage, collectionPageCount]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") exitGallery();
            if (event.key === "ArrowLeft") goToItem(selectedIndex - 1);
            if (event.key === "ArrowRight") goToItem(selectedIndex + 1);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [exitGallery, selectedIndex]);

    const heroTitleSx = {
        color: "#ffffff",
        textShadow:
            "2px 6px 0px rgba(92, 36, 105, 0.46), 15px 16px 32px rgba(85, 34, 103, 0.68), 0 0 30px rgba(255, 186, 220, 0.82), 0 0 52px rgba(255,255,255,0.42)",
    };
    const softTextSx = {
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 2px 10px rgba(69,31,86,0.72), 0 0 10px rgba(255,203,230,0.38)",
    };

    return (
        <Box
            ref={galleryRootRef}
            component={motion.div}
            onWheelCapture={handleWheelCapture}
            initial={{ opacity: 0, scale: 1.018 }}
            animate={{ opacity: isLeaving ? 0 : 1, scale: isLeaving ? 0.985 : 1 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            sx={{
                position: "fixed",
                inset: 0,
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#fff7fb",
                color: "#fff",
                scrollbarGutter: "stable",
                scrollbarColor: "rgba(190,91,154,0.9) rgba(255,255,255,0.42)",
                "&::-webkit-scrollbar": {
                    width: 14,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(255,255,255,0.42)",
                    borderLeft: "1px solid rgba(111,43,118,0.12)",
                },
                "&::-webkit-scrollbar-thumb": {
                    background:
                        "linear-gradient(180deg, rgba(255,174,212,0.95), rgba(166,92,190,0.92))",
                    border: "3px solid rgba(255,255,255,0.52)",
                    borderRadius: 999,
                },
            }}
        >
            <AnimatePresence mode='wait'>
                <Box
                    key={selectedVisual}
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.16 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    sx={{
                        position: "fixed",
                        inset: 0,
                        backgroundImage: `url("${selectedVisual}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "saturate(1.05) contrast(0.9)",
                    }}
                />
            </AnimatePresence>

            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    opacity: 1,
                    backgroundImage: `
                        linear-gradient(45deg, rgba(255, 159, 202, 0.38) 25%, transparent 25%, transparent 75%, rgba(255, 159, 202, 0.38) 75%),
                        linear-gradient(45deg, rgba(209, 179, 255, 0.34) 25%, transparent 25%, transparent 75%, rgba(209, 179, 255, 0.34) 75%),
                        repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.55) 0 3px, transparent 3px 22px),
                        linear-gradient(135deg, rgba(255, 245, 250, 0.96), rgba(255, 219, 238, 0.9) 42%, rgba(230, 215, 255, 0.92))
                    `,
                    backgroundSize: "84px 84px, 84px 84px, 44px 44px, 100% 100%",
                    backgroundPosition: "0 0, 42px 42px, 0 0, 0 0",
                }}
            />

            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    background:
                        "linear-gradient(90deg, rgba(96,46,112,0.64) 0%, rgba(255,255,255,0.18) 50%, rgba(112,54,126,0.58) 100%)",
                }}
            />

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100vh",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 3 },
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) auto" },
                        alignItems: "center",
                        gap: { xs: 1.25, sm: 2 },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.25, sm: 2 }, minWidth: 0 }}>
                        <Button
                            variant='soft'
                            color='neutral'
                            startDecorator={<ArrowBackIcon />}
                            onClick={exitGallery}
                            sx={{
                                color: "#fff",
                                display: "inline-flex",
                                px: { xs: 1.25, sm: 2 },
                                minWidth: { xs: "auto", sm: 86 },
                                textShadow: "0 2px 8px rgba(69,31,86,0.4)",
                                backgroundColor: "rgba(109,56,126,0.34)",
                                border: "1px solid rgba(255,255,255,0.42)",
                                boxShadow: "0 10px 24px rgba(109,56,126,0.2)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.26)",
                                    boxShadow: "0 0 24px rgba(255,183,217,0.46)",
                                },
                            }}
                        >
                            Salir
                        </Button>

                        <Typography
                            level='h2'
                            sx={{
                                fontFamily: "'ConteScript', cursive",
                                fontSize: { xs: "2.25rem", md: "3.35rem" },
                                fontWeight: 300,
                                lineHeight: 1,
                                pt: { xs: 0.65, md: 0.85 },
                                ...heroTitleSx,
                            }}
                        >
                            Galeria
                        </Typography>
                    </Box>

                    <Chip
                        startDecorator={getKindIcon(selectedItem.kind)}
                        variant='soft'
                        sx={{
                            display: { xs: "none", sm: "inline-flex" },
                            justifySelf: "end",
                            color: "#5a2864",
                            backgroundColor: "rgba(255,255,255,0.72)",
                            border: "1px solid rgba(255,215,236,0.84)",
                            boxShadow: "0 8px 22px rgba(107, 48, 126, 0.24), inset 0 0 14px rgba(255, 190, 224, 0.32)",
                            textShadow: "0 1px 0 rgba(255,255,255,0.82)",
                            fontWeight: 700,
                            "& .MuiChip-startDecorator": {
                                color: "#b34984",
                            },
                        }}
                    >
                        {getKindLabel(selectedItem.kind)}
                    </Chip>
                </Box>

                <Box
                    sx={{
                        minHeight: 0,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(280px, 340px)" },
                        gridTemplateRows: { xs: "auto auto", lg: "auto" },
                        gap: { xs: 1.5, md: 2.5 },
                        alignItems: "start",
                        pb: { xs: 4, md: 5 },
                    }}
                >
                    <Box
                        sx={{
                            minHeight: { xs: 360, sm: 460, lg: "calc(100vh - 150px)" },
                            height: { xs: "62vh", sm: "64vh", lg: "calc(100vh - 150px)" },
                            maxHeight: { xs: 640, lg: "none" },
                            position: "relative",
                            top: { lg: 24 },
                            alignSelf: "start",
                            display: "grid",
                            placeItems: "center",
                            border: "1px solid rgba(255,255,255,0.16)",
                            backgroundColor: "rgba(91,47,110,0.28)",
                            boxShadow: "0 24px 70px rgba(110,58,126,0.28)",
                            overflow: "hidden",
                        }}
                    >
                        <IconButton
                            variant='soft'
                            color='neutral'
                            onClick={() => goToItem(selectedIndex - 1)}
                            sx={{
                                position: "absolute",
                                left: { xs: 8, md: 18 },
                                zIndex: 2,
                                color: "#fff",
                                backgroundColor: "rgba(102,55,122,0.46)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                    boxShadow: "0 0 26px rgba(255,183,217,0.36)",
                                },
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>

                        <AnimatePresence mode='wait'>
                            <Box
                                key={`${selectedItem.id}-${selectedVisual}`}
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.01 }}
                                transition={{ duration: 0.35 }}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "grid",
                                    placeItems: "center",
                                }}
                            >
                                {selectedItem.kind === "video" ? (
                                    <video
                                        src={selectedItem.src}
                                        poster={selectedItem.poster}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                ) : (
                                    <img
                                        src={selectedVisual}
                                        alt={selectedItem.title}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                )}
                            </Box>
                        </AnimatePresence>

                        <IconButton
                            variant='soft'
                            color='neutral'
                            onClick={() => goToItem(selectedIndex + 1)}
                            sx={{
                                position: "absolute",
                                right: { xs: 8, md: 18 },
                                zIndex: 2,
                                color: "#fff",
                                backgroundColor: "rgba(102,55,122,0.46)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                    boxShadow: "0 0 26px rgba(255,183,217,0.36)",
                                },
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>

                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                bottom: 0,
                                p: { xs: 1.5, md: 2 },
                                background: "linear-gradient(0deg, rgba(86,43,105,0.82), rgba(86,43,105,0))",
                            }}
                        >
                            <Typography
                                level='title-lg'
                                sx={heroTitleSx}
                            >
                                {selectedItem.title}
                            </Typography>
                            <Typography level='body-sm' sx={softTextSx}>
                                {selectedItem.subtitle}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            minHeight: "auto",
                            display: "block",
                            gap: 1.25,
                        }}
                    >
                        <Typography
                            level='h2'
                            sx={{
                                fontFamily: "'ConteScript', cursive",
                                fontSize: { xs: "1.25rem", md: "2.35rem" },
                                fontWeight: 100,
                                pt: 0.2,
                                mb: 1,
                                textAlign: "center",
                                ...heroTitleSx,
                            }}
                        >
                            Coleccion
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconButton
                                variant='soft'
                                color='neutral'
                                onClick={() => goToCollectionPage(collectionPage - 1)}
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "rgba(102,55,122,0.46)",
                                    boxShadow: "0 10px 24px rgba(109,56,126,0.22)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 0 24px rgba(255,183,217,0.44)",
                                    },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>

                            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                                <AnimatePresence mode='wait'>
                                    <Box
                                        key={collectionPage}
                                        component={motion.div}
                                        initial={{ opacity: 0, x: 18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -18 }}
                                        transition={{ duration: 0.32, ease: "easeOut" }}
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(2, minmax(0, 1fr))",
                                                sm: "repeat(3, minmax(0, 1fr))",
                                                lg: "repeat(2, minmax(0, 1fr))",
                                            },
                                            gridAutoRows: { xs: "118px", sm: "142px", lg: "148px" },
                                            gap: 1,
                                        }}
                                    >
                                        {visibleGalleryItems.map((item, pageIndex) => {
                                            const itemIndex = collectionPage * itemsPerPage + pageIndex;
                                            const isSelected = itemIndex === selectedIndex;
                                            return (
                                                <Box
                                                    key={item.id}
                                                    component='button'
                                                    onClick={() => goToItem(itemIndex)}
                                                    sx={{
                                                        position: "relative",
                                                        minWidth: 0,
                                                        height: "100%",
                                                        p: 0,
                                                        border: isSelected
                                                            ? "2px solid rgba(255,226,174,0.94)"
                                                            : "1px solid rgba(255,255,255,0.15)",
                                                        backgroundColor: "rgba(255,255,255,0.05)",
                                                        cursor: "pointer",
                                                        overflow: "hidden",
                                                        boxShadow: isSelected
                                                            ? "0 0 28px rgba(255,183,217,0.48)"
                                                            : "0 10px 22px rgba(110,58,126,0.22)",
                                                        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                                                        "&:hover, &:focus-visible": {
                                                            transform: "translateY(-2px)",
                                                            borderColor: "rgba(255,204,229,0.9)",
                                                            boxShadow: "0 0 26px rgba(255,183,217,0.4)",
                                                            outline: "none",
                                                        },
                                                    }}
                                                >
                                                    <img
                                                        src={getGalleryThumbnail(item)}
                                                        alt={item.title}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            background:
                                                                "linear-gradient(0deg, rgba(82,39,102,0.78) 0%, rgba(82,39,102,0.08) 72%)",
                                                        }}
                                                    />
                                                    <Box sx={{ position: "absolute", left: 8, right: 8, bottom: 7, minWidth: 0 }}>
                                                        <Typography
                                                            level='body-xs'
                                                            sx={{
                                                                ...heroTitleSx,
                                                                fontWeight: 700,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                fontSize: "0.76rem",
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Typography>
                                                        <Typography
                                                            level='body-xs'
                                                            sx={{
                                                                ...softTextSx,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                fontSize: "0.7rem",
                                                            }}
                                                        >
                                                            {getKindLabel(item.kind)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </AnimatePresence>
                            </Box>

                            <IconButton
                                variant='soft'
                                color='neutral'
                                onClick={() => goToCollectionPage(collectionPage + 1)}
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "rgba(102,55,122,0.46)",
                                    boxShadow: "0 10px 24px rgba(109,56,126,0.22)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        boxShadow: "0 0 24px rgba(255,183,217,0.44)",
                                    },
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 0.75,
                                mt: 1.25,
                            }}
                        >
                            {Array.from({ length: collectionPageCount }).map((_, page) => (
                                <Box
                                    key={page}
                                    component='button'
                                    onClick={() => goToCollectionPage(page)}
                                    aria-label={`Pagina ${page + 1}`}
                                    sx={{
                                        width: page === collectionPage ? 24 : 9,
                                        height: 9,
                                        p: 0,
                                        border: "1px solid rgba(255,255,255,0.72)",
                                        borderRadius: 999,
                                        cursor: "pointer",
                                        position: "relative",
                                        overflow: "hidden",
                                        background: "rgba(255,255,255,0.42)",
                                        boxShadow:
                                            page === collectionPage
                                                ? "0 0 22px rgba(255,63,159,0.78), 0 0 36px rgba(255,232,92,0.36)"
                                                : "0 4px 12px rgba(97,46,111,0.18)",
                                        transition: "width 180ms ease, box-shadow 180ms ease",
                                        "&:hover, &:focus-visible": {
                                            outline: "none",
                                            boxShadow: "0 0 18px rgba(255,183,217,0.7)",
                                        },
                                    }}
                                >
                                    {page === collectionPage && (
                                        <motion.span
                                            key={`collection-progress-${collectionPage}`}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: collectionAutoAdvanceMs / 1000, ease: "linear" }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background:
                                                    "linear-gradient(90deg, #ff3f9f 0%, #ff7a59 52%, #ffe85c 100%)",
                                                boxShadow: "0 0 16px rgba(255,63,159,0.82), inset 0 0 8px rgba(255,255,255,0.72)",
                                                borderRadius: 999,
                                                transformOrigin: "left center",
                                            }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
