import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/joy";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import useEventListener from "../hooks/useKeyDetector";
import useInterfaceStore from "../stores/useInterfaceStore";

export default function VisibilityButton() {
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const editHideInterface = useInterfaceStore((state) => state.editHidden);
    const showInterface = useInterfaceStore((state) => state.show);
    const iconVarians = useMemo(() => (hidden ? `motion-preset-pop` : `motion-scale-out-0`), [hidden]);

    useEffect(() => {
        return () => {
            showInterface();
        };
    }, [showInterface]);

    useEventListener({
        type: "keyup",
        listener: (event) => {
            if (event.code == "KeyV" && event.altKey) {
                editHideInterface();
            }
        },
    });

    return (
        <Tooltip title="Show UI" placement="left">
            <IconButton
                aria-label="Show UI"
                onClick={editHideInterface}
                sx={{
                    position: "absolute",
                    top: { xs: 10, sm: 16 },
                    right: { xs: 10, sm: 16 },
                    zIndex: 190,
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    border: "1px solid rgba(244, 163, 125, 0.72)",
                    color: "#fff8f1",
                    backgroundColor: "rgba(34, 27, 37, 0.86)",
                    boxShadow: "0 6px 18px rgba(24, 15, 29, 0.28)",
                    pointerEvents: hidden ? "auto" : "none",
                    "&:hover": {
                        backgroundColor: "rgba(73, 46, 61, 0.96)",
                    },
                }}
                className={iconVarians}
            >
                <VisibilityIcon />
            </IconButton>
        </Tooltip>
    );
}
