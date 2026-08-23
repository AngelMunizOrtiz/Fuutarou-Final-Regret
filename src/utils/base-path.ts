const configuredBasePath = import.meta.env.BASE_URL || "/";

export const routerBasename = configuredBasePath === "/"
    ? undefined
    : configuredBasePath.replace(/\/$/, "");

export function getAppPathname(pathname = window.location.pathname) {
    if (!routerBasename) return pathname;
    if (pathname === routerBasename) return "/";
    if (pathname.startsWith(`${routerBasename}/`)) {
        return pathname.slice(routerBasename.length);
    }
    return pathname;
}
