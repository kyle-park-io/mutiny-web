import { i18n } from "i18next";
import { createContext, useContext } from "solid-js";

export const I18nContext = createContext<i18n>();

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        // MUTINY_DISABLED 모드에서는 mock i18n 객체 반환
        if ((globalThis as any).MUTINY_DISABLED) {
            console.log("I18nContext not available - returning mock i18n");
            return {
                t: (key: string) => key, // 키를 그대로 반환하는 mock 함수
                language: "en",
                changeLanguage: () => Promise.resolve(),
                exists: () => true,
                dir: () => "ltr"
            } as any;
        }
        throw new ReferenceError("I18nContext");
    }

    return context;
}
