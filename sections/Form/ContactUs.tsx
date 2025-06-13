import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../Component.tsx";

import Icon from "../../components/ui/Icon.tsx";

import type { AppContext } from "../../apps/site.ts";

const onLoad = () => {
  (document.querySelector("input[name='phone']") as HTMLInputElement).oninput =
    (e) => {
      const target = e.currentTarget as HTMLInputElement;
      const value = target.value.replace(/\D/g, "");
      if (value.length > 10) {
        target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else {
        target.value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
    };
};

// @ts-ignore .
const loadModal = (id) => {
  const modal = document.getElementById(id);
  // @ts-ignore .
  modal?.showModal();
};

export default function Form({
  status = null,
}) {
  const id = useId();

  return (
    <div class="container p-4 mx-auto w-full relative">
      {status === "success" && (
        <>
          <dialog id={id} class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 class="flex items-center gap-1 text-lg font-bold">
                <Icon id="check-success" class="text-green-600" />
                Inscrição realizada com sucesso!
              </h3>
              <p class="text-start">
                Em breve enviaremos novidades na sua caixa de entrada!
              </p>
              <div class="modal-action">
                <form method="dialog">
                  <button class="btn btn-primary">
                    Ok
                  </button>
                </form>
              </div>
            </div>
          </dialog>
          <script
            type="text/javascript"
            defer
            dangerouslySetInnerHTML={{
              __html: useScript(loadModal, id),
            }}
          />
        </>
      )}

      {status === "failed" && (
        <>
          <dialog id={id} class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 class="flex items-center gap-1 text-lg font-bold">
                <Icon id="check-error" class="text-red-700" />
                Houve um problema.
              </h3>
              <p class="text-start">Por favor, tente mais tarde.</p>
            </div>
          </dialog>
          <script
            type="text/javascript"
            defer
            dangerouslySetInnerHTML={{
              __html: useScript(loadModal, id),
            }}
          />
        </>
      )}

      <form
        class="flex flex-col gap-4 border border-base-200 p-5 rounded-3xl"
        hx-swap="outerHTML"
        hx-post={useComponent(import.meta.url)}
        hx-target="closest section"
      >
        <div class="uppercase font-bold text-sm md:text-base">
          Envie sua mensagem
        </div>
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
          name="phone"
          placeholder="Celular*"
          required
        />
        <select
          name="type"
          class="select select-bordered flex-grow text-sm w-full"
          required
        >
          <option class="text-gray-400" value="">Tipo*</option>
          <option value="Elogio">Elogio</option>
          <option value="Sugestão">Sugestão</option>
          <option value="Dúvida">Dúvida</option>
          <option value="Reclamação">Reclamação</option>
        </select>
        <textarea
          class="textarea textarea-bordered rounded-2xl min-h-80 w-full placeholder:text-accent"
          name="description"
          placeholder="Qual sua dúvida?*"
          required
        />
        <label class="label gap-2 text-sm justify-start p-0">
          <input
            required
            name=""
            type="checkbox"
            class="checkbox checkbox-primary"
          />
          <span>
            Estou de acordo com a{" "}
            <a
              class="inline font-bold underline"
              target="_blank"
              href="/politicas-de-privacidade"
            >
              política de privacidade
            </a>{" "}
            da Medicinal.
          </span>
        </label>
        <label class="label gap-2 text-sm justify-start p-0">
          <input
            name="whatsAppNews"
            type="checkbox"
            class="checkbox checkbox-primary"
          />
          Quero receber novidades e ofertas por WhatsApp.
        </label>
        <label class="label gap-2 text-sm justify-start p-0">
          <input
            name="emailNews"
            type="checkbox"
            class="checkbox checkbox-primary"
          />
          Quero receber novidades e ofertas por E-mail.
        </label>
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
    // @ts-ignore .
    const data = Object.fromEntries(formData);
    data.emailNews = data.emailNews === "on";
    data.whatsAppNews = data.whatsAppNews === "on";
    if (platform === "vtex") {
      // deno-lint-ignore no-explicit-any
      await (ctx as any).invoke("vtex/actions/masterdata/createDocument.ts", {
        acronym: "CO",
        data: JSON.stringify(data),
      });
    }

    return { status: "success" };
  } catch {
    return { status: "failed" };
  }
};
