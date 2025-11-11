import type { Product, PropertyValue } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import Price from "../../sections/Product/Price.tsx";
import Flag from "../ui/Flag.tsx";
import { ImageWidget, Color } from "apps/admin/widgets.ts";

/**
 * @titleBy text
 */
export interface ProductFlag {
  /**
   * @title Cor do texto
   */
  textColor: Color;
  /**
   * @title Texto da Flag
   * @description Aponte o ID da coleção desejada
   */
  text: string;
  /**
   * @title Cor de fundo da Flag
   */
  backgroundColor: Color;
  /**
   * @title ID da coleção do produto
   * @description Aponte o ID da coleção desejada
   */
  collectionID: string;
  /**
   * @title Imagem de background da Flag
   */
  backgroundImage?: ImageWidget;
}

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;

  productFlags?: ProductFlag[];
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export const getFlagCluster = (
  flag: string,
  additionalProperty?: PropertyValue[],
) => {
  const propertie = additionalProperty?.find((prop) => {
    if (prop.name === "cluster") {
      return prop.propertyID === flag;
    }
  });
  return propertie;
};

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
  productFlags = [],
}: Props) {
  const { url, image: images, offers, isVariantOf, additionalProperty } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */ }
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

  const propertyIDs = additionalProperty?.map((prop) => prop.propertyID);

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
          {/* Renderizar flags personalizadas */}
          <div class="absolute bottom-1 right-1 flex flex-col gap-[2px]">
            {productFlags.map((flag, flagIndex) => {
              // Renderizar flag apenas se:
              // 1. O produto tem a propriedade correspondente OU
              // 2. A flag não tem collectionID definido (flag global)
              const shouldRenderFlag = 
                !flag.collectionID || 
                flag.collectionID === "" ||
                propertyIDs?.includes(flag.collectionID);
              
              return (
                <div key={flagIndex}>
                  {shouldRenderFlag && <Flag {...flag} />}
                </div>
              );
            })}
          </div>
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
