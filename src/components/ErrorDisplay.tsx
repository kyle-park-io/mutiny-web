import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { onMount } from "solid-js";

import { ExternalLink } from "~/components";
import {
    Button,
    DefaultMain,
    LargeHeader,
    NiceP,
    SmallHeader
} from "~/components/layout";
import { useI18n } from "~/i18n/context";

export function SimpleErrorDisplay(props: { error: Error }) {
    return (
        <p class="rounded-xl bg-white/10 p-4 font-mono">
            <span class="font-bold">{props.error.name}</span>:{" "}
            {props.error.message}
        </p>
    );
}

export function ErrorDisplay(props: { error: Error }) {
    const i18n = useI18n();
    onMount(() => {
        console.error(props.error);
    });
    return (
        <DefaultMain>
            <Title>{i18n.t("error.general.oh_no")}</Title>
            <LargeHeader>{i18n.t("error.title")}</LargeHeader>
            <SmallHeader>
                {i18n.t("error.general.never_should_happen")}
            </SmallHeader>
            <SimpleErrorDisplay error={props.error} />
            <NiceP>
                {i18n.t("error.general.try_reloading")}{" "}
                <ExternalLink href="https://matrix.to/#/#mutiny-community:lightninghackers.com">
                    {i18n.t("error.general.support_link")}
                </ExternalLink>
            </NiceP>
            <Button
                onClick={() =>
                    console.log("리로드 버튼 비활성화됨 (지갑 코드 추출 모드)")
                }
            >
                {i18n.t("error.reload")} (비활성화됨)
            </Button>
            <NiceP>
                지갑 코드 추출 모드: 자동 리다이렉션이 모두 비활성화되었습니다.
            </NiceP>
            <div class="h-full" />
            <Button
                onClick={() =>
                    console.log("홈 이동 버튼 비활성화됨 (지갑 코드 추출 모드)")
                }
                intent="red"
            >
                {i18n.t("common.dangit")} (비활성화됨)
            </Button>
        </DefaultMain>
    );
}
