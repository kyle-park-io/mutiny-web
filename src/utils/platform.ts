// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios

import { Capacitor } from "@capacitor/core";

import { safeDocument, safeNavigator } from "./localStorage";

export function iosNotNative() {
    if (Capacitor.isNativePlatform() || Capacitor.getPlatform() === "ios") {
        return false;
    }
    return (
        [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod"
        ].includes(safeNavigator()?.platform || "") ||
        // iPad on iOS 13 detection
        (safeNavigator()?.userAgent.includes("Mac") &&
            "ontouchend" in (safeDocument() || {}))
    );
}
