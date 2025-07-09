import { useScript } from "@deco/deco/hooks";
import { useComponent } from "../Component.tsx";
import type { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useId } from "../../sdk/useId.ts";

const onLoad = () => {
  (document.querySelector("input[name='whatsapp']") as HTMLInputElement)
    .oninput = (e) => {
      const target = e.currentTarget as HTMLInputElement;
      const value = target.value.replace(/\D/g, "");
      if (value.length > 10) {
        target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else {
        target.value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
    };

  (document.getElementById("file-selector-area") as HTMLDivElement).onclick =
    () => {
      document.getElementById("file-input")?.click();
    };

  (document.getElementById("file-input") as HTMLInputElement).onchange = (
    e,
  ) => {
    const fileNameDisplay = document.getElementById("selected-file-name");
    if (fileNameDisplay) {
      if (e.target.files.length > 0) {
        fileNameDisplay.textContent = `Arquivo selecionado: ${e.target.files[0].name
          }`;
        fileNameDisplay.classList.remove("hidden");
      } else {
        fileNameDisplay.textContent = "";
        fileNameDisplay.classList.add("hidden");
      }
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
        hx-encoding='multipart/form-data'
      >
        <div class="uppercase font-bold text-sm md:text-base">
          Envie sua receita
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
          name="whatsapp"
          placeholder="WhatsApp*"
          required
        />
        <div
          class="flex flex-col gap-2 items-center border border-base-200 rounded-2xl p-4 text-center cursor-pointer"
          id="file-selector-area"
        >
          <Icon id="file" size={54} class="text-base-200" />
          <p class="text-black font-bold underline">
            Tire uma foto ou anexe sua receita
          </p>
          <p class="text-xs text-gray-500">(Formatos: jpeg, png e pdf)</p>
          <input
            id="file-input"
            name="prescription"
            type="file"
            class="hidden"
            accept=".jpeg,.jpg,.png,.pdf"
            required
          />
          <p
            id="selected-file-name"
            class="mt-2 text-sm text-gray-700 hidden"
          >
          </p>
        </div>
        <select
          name="channel"
          class="select select-bordered flex-grow text-sm w-full"
          required
        >
          <option class="text-gray-400" value="">
            Prefere qual canal de resposta para seu orçamento?*
          </option>
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
  );
}

export const action = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
) => {
  try {
    const acronym = "RM";
    const platform = usePlatform();
    const formData = await req.formData() as FormData;

    // Create a new FormData object to hold the data
    const data = {
      name: formData.get("name") as string || "",
      email: formData.get("email") as string || "",
      notes: formData.get("notes") as string || "",
      channel: formData.get("channel") as string || "",
      // lastName: formData.get("lastName") as string || "",
      whatsapp: formData.get("whatsapp") as string || "",
    };

    if (platform === "vtex") {
      // deno-lint-ignore no-explicit-any
      const response = await (ctx as any).invoke("vtex/actions/masterdata/createDocument.ts", {
        data,
        acronym,
      });

      const responseAttachment = await fetch(
        `https://medicinalnaweb.vtexcommercestable.com.br/api/dataentities/${acronym}/documents/${response.DocumentId}/prescription/attachments`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
          },
          body: formData,
        },
      );

      if (!responseAttachment.ok) {
        const text = await responseAttachment.text();
        throw new Error(text);
      }
    }
  } catch (error) {
    console.error(error);
    return { status: "failed" };
  }
  return { status: "success" };
};
