import { Title } from "@solidjs/meta";
import { onMount } from "solid-js";

import { ButtonLink, DefaultMain, LargeHeader } from "~/components";
import { useI18n } from "~/i18n/context";

export function NotFound() {
    const i18n = useI18n();

    // 404 페이지 자동 리다이렉션 비활성화 - 지갑 코드 추출을 위해
    onMount(() => {
        console.log(
            "404 페이지 접근 - 자동 리다이렉션 비활성화됨 (지갑 코드 추출 모드)"
        );
        // 자동 리다이렉션 제거
    });

    return (
        <DefaultMain>
            <Title>페이지를 찾을 수 없습니다</Title>
            <LargeHeader>404 - 페이지 없음</LargeHeader>
            <p>
                요청하신 페이지를 찾을 수 없습니다. 지갑 코드 추출 모드가
                활성화되어 있습니다.
            </p>
            <div class="h-full" />
            <ButtonLink href="/" intent="red">
                홈으로 이동
            </ButtonLink>
        </DefaultMain>
    );
}
