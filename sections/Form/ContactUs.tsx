import { useScript } from "@deco/deco/hooks";
import { useComponent } from "../Component.tsx";
import type { AppContext } from "../../apps/site.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";

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
