import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { useComponent } from "../../sections/Component.tsx";

import type { SKU } from "apps/vtex/utils/types.ts";

export interface Props {
  items: SKU[];
}

const onLoad = () => {
  const postalCodeInput = document.getElementById(
    "postal_code",
  ) as HTMLInputElement;
  postalCodeInput.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    let value = target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5, 8);
    }
    value = value.slice(0, 9);
    target.value = value;
  };
};

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <span class="uppercase font-bold text-sm">
            Calcule o frete
          </span>
        </div>
        <form
          class="relative join border border-base-200 w-fit"
          hx-target={`#${slot}`}
          hx-swap="innerHTML"
          hx-sync="this:replace"
          hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
            items,
          })}
        >
          <input
            as="input"
            type="text"
            class="input w-48 text-sm"
            placeholder="Informe o CEP"
            name="postalCode"
            maxLength={9}
          />
          <button type="submit" class="btn btn-primary no-animation -ml-10">
            <span class="[.htmx-request_&]:hidden inline text-sm">
              Calcular
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
          </button>
        </form>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php?t"
          class="text-sm underline w-fit"
          target="_blank"
        >
          Descobrir meu CEP
        </a>
      </div>
      <div id={slot} />
      <script
        type="text/javascript"
        defer
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad),
        }}
      />
    </>
  );
}
