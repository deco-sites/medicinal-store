import { useScript } from "@deco/deco/hooks";
import { useComponent } from "../Component.tsx";
import type { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";

const onLoad = () => {
    (document.querySelector("input[name='whatsapp']") as HTMLInputElement).oninput = (e) => {
        const target = e.currentTarget as HTMLInputElement;
        const value = target.value.replace(/\D/g, "");
        if (value.length > 10) {
            target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else {
            target.value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
    };

    (document.getElementById('file-selector-area') as HTMLDivElement).onclick = () => {
        document.getElementById('file-input')?.click();
    };

    (document.getElementById('file-input') as HTMLInputElement).onchange = (e) => {
        const fileNameDisplay = document.getElementById('selected-file-name');
        if (fileNameDisplay) {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = `Arquivo selecionado: ${e.target.files[0].name}`;
                fileNameDisplay.classList.remove('hidden');
            } else {
                fileNameDisplay.textContent = '';
                fileNameDisplay.classList.add('hidden');
            }
        }
    };
};

export default function Form({
    toast = null,
    message = "Formulario enviado com sucesso!",
}) {
    return (
        <div>
            <div class="container p-4 mx-auto w-full relative">
                {toast === "success" && (
                    <div class="toast toast-end">
                        <div class="alert alert-success text-white">
                            <span>{message}</span>
                        </div>
                    </div>
                )}

                {toast === "error" && (
                    <div class="toast toast-end">
                        <div class="alert alert-error text-white">
                            <span>{message}</span>
                        </div>
                    </div>
                )}

                <form
                    class="flex flex-col gap-4 border border-base-200 p-5 rounded-3xl"
                    hx-swap="outerHTML"
                    hx-post={useComponent(import.meta.url)}
                    hx-target="closest section"
                >
                    <div class="uppercase font-bold text-sm md:text-base">Envie sua receita</div>
                    <input
                        class="input input-bordered flex-grow text-sm w-full placeholder:text-accent"
                        type="text"
                        name="name"
                        placeholder="Nome*"
                        required
                    />
                    <input
                        class="input input-bordered flex-grow text-sm w-full placeholder:text-accent"
                        type="text"
                        name="lastName"
                        placeholder="Sobrenome*"
                        required
                    />
                    <input
                        class="input input-bordered flex-grow text-sm w-full placeholder:text-accent"
                        type="email"
                        name="email"
                        placeholder="Email*"
                        required
                    />
                    <input
                        class="input input-bordered flex-grow text-sm w-full placeholder:text-accent"
                        type="text"
                        name="whatsapp"
                        placeholder="WhatsApp*"
                        required
                    />
                    <div class="flex flex-col gap-2 items-center border border-base-200 rounded-2xl p-4 text-center cursor-pointer" id="file-selector-area">
                        <Icon id="file" size={54} class="text-base-200" />
                        <p class="text-black font-bold underline">Tire uma foto ou anexe sua receita</p>
                        <p class="text-xs text-gray-500">(Formatos: jpeg, png e pdf)</p>
                        <input
                            id="file-input"
                            name="prescription"
                            type="file"
                            class="hidden"
                            accept=".jpeg,.jpg,.png,.pdf"
                            required
                        />
                        <p id="selected-file-name" class="mt-2 text-sm text-gray-700 hidden"></p>
                    </div>
                    <select
                        name="type"
                        class="select select-bordered flex-grow text-sm w-full"
                        required
                    >
                        <option class="text-gray-400" value="">Prefere qual canal de resposta para seu orçamento?*</option>
                        <option value="Elogio">E-mail</option>
                        <option value="Sugestão">WhatsApp</option>
                    </select>
                    <textarea
                        class="textarea textarea-bordered rounded-2xl min-h-80 w-full placeholder:text-accent"
                        name="notes"
                        placeholder="Observações*"
                        required
                    />
                    <button
                        class="btn btn-primary w-full"
                        type="submit"
                    >
                        <span class="[.htmx-request_&]:hidden inline">Enviar</span>
                        <span class="[.htmx-request_&]:inline-block hidden loading loading-spinner" />
                    </button>
                </form>
                <script
                    type="text/javascript"
                    defer
                    dangerouslySetInnerHTML={{
                        __html: useScript(onLoad),
                    }}
                />
            </div>
        </div>
    );
}

export const action = async (
    _props: unknown,
    req: Request,
    ctx: AppContext,
) => {
    try {
        const platform = usePlatform();
        const formData = await req.formData() as FormData;
        if (platform === "vtex") {
            // deno-lint-ignore no-explicit-any
            await (ctx as any).invoke("vtex/actions/masterdata/createDocument.ts", {
                data: formData,
                acronym: "RM",
                isPrivateEntity: true
            });

            // import { FreshContext, Handlers } from '$fresh/server.ts'

            // export const handler: Handlers = {
            //     async POST(_req: Request, _ctx: FreshContext) {
            //         const params = new URLSearchParams(_req.url.split('?')[1])

            //         const acronym = params.get('acronym')
            //         const field = params.get('field')
            //         const id = params.get('id')

            //         const r = await fetch(
            //             `https://tfcucl.vtexcommercestable.com.br/api/dataentities/${acronym}/documents/${id}/${field}/attachments`,
            //             {
            //                 method: 'POST',
            //                 body: await _req.formData(),
            //             },
            //         )

            //         if (!r.ok) {
            //             return new Response(
            //                 JSON.stringify({
            //                     error: `${r.status} ${await r.text()}`,
            //                 }),
            //                 { status: 400 },
            //             )
            //         }

            //         return new Response(null, { status: 204 })
            //     },
            // }
        }
        return {
            toast: "success",
            message: "Menssagem enviada com sucesso!",
        };
    } catch {
        return {
            toast: "error",
            message: "Erro ao enviar a mensagem. Tente novamente mais tarde.",
        };
    }
};