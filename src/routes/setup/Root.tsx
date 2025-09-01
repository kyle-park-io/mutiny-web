import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import logo from "~/assets/mutiny-pixel-logo.png";
import { Button, DefaultMain, NiceP, TextField } from "~/components";
import { useI18n } from "~/i18n/context";
import { useMegaStore } from "~/state/megaStore";
import {
    safeClearLocalStorage,
    safeGetLocalStorage,
    safeReload,
    safeSetLocalStorage,
    safeWindow
} from "~/utils/localStorage";

export function Setup() {
    const [_state, actions] = useMegaStore();
    const i18n = useI18n();

    const [isCreatingNewWallet, setIsCreatingNewWallet] = createSignal(false);
    const [quickSetupInput, setQuickSetupInput] = createSignal("");
    const [isQuickSetup, setIsQuickSetup] = createSignal(false);

    const navigate = useNavigate();

    async function handleNewWallet() {
        try {
            setIsCreatingNewWallet(true);
            const profileSetupStage = safeGetLocalStorage(
                "profile_setup_stage"
            );

            // Check for nip07 browser extension. If it exists, we can skip the profile setup
            const win = safeWindow();
            const hasNip07 = win ? Object.prototype.hasOwnProperty.call(
                win,
                "nostr"
            ) : false;

            await actions.setup(undefined);

            if (!profileSetupStage && !hasNip07) {
                navigate("/newprofile");
            } else {
                navigate("/");
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async function handleQuickSetup() {
        try {
            setIsQuickSetup(true);
            const input = quickSetupInput().trim();

            if (!input) {
                console.log("No input provided, creating new wallet");
                await handleNewWallet();
                return;
            }

            // Check if it's a mnemonic (12 words)
            const words = input.split(/\s+/);
            if (words.length === 12) {
                console.log("Detected mnemonic, restoring wallet");
                await actions.setup(input);
                navigate("/");
                return;
            }

            // Check if it's a WIF private key (starts with 5, K, or L and 51-52 chars)
            if (
                (input.startsWith("5") ||
                    input.startsWith("K") ||
                    input.startsWith("L")) &&
                (input.length === 51 || input.length === 52)
            ) {
                console.log("Detected WIF private key, bypassing Mutiny setup");
                // Store private key locally and skip Mutiny setup
                safeSetLocalStorage("user_private_key", input);
                safeSetLocalStorage("wallet_type", "wif");
                safeSetLocalStorage("setup_completed", "true");
                navigate("/");
                return;
            }

            // Check if it's a hex private key (64 hex characters)
            if (/^[0-9a-fA-F]{64}$/.test(input)) {
                console.log("Detected hex private key, bypassing Mutiny setup");
                // Store private key locally and skip Mutiny setup
                safeSetLocalStorage("user_private_key", input);
                safeSetLocalStorage("wallet_type", "hex");
                safeSetLocalStorage("setup_completed", "true");
                navigate("/");
                return;
            }

            // Check if it's a Bitcoin address
            if (
                input.startsWith("1") ||
                input.startsWith("3") ||
                input.startsWith("bc1") ||
                input.startsWith("tb1")
            ) {
                console.log("Detected Bitcoin address, bypassing Mutiny setup");
                // Store address locally and skip Mutiny setup
                safeSetLocalStorage("user_address", input);
                safeSetLocalStorage("wallet_type", "address");
                safeSetLocalStorage("setup_completed", "true");
                navigate("/");
                return;
            }

            // For any other input, just create new wallet
            console.log("Unknown input format, creating new wallet");
            await actions.setup(undefined);
            navigate("/");
        } catch (e) {
            console.error(e);
            // Fallback to new wallet creation
            await handleNewWallet();
        } finally {
            setIsQuickSetup(false);
        }
    }

    return (
        <DefaultMain>
            <div class="flex flex-1 flex-col items-center justify-between gap-4">
                <div class="flex-1" />
                <div class="flex w-full max-w-md flex-col items-center gap-4">
                    <img
                        id="mutiny-logo"
                        src={logo}
                        class="h-[50px] w-[172px]"
                        alt="Mutiny Plus logo"
                    />
                    <NiceP>{i18n.t("setup.initial.welcome")}</NiceP>

                    {/* Quick Setup Section */}
                    <div class="flex w-full flex-col gap-3 rounded-lg bg-m-grey-800 p-4">
                        <div class="text-center text-sm">
                            빠른 설정: WIF/Hex Private Key, Bitcoin 주소, 또는
                            12단어 Mnemonic
                        </div>
                        <input
                            type="text"
                            placeholder="예: 5KJvs... (WIF) 또는 e3b0c... (Hex) 또는 12단어..."
                            value={quickSetupInput()}
                            onInput={(e) =>
                                setQuickSetupInput(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            class="w-full rounded-lg border border-m-grey-750 bg-m-grey-750 p-2 placeholder-neutral-400"
                        />
                        <Button
                            layout="full"
                            onClick={handleQuickSetup}
                            loading={isQuickSetup()}
                            disabled={isCreatingNewWallet()}
                        >
                            시작하기
                        </Button>
                        <Button
                            intent="text"
                            layout="full"
                            onClick={() => {
                                safeClearLocalStorage();
                                safeReload();
                            }}
                        >
                            초기화 (에러 시 사용)
                        </Button>
                    </div>

                    <div class="text-center text-sm text-m-grey-400">또는</div>

                    <Button
                        layout="full"
                        onClick={handleNewWallet}
                        loading={isCreatingNewWallet()}
                        disabled={isQuickSetup()}
                    >
                        {i18n.t("setup.initial.new_wallet")}
                    </Button>
                    <Button
                        intent="text"
                        layout="full"
                        disabled={isCreatingNewWallet() || isQuickSetup()}
                        onClick={() => navigate("/setup/restore")}
                    >
                        {i18n.t("setup.initial.import_existing")}
                    </Button>
                </div>
                <div class="flex-1" />
            </div>
        </DefaultMain>
    );
}
