/**
 * 안전한 브라우저 API 접근을 위한 유틸리티 함수들
 * SSR 환경에서도 오류 없이 동작합니다.
 */

/**
 * 브라우저 환경인지 확인합니다
 * @returns 브라우저 환경 여부
 */
export function isBrowser(): boolean {
    return typeof window !== "undefined";
}

/**
 * window 객체에 안전하게 접근합니다
 * @returns window 객체 또는 undefined
 */
export function safeWindow(): Window | undefined {
    return isBrowser() ? window : undefined;
}

/**
 * window.location에 안전하게 접근합니다
 * @returns location 객체 또는 undefined
 */
export function safeLocation(): Location | undefined {
    const win = safeWindow();
    return win?.location;
}

/**
 * 안전하게 페이지를 리로드합니다
 * @returns 성공 여부
 */
export function safeReload(): boolean {
    const location = safeLocation();
    if (location) {
        location.reload();
        return true;
    }
    return false;
}

/**
 * 안전하게 URL로 이동합니다
 * @param url 이동할 URL
 * @returns 성공 여부
 */
export function safeNavigate(url: string): boolean {
    const location = safeLocation();
    if (location) {
        location.href = url;
        return true;
    }
    return false;
}

/**
 * 안전하게 새 창을 엽니다
 * @param url 열 URL
 * @param target 타겟 (기본값: "_blank")
 * @returns 성공 여부
 */
export function safeOpenWindow(
    url: string,
    target: string = "_blank"
): boolean {
    const win = safeWindow();
    if (win) {
        win.open(url, target);
        return true;
    }
    return false;
}

/**
 * 안전하게 브라우저 히스토리를 뒤로 이동합니다
 * @returns 성공 여부
 */
export function safeHistoryBack(): boolean {
    const win = safeWindow();
    if (win?.history) {
        win.history.back();
        return true;
    }
    return false;
}

/**
 * 안전하게 matchMedia를 사용합니다
 * @param query 미디어 쿼리
 * @returns MediaQueryList 또는 undefined
 */
export function safeMatchMedia(query: string): MediaQueryList | undefined {
    const win = safeWindow();
    return win?.matchMedia ? win.matchMedia(query) : undefined;
}

/**
 * 안전하게 이벤트 리스너를 추가합니다
 * @param type 이벤트 타입
 * @param listener 이벤트 리스너
 * @param options 옵션
 * @returns 성공 여부
 */
export function safeAddEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
): boolean {
    const win = safeWindow();
    if (win) {
        win.addEventListener(type, listener, options);
        return true;
    }
    return false;
}

/**
 * 안전하게 이벤트 리스너를 제거합니다
 * @param type 이벤트 타입
 * @param listener 이벤트 리스너
 * @param options 옵션
 * @returns 성공 여부
 */
export function safeRemoveEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions
): boolean {
    const win = safeWindow();
    if (win) {
        win.removeEventListener(type, listener, options);
        return true;
    }
    return false;
}

/**
 * document 객체에 안전하게 접근합니다
 * @returns document 객체 또는 undefined
 */
export function safeDocument(): Document | undefined {
    return isBrowser() ? document : undefined;
}

/**
 * 안전하게 DOM 요소를 가져옵니다
 * @param id 요소 ID
 * @returns 요소 또는 null
 */
export function safeGetElementById(id: string): Element | null {
    const doc = safeDocument();
    return doc ? doc.getElementById(id) : null;
}

/**
 * 안전하게 DOM 요소를 쿼리합니다
 * @param selector CSS 선택자
 * @returns 요소 또는 null
 */
export function safeQuerySelector(selector: string): Element | null {
    const doc = safeDocument();
    return doc ? doc.querySelector(selector) : null;
}

/**
 * 안전하게 DOM 요소를 생성합니다
 * @param tagName 태그 이름
 * @returns 요소 또는 null
 */
export function safeCreateElement(tagName: string): Element | null {
    const doc = safeDocument();
    return doc ? doc.createElement(tagName) : null;
}

/**
 * navigator 객체에 안전하게 접근합니다
 * @returns navigator 객체 또는 undefined
 */
export function safeNavigator(): Navigator | undefined {
    return isBrowser() ? navigator : undefined;
}

/**
 * localStorage에서 값을 안전하게 가져옵니다
 * @param key 저장소 키
 * @param defaultValue 기본값 (localStorage가 없거나 키가 없을 때 반환)
 * @returns 저장된 값 또는 기본값
 */
export function safeGetLocalStorage(
    key: string,
    defaultValue: string | null = null
): string | null {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return defaultValue;
    }

    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`localStorage.getItem failed for key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * localStorage에 값을 안전하게 저장합니다
 * @param key 저장소 키
 * @param value 저장할 값
 * @returns 성공 여부
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return false;
    }

    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`localStorage.setItem failed for key "${key}":`, error);
        return false;
    }
}

/**
 * localStorage에서 값을 안전하게 제거합니다
 * @param key 저장소 키
 * @returns 성공 여부
 */
export function safeRemoveLocalStorage(key: string): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return false;
    }

    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`localStorage.removeItem failed for key "${key}":`, error);
        return false;
    }
}

/**
 * localStorage를 안전하게 비웁니다
 * @returns 성공 여부
 */
export function safeClearLocalStorage(): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return false;
    }

    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.warn("localStorage.clear failed:", error);
        return false;
    }
}

/**
 * JSON 객체를 localStorage에 안전하게 저장합니다
 * @param key 저장소 키
 * @param value 저장할 객체
 * @returns 성공 여부
 */
export function safeSetLocalStorageJSON(key: string, value: any): boolean {
    try {
        const jsonString = JSON.stringify(value);
        return safeSetLocalStorage(key, jsonString);
    } catch (error) {
        console.warn(`JSON.stringify failed for key "${key}":`, error);
        return false;
    }
}

/**
 * localStorage에서 JSON 객체를 안전하게 가져옵니다
 * @param key 저장소 키
 * @param defaultValue 기본값
 * @returns 파싱된 객체 또는 기본값
 */
export function safeGetLocalStorageJSON<T>(key: string, defaultValue: T): T {
    const item = safeGetLocalStorage(key);
    if (item === null) {
        return defaultValue;
    }

    try {
        return JSON.parse(item) as T;
    } catch (error) {
        console.warn(`JSON.parse failed for key "${key}":`, error);
        return defaultValue;
    }
}
