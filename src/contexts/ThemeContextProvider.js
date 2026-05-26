// ThemeContextProvider.tsx
import React, { useMemo } from "react";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

function ThemeContextProvider({ children }) {
    const theme = useMemo(() => {
        // Resolve CSS variables at runtime to concrete values that MUI supports
        const css =
            typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
        const getVar = (name, fallback) => {
            if (!css) return fallback;
            const v = css.getPropertyValue(name);
            if (!v) return fallback;
            return v.trim() || fallback;
        };

        const t = createTheme({
            palette: {
                mode: "dark",
                primary: { main: getVar("--dc-brand", "#5865F2") },
                secondary: { main: getVar("--dc-interactive-normal", "#1e90ff") },
                background: {
                    default: getVar("--dc-bg-primary", "#0b0c0d"),
                    paper: getVar("--dc-bg-secondary", "#111213"),
                },
                text: {
                    primary: getVar("--dc-text-normal", "#dcddde"),
                    secondary: getVar("--dc-text-muted", "#b9bbbe"),
                },
                success: { main: getVar("--dc-status-positive", "#3ba55d") },
                warning: { main: getVar("--dc-status-warning", "#faa61a") },
                error: { main: getVar("--dc-status-danger", "#ed4245") },
                divider: getVar("--dc-divider", "rgba(255,255,255,0.08)"),
            },
            typography: {
                fontFamily: "var(--dc-font-primary)",
                h3: { fontSize: 24, color: "var(--dc-header-primary)" },
                h4: { fontSize: 20, color: "var(--dc-header-primary)" },
                h5: { fontSize: 18, color: "var(--dc-header-primary)" },
                h6: { fontSize: 14, color: "var(--dc-header-primary)" },
                body1: {
                    fontSize: "var(--dc-font-size-md)",
                    color: "var(--dc-text-normal)",
                },
                body2: {
                    fontSize: "var(--dc-font-size-sm)",
                    color: "var(--dc-text-muted)",
                },
            },
            shape: { borderRadius: 8 }, // var() 在这里不能用，MUI 需要数字
            components: {
                MuiPaper: {
                    styleOverrides: {
                        root: { backgroundImage: "none" }, // 去掉 MUI dark mode elevation 叠加
                    },
                },
                MuiIconButton: {
                    defaultProps: { color: "secondary" },
                },
                MuiButton: {
                    styleOverrides: {
                        root: { textTransform: "none", fontWeight: "bold" },
                    },
                },
                MuiDivider: {
                    styleOverrides: {
                        root: { borderColor: "var(--dc-divider)" },
                    },
                },
            },
        });
        return responsiveFontSizes(t);
    }, []); // 依赖为空，theme 只创建一次

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* 应用 background.default 到 body */}
            {children}
        </ThemeProvider>
    );
}

export default ThemeContextProvider;
