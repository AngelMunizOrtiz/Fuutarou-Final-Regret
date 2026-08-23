import { SnackbarProvider } from "notistack";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { routerBasename } from "../utils/base-path";
import MyThemeProvider from "./ThemeProvider";

export default function RootProvider({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter basename={routerBasename}>
            <MyThemeProvider>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    {children}
                </SnackbarProvider>
            </MyThemeProvider>
        </BrowserRouter>
    );
}
