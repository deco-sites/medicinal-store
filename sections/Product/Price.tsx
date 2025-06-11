import { useOffer } from "../../sdk/useOffer.ts";
import { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
  type?: "shelf" | "details";
  product: Product;
}

export default function Price({
  type = "details",
  product,
}: Props) {
  const { offers } = product;

  if (!offers) return null;

  const {
    pix,
    price = 0,
    listPrice = 0,
    availability,
    installments,
  } = useOffer(offers);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;
  const hasPixDiscount = price > pix;

  if (type === "shelf") {
    return (
      <>
        {availability === "https://schema.org/InStock"
          ? (
            <div class="flex flex-col my-2">
              <div class="flex items-center gap-2">
                {listPrice > price &&
                  (
                    <span class="line-through font-normal text-gray-400 text-xs sm:text-sm">
                      {formatPrice(listPrice)}
                    </span>
                  )}
                <span class="font-bold text-base text-primary">
                  {hasPixDiscount ? formatPrice(pix) : formatPrice(price)}{" "}
                  {hasPixDiscount &&
                    (
                      <span class="text-base">
                        à vista
                      </span>
                    )}
                </span>
              </div>
              <span class="text-gray-400 text-xs sm:text-sm">
                {installments}
              </span>
            </div>
          )
          : (
            <p class="text-left font-bold text-gray-400">
              Produto Indisponível
            </p>
          )}
      </>
    );
  }

  if (type === "details") {
    return (
      <div>
        {listPrice > price &&
          (
            <span class="line-through text-sm text-gray-400">
              {formatPrice(listPrice)}
            </span>
          )}
        {hasPixDiscount
          ? (
            <p class="text-3xl font-semibold text-primary">
              {formatPrice(pix)}
              <span class="text-primary font-normal text-lg ml-2">
                à vista
              </span>
            </p>
          )
          : (
            <div class="flex gap-2 items-center">
              <span class="text-3xl font-semibold text-primary">
                {formatPrice(price)}
              </span>
              {percent >= 1 && (
                <div class="text-xs font-semibold text-white uppercase bg-primary text-center px-2 py-1 rounded-full w-fit">
                  {percent} % off
                </div>
              )}
            </div>
          )}
        <p class="text-gray-400 text-sm">{installments}</p>
      </div>
    );
  }

  return null;
}
