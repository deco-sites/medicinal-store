import Icon from "../ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { relative } from "../../sdk/url.ts";
import { useSection } from "@deco/deco/hooks";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";

import type { Product } from "apps/commerce/types.ts";

interface Props {
  product: Product;
}

function VariantSelector({ product }: Props) {
  const id = useId();

  const { url, isVariantOf } = product;
  const relativeUrl = relative(url);

  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const filteredNames = Object.keys(possibilities).filter((name) =>
    name.toLowerCase() !== "title" && name.toLowerCase() !== "default title"
  );

  if (filteredNames.length === 0) {
    return null;
  }

  return (
    <ul
      class="flex flex-col gap-4"
      hx-target="closest section"
      hx-swap="outerHTML"
      hx-sync="this:replace"
    >
      {filteredNames.map((name) => (
        <li class="flex flex-col gap-2">
          <span class="uppercase font-bold">{name}</span>
          <ul class="flex flex-row flex-wrap gap-2">
            {Object.entries(possibilities[name])
              .filter(([value]) => value)
              .map(([value, link]) => {
                const relativeLink = relative(link);
                const checked = relativeLink === relativeUrl;
                return (
                  <li>
                    <label
                      class="cursor-pointer"
                      hx-get={useSection({ href: relativeLink })}
                    >
                      <input
                        class="hidden peer"
                        type="radio"
                        name={`${id}-${name}`}
                        checked={checked}
                      />
                      <div
                        class={clx(
                          "flex items-center justify-center gap-1",
                          "text-sm text-center py-1 px-3",
                          "rounded-full border-2 border-base-200 text-base-200",
                          checked &&
                            "border-primary bg-white text-primary font-semibold",
                        )}
                      >
                        {checked && (
                          <Icon
                            id="check"
                            size={16}
                            class="text-primary -mt-[1px]"
                          />
                        )}
                        <span>{value}</span>
                      </div>
                    </label>
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default VariantSelector;
