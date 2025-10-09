import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import Price from "../../sections/Product/Price.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;

  /** @description if true, shows "Recomendado" badge */
  isRecommended?: boolean;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
  isRecommended,
}: Props) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */}
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  return (
    <div
      {...event}
      class={clx("card card-compact group text-sm", _class)}
    >
      <figure
        class={clx(
          "relative bg-base-200",
          "rounded border border-transparent",
          "group-hover:border-primary",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
               {isRecommended && (
              <span class="text-xs font-bold border border-white text-white bg-orange-500 text-center rounded-badge px-3 py-1 uppercase absolute bottom-1 right-1">
                Recomendado
              </span>
            )}
        </a>

        <div class="absolute top-1 left-1 w-full flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <span
              class={clx(
                "text-xs font-bold text-white bg-primary text-center rounded-badge px-3 py-1 uppercase",
                (percent <= 0) && "opacity-0",
              )}
            >
              {percent}% off
            </span>
       
          </div>
        </div>

        <div class="absolute top-0 right-0 m-2">
          <WishlistButton item={item} variant="icon" />
        </div>
      </figure>

      <a href={relativeUrl} class="pt-5">
        <span class="text-sm text-ellipsis font-bold line-clamp-2 h-10">
          {title}
        </span>

        <Price
          type="shelf"
          product={product}
        />
      </a>

      <div class="flex-grow" />

      <div>
        {inStock && (
          <AddToCartButton
            product={product}
            seller={seller}
            item={item}
            class="btn btn-sm sm:btn-md border-primary text-primary bg-white hover:border-primary disabled:bg-white disabled:border-base-300 disabled:text-base-300"
            
          />
        )}
      </div>
    </div>
  );
}

export default ProductCard;
