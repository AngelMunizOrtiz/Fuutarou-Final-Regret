import { Game, narration } from "@drincs/pixi-vn";
import { Box, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CinematicScenePlayer from "../components/cinematic/CinematicScenePlayer";
import { NARRATION_ROUTE, SCENE_ROUTE } from "../constans";
import { CinematicReturnMode, getCinematicScene } from "../data/cinematicScenes";
import useGameProps from "../hooks/useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../hooks/useQueryInterface";
import { isStorySceneTransition, setStorySceneTransition } from "../utils/ink-utility";

export default function SceneScreen() {
    const { sceneId = "" } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const gameProps = useGameProps();
    const queryClient = useQueryClient();
    const scene = getCinematicScene(sceneId);

    const returnLabel = searchParams.get("returnLabel") || scene?.defaultReturnLabel;
    const returnMode = (searchParams.get("mode") || scene?.defaultReturnMode || "jump") as CinematicReturnMode;
    const resetBeforeReturn =
        searchParams.get("reset") !== null ? searchParams.get("reset") === "1" : Boolean(scene?.resetBeforeReturn);

    const completeScene = useCallback(async () => {
        if (!scene || !returnLabel) {
            setStorySceneTransition(false);
            navigate(NARRATION_ROUTE);
            return;
        }

        if (scene.nextSceneId) {
            const nextParams = new URLSearchParams();
            nextParams.set("returnLabel", returnLabel);
            nextParams.set("mode", returnMode);
            if (resetBeforeReturn) {
                nextParams.set("reset", "1");
            }
            navigate(`${SCENE_ROUTE}/${encodeURIComponent(scene.nextSceneId)}?${nextParams.toString()}`);
            return;
        }

        if (resetBeforeReturn) {
            Game.clear();
        }

        setStorySceneTransition(false);

        if (returnMode === "call") {
            await narration.call(returnLabel, gameProps);
        } else {
            await narration.jump(returnLabel, gameProps);
        }

        await queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
        if (isStorySceneTransition()) {
            return;
        }

        navigate(NARRATION_ROUTE);
    }, [gameProps, navigate, queryClient, resetBeforeReturn, returnLabel, returnMode, scene]);

    if (!scene) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "black",
                    color: "white",
                }}
            >
                <Typography>Scene not found: {sceneId}</Typography>
            </Box>
        );
    }

    return <CinematicScenePlayer key={scene.id} sceneId={scene.id} frames={scene.frames} onComplete={completeScene} />;
}
