import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 100;
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");
  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);
  }
};
function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;
  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      data-item-id={(item as any).item_id}
      class="flex items-center gap-4"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={image}
        style={{ aspectRatio: "1 / 1" }}
        width={100}
        height={100}
        class="h-full object-contain rounded-xl"
      />
      <div class="flex flex-col gap-4 w-full">
        <div class="flex justify-between items-start">
          <legend class="text-sm text-ellipsis font-bold line-clamp-2 h-10">
            {name}
          </legend>
          <button
            class={clx(
              isGift && "hidden",
              "btn btn-sm btn-ghost btn-circle",
            )}
            hx-on:click={useScript(removeItemHandler)}
          >
            <Icon id="trash" size={20} />
          </button>
        </div>
        <div class="flex justify-between gap-4">
          <div class={clx(isGift && "hidden")}>
            <QuantitySelector
              min={0}
              max={QUANTITY_MAX_VALUE}
              value={quantity}
              name={`item::${index}`}
            />
          </div>
          <div class="flex items-center gap-2">
            {price > listPrice && (
              <span class="line-through text-sm">
                {formatPrice(listPrice, currency, locale)}
              </span>
            )}
            <span class="text-sm text-primary font-bold">
              {isGift ? "Grátis" : formatPrice(price, currency, locale)}
            </span>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
export default CartItem;
