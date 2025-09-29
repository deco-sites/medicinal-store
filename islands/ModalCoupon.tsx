import Icon from "../components/ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../sdk/useId.ts";
import { useEffect, useState } from "preact/hooks";

interface Props {
    /** @title Imagem */
    image?: string;
    /** @title Cupom */
    coupom?: string;
    /** @title Link regulamento */
    regulation?: string;
    /**
  * @description 
  * || "modal_coupon_view" = modal exibido 
  * || "modal_coupon_copy" = cupom copiado 
  * || "modal_coupon_never_show" = nunca mais mostrar
  */




}

const ModalCoupon = ({
    image = "https://assets.decocache.com/medicinal-store/fbdb3f78-e999-4c17-ab2f-940abfa51da9/Rectangle-10.png",
    coupom = "PRIMEIRACOMPRA10",
    regulation = "https://www.exemplo.com/regulamento"
}: Props) => {
    const id = useId();
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const seenKey = "modalCouponSeen";
        const seenExpireKey = "modalCouponSeenExpire";
        const closedSessionKey = "modalCouponClosedSession";

        const seen = localStorage.getItem(seenKey);
        const expire = localStorage.getItem(seenExpireKey);
        const closedSession = sessionStorage.getItem(closedSessionKey);

        // Verifica se deve ocultar por 30 dias
        if (seen === "true" && expire && Date.now() < Number(expire)) {
            setShowModal(false);
            return;
        }
        // Se expirou, remove a flag
        if (expire && Date.now() >= Number(expire)) {
            localStorage.removeItem(seenKey);
            localStorage.removeItem(seenExpireKey);
        }

        // Se o cliente nunca fechou para nunca mais ver, mostra o modal
        if (seen === "true") {
            setShowModal(false);
            return;
        }

        // Se o cliente fechou o modal nesta sessão, não mostra
        if (closedSession === "true") {
            setShowModal(false);
            return;
        }

        setShowModal(true);

        // Só abre o modal se for para mostrar
        const timer = setTimeout(() => {
            const modal = document.getElementById(id) as HTMLDialogElement;
            if (modal && typeof modal.showModal === "function") {
                modal.showModal();
            }
        }, 3000);

        // Dispara evento de analytics quando o modal for exibido
        if (showModal) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "modal_coupon_view",
                coupon: coupom || "PRIMEIRACOMPRA10"
            });
        }

        return () => clearTimeout(timer);
    }, [id, showModal]);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = async () => {
        try {
            // Seleciona o texto do cupom antes de copiar
            const couponText = coupom || "PRIMEIRACOMPRA10";
            const tempInput = document.createElement("input");
            tempInput.value = couponText;
            document.body.appendChild(tempInput);
            tempInput.select();
            tempInput.setSelectionRange(0, couponText.length);
            document.execCommand("copy");
            document.body.removeChild(tempInput);

            setCopied(true);

            // Analytics: cupom copiado
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "modal_coupon_copy",
                coupon: coupom || "PRIMEIRACOMPRA10"
            });
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        sessionStorage.setItem("modalCouponClosedSession", "true");
    };

    const handleNeverShow = () => {
        const expireDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 dias em ms
        localStorage.setItem("modalCouponSeen", "true");
        localStorage.setItem("modalCouponSeenExpire", String(expireDate));
        setShowModal(false);

        // Analytics: usuário não quer ver novamente
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "modal_coupon_never_show",
            coupon: coupom || "PRIMEIRACOMPRA10"
        });
    };

    if (!showModal) return null;

    return (
        <dialog
            id={id}
            class="modal flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-40"
            style={{ padding: 0 }}
        >
            <div class="p-8 bg-base-200 rounded-[20px] lg:max-w-[700px] mx-auto">
                <div class="flex flex-col relative">
                    <button
                        type="button"
                        class="outline-none btn-sm btn-circle text-white bg-primary absolute -top-2 -right-2 flex items-center justify-center"
                        aria-label="Fechar modal"
                        data-close-modal
                        onClick={handleClose}
                    >
                        <Icon id="close" size={20} />
                    </button>
                    <div class="flex flex-col gap-8 lg:flex-row items-center text-center lg:text-center">
                        <img
                            src={image}
                            alt="Cupom de Desconto"
                            class="mx-auto max-w-[313px] max-h-[326px] object-contain"
                        />
                        <div class="flex flex-col gap-8 w-full max-w-[290px]">
                            <p class="text-2xl text-accent uppercase font-semibold">
                                SEJA BEM-VINDO!
                                AQUI TEM UM <span class="text-primary">CUPOM DE DESCONTO EXCLUSIVO :)</span>
                            </p>
                            <div class="bg-white p-5 rounded-[20px]">
                                <p class="text-sm text-accent">use o cupom:</p>
                                <div class="flex items-center justify-center gap-1">
                                    <span class="uppercase font-semibold text-lg text-primary flex gap-1 items-center justify-center">
                                        {copied ? "Cupom copiado!" : coupom || "PRIMEIRACOMPRA10"}
                                    </span>
                                    <button
                                        class="text-white rounded transition px-[10px] py-5 lg:px-0 lg:py-0"
                                        type="button"
                                        onClick={handleCopy}
                                    >
                                        <Icon id="copy" width={16} height={16} fill={copied ? "green" : "currentColor"} />
                                    </button>
                                </div>

                                <p class="text-accent flex gap-1 items-center justify-center">
                                    <Icon id="document" width={16} height={16} /> Confira o regulamento <a rel="noopener noreferrer"
                                        target="_blank" href={regulation} class="text-primary underline cursor-pointer">aqui</a>
                                </p>
                            </div>
                            <button
                                type="button"
                                class="text-primary underline cursor-pointer text-xs"
                                onClick={handleNeverShow}
                            >
                                Não quero ver esse cupom novamente
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </dialog>
    );
};

export default ModalCoupon;