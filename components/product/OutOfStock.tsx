import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  productID: Product["productID"];
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const form = await req.formData();

  const name = `${form.get("name") ?? ""}`;
  const email = `${form.get("email") ?? ""}`;

  // deno-lint-ignore no-explicit-any
  const response = await (ctx as any)
    .invoke("vtex/actions/notifyme.ts", {
      skuId: props.productID,
      name,
      email,
    });

  return props;
};

export default function Notify({ productID }: Props) {
  return (
    <form
      class="form-control justify-start gap-2"
      hx-sync="this:replace"
      hx-indicator="this"
      hx-swap="none"
      hx-post={useComponent<Props>(import.meta.url, { productID })}
    >
      <div>
        <p class="text-base text-gray-400 font-bold">Indisponível no momento</p>
        <p class="text-sm text-gray-400">Avise-me quando estiver disponivel</p>
      </div>

      <input placeholder="Nome" class="input input-bordered text-sm" name="name" />
      <input placeholder="Email" class="input input-bordered text-sm" name="email" />

      <button class="btn btn-primary no-animation">
        <span class="[.htmx-request_&]:hidden inline">Enviar</span>
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
      </button>
    </form>
  );
}
