import { Sheet } from "@mui/joy";
import { MasterVolumeSlider } from "../../components/VolumeControl";

export default function AudioSettings() {
    return (
        <Sheet
            variant="outlined"
            sx={{
                p: 1.5,
                borderRadius: "md",
                color: "text.primary",
                backgroundColor: "background.level1",
            }}
        >
            <MasterVolumeSlider />
        </Sheet>
    );
}
