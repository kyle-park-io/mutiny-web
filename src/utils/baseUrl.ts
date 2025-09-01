import { Capacitor } from "@capacitor/core";

import { safeLocation } from "~/utils/localStorage";

// On mobile the origin URL is localhost, so we hardcode the base URL
export function baseUrlAccountingForNative(network?: string) {
    if (Capacitor.isNativePlatform()) {
        return network === "bitcoin"
            ? "https://app.mutinywallet.com"
            : "https://signet-app.mutinywallet.com";
    } else {
        const location = safeLocation();
        return location?.origin || "https://app.mutinywallet.com";
    }
}
