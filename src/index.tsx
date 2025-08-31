import { render } from "solid-js/web";

import "./root.css";

import { setupGlobalErrorHandling } from "./logic/errorDispatch";
import { Router } from "./router";

// 전역 에러 핸들링 설정 (지갑 코드 추출 모드)
console.log("지갑 코드 추출 모드 활성화 - 에러 핸들링 최소화");
// setupGlobalErrorHandling(); // 완전히 비활성화하려면 주석 처리

const root = document.getElementById("root");

render(() => <Router />, root!);
