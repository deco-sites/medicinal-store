import Icon from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { AppContext } from "apps/vtex/mod.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { SectionProps } from "@deco/deco";

// @ts-ignore .
const onLoad = (id) => {
  const modal = document.getElementById(id);
  // @ts-ignore .
  modal?.showModal();
};

export async function action(_props: unknown, req: Request, ctx: AppContext) {
  try {
    const platform = usePlatform();
    const form = await req.formData();

    const name = `${form.get("name") ?? ""}`;
    const email = `${form.get("email") ?? ""}`;

    const lastName = name.split(" ")[1] || "";
    const firstName = name.split(" ")[0] || "";

    if (platform === "vtex") {
      // deno-lint-ignore no-explicit-any
      await (ctx as any).invoke("vtex/actions/masterdata/createDocument.ts", {
        acronym: "CL",
        data: JSON.stringify({
          firstName,
          lastName,
          email,
          isNewsletterOptIn: true,
        }),
        isPrivateEntity: true,
      });
    }

    return { status: "success" };
  } catch {
    return { status: "failed" };
  }
}

export default function Results({ status }: SectionProps<typeof action>) {
  const id = useId();

  if (status === "failed") {
    return (
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
            __html: useScript(onLoad, id),
          }}
        />
      </>
    );
  }

  if (status === "success") {
    return (
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
            __html: useScript(onLoad, id),
          }}
        />
      </>
    );
  }

  return null;
}
