import { render } from "solid-js/web";

import "./root.css";

import { setupGlobalErrorHandling } from "./logic/errorDispatch";
import { Router } from "./router";

// ⚠️ 최우선: WASM 로드 방지를 위한 전역 변수 설정 (다른 모든 import보다 먼저!)
console.log("🚀 MUTINY_DISABLED 모드 활성화 - 모든 WASM 기능 비활성화");
(globalThis as any).MUTINY_DISABLED = true;

// 전역 에러 핸들링 설정 (지갑 코드 추출 모드)
console.log("지갑 코드 추출 모드 활성화 - 에러 핸들링 최소화");
// setupGlobalErrorHandling(); // 완전히 비활성화하려면 주석 처리

// 강제로 로컬 지갑 모드 활성화 (Mutiny 서버 에러 방지)
console.log("강제 로컬 지갑 모드 활성화 - 모든 Mutiny 기능 비활성화");

render(() => <Router />, document.getElementById("root")!);
