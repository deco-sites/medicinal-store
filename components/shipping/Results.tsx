/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ComponentProps } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "BRA",
    }) as SimulationOrderForm | null;

    return { result };
  } catch {
    return { result: null };
  }
}

export default function Results({ result }: ComponentProps<typeof action>) {
  const methods = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  if (!methods.length) {
    return <span class="text-red-700 text-sm font-semibold">CEP inválido</span>;
  }

  return (
    <ul class="flex flex-col gap-4">
      {methods
        .sort((a, b) => (a.price === 0 ? -1 : b.price === 0 ? 1 : 0))
        .map((method) => (
          <li class="flex items-center">
            <div class="text-xs text-dark-gray font-semibold flex-1 text-left">
              Entrega {method.name}
            </div>
            <div class="text-xs text-dark-gray font-semibold flex-1 text-center">
              até {formatShippingEstimate(method.shippingEstimate)}
            </div>
            <div
              class={`text-xs font-semibold flex-1 text-right ${
                method.price === 0 ? "text-green-500" : "text-dark-gray"
              }`}
            >
              {method.price === 0
                ? "Grátis"
                : formatPrice(method.price / 100, "BRL", "pt-BR")}
            </div>
          </li>
        ))}
      <span class="text-xs font-thin">
        Os prazos de entrega começam a contar a partir da confirmação do
        pagamento e podem variar de acordo com a quantidade de produtos no
        carrinho.
      </span>
    </ul>
  );
}
