import { createAsync, useNavigate } from "@solidjs/router";
import { Show, Suspense } from "solid-js";

import {
    Circle,
    DecryptDialog,
    DefaultMain,
    HomeBalance,
    HomePrompt,
    HomeSubnav,
    LabelCircle,
    LoadingIndicator,
    NavBar,
    ReloadPrompt,
    SocialActionRow
} from "~/components";
import { Fab } from "~/components/Fab";
import { useMegaStore } from "~/state/megaStore";
import { safeGetLocalStorage } from "~/utils/localStorage";

export function WalletHeader(props: { loading: boolean }) {
    const navigate = useNavigate();
    const [state, _actions, sw] = useMegaStore();

    const profile = createAsync(async () => {
        if (props.loading) {
            return undefined;
        }
        return await sw.get_nostr_profile();
    });

    return (
        <header class="grid grid-cols-[auto_minmax(0,_1fr)_auto] items-center gap-4">
            <Suspense
                fallback={
                    <LabelCircle
                        contact
                        label={false}
                        image_url={undefined}
                        onClick={() => navigate("/profile")}
                    />
                }
            >
                <LabelCircle
                    contact
                    label={false}
                    image_url={profile()?.picture}
                    onClick={() => navigate("/profile")}
                />
            </Suspense>
            <HomeBalance />
            <Circle onClick={() => navigate("/settings")}>
                <img
                    src={
                        state.mutiny_plus
                            ? "/m-plus.png"
                            : "/mutiny-pixel-m.png"
                    }
                    alt="mutiny"
                    width={"32px"}
                    height={"32px"}
                    style={{
                        "image-rendering": "pixelated"
                    }}
                />
            </Circle>
        </header>
    );
}

export function Main() {
    const [state] = useMegaStore();

    const navigate = useNavigate();

    // Check for local wallet setup
    const walletType = safeGetLocalStorage("wallet_type");
    const userPrivateKey = safeGetLocalStorage("user_private_key");
    const userAddress = safeGetLocalStorage("user_address");

    return (
        <DefaultMain>
            <Show when={state.load_stage !== "done"}>
                <WalletHeader loading={true} />
                <div class="flex-1" />

                <LoadingIndicator />
                <div class="flex-1" />
            </Show>
            <Show when={state.load_stage === "done"}>
                <WalletHeader loading={false} />

                {/* Show local wallet info if available */}
                <Show when={walletType}>
                    <div class="mb-4 rounded-lg bg-m-grey-800 p-4">
                        <h3 class="mb-2 text-lg font-semibold">
                            로컬 지갑 정보
                        </h3>
                        <div class="mb-2 text-sm text-m-grey-400">
                            타입:{" "}
                            {walletType === "wif"
                                ? "WIF Private Key"
                                : walletType === "hex"
                                  ? "Hex Private Key"
                                  : walletType === "address"
                                    ? "Bitcoin Address"
                                    : "Unknown"}
                        </div>
                        <Show when={userPrivateKey}>
                            <div class="break-all rounded bg-m-grey-900 p-2 font-mono text-xs">
                                Private Key: {userPrivateKey?.substring(0, 20)}
                                ...
                            </div>
                        </Show>
                        <Show when={userAddress}>
                            <div class="break-all rounded bg-m-grey-900 p-2 font-mono text-xs">
                                Address: {userAddress}
                            </div>
                        </Show>
                    </div>
                </Show>

                <Show when={!state.wallet_loading && !state.safe_mode}>
                    <SocialActionRow
                        onScan={() => navigate("/scanner")}
                        onSearch={() => navigate("/search")}
                    />
                </Show>

                {/* <hr class="border-t border-m-grey-700" /> */}
                <ReloadPrompt />
                <HomeSubnav />
            </Show>

            <Fab
                onSearch={() => navigate("/search")}
                onScan={() => navigate("/scanner")}
            />

            <DecryptDialog />
            <HomePrompt />
            <NavBar activeTab="home" />
        </DefaultMain>
    );
}
