import { useOffer } from "../../sdk/useOffer.ts";
import { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { Cluster } from "../../apps/site.ts";

interface Props {
  type?: "shelf" | "details";
  product: Product;
  quantity?: number;
  clusterDiscount?: Cluster[];
}

export default function Price({
  type = "details",
  product,
  quantity = 1,
  clusterDiscount = [],
}: Props) {
  const { offers, additionalProperty = [] } = product;

  if (!offers) return null;

  const {
    pix,
    price = 0,
    listPrice = 0,
    availability,
    installments,
  } = useOffer(offers);

  const discountsOnCluster =
    clusterDiscount.filter((cluster) =>
      additionalProperty.some(
        (prop) => prop.propertyID === cluster.clusterId,
      )
    )[0]?.discounts.filter((discount) => discount.quantity > 1) || [];

  const selectedDiscount = discountsOnCluster.find(
    (discount) => discount.quantity === quantity
  );

  const finalPrice = selectedDiscount
    ? price * (1 - selectedDiscount.discount / 100)
    : price;

  const finalPix = selectedDiscount
    ? pix * (1 - selectedDiscount.discount / 100)
    : pix;

  // Calcular preço total quando quantidade > 1
  const totalPrice = finalPrice * quantity;
  const totalPix = finalPix * quantity;
  const totalListPrice = listPrice * quantity;

  const percent = listPrice && finalPrice
    ? Math.round(((listPrice - finalPrice) / listPrice) * 100)
    : 0;
  const hasPixDiscount = finalPrice > finalPix;

  // Calcular installments baseado no preço final e quantidade
  const calculateInstallments = (basePrice: number, baseQuantity: number) => {
    if (!installments) return "";
    
    // Extrair número de parcelas e valor original dos installments
    const installmentMatch = installments.match(/(\d+)x.*?(\d+[\.,]\d+)/);
    if (!installmentMatch) return installments;
    
    const parcelas = parseInt(installmentMatch[1]);
    const finalTotalPrice = basePrice * baseQuantity;
    const valorParcela = finalTotalPrice / parcelas;
    
    return `${parcelas}x de ${formatPrice(valorParcela)} sem juros`;
  };
  
  const updatedInstallments = calculateInstallments(finalPrice, quantity);

  if (type === "buy-together") {
    return (
      <>
        {availability === "https://schema.org/InStock"
          ? (
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-2">
                {listPrice > finalPrice &&
                  (
                    <span class="line-through font-normal text-gray-400 text-xs sm:text-sm">
                      {formatPrice(listPrice)}
                    </span>
                  )}
                <span class="font-bold text-base text-primary">
                  {hasPixDiscount ? formatPrice(finalPix) : formatPrice(finalPrice)}{" "}
                  {hasPixDiscount &&
                    (
                      <span class="text-base">
                        à vista
                      </span>
                    )}
                </span>
              </div>
              <span class="text-gray-400 text-xs sm:text-sm">
                {updatedInstallments}
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

  if (type === "shelf") {
    return (
      <>
        {availability === "https://schema.org/InStock"
          ? (
            <div class="flex flex-col my-2">
              <div class="flex items-center gap-2">
                {listPrice > finalPrice &&
                  (
                    <span class="line-through font-normal text-gray-400 text-xs sm:text-sm">
                      {formatPrice(listPrice)}
                    </span>
                  )}
                <span class="font-bold text-base text-primary">
                  {hasPixDiscount ? formatPrice(finalPix) : formatPrice(finalPrice)}{" "}
                  {hasPixDiscount &&
                    (
                      <span class="text-base">
                        à vista
                      </span>
                    )}
                </span>
              </div>
              <span class="text-gray-400 text-xs sm:text-sm">
                {updatedInstallments}
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
    // Determinar se deve mostrar preço total ou unitário
    const shouldShowTotal = quantity > 1;
    const displayPrice = shouldShowTotal ? totalPrice : finalPrice;
    const displayPix = shouldShowTotal ? totalPix : finalPix;
    const displayListPrice = shouldShowTotal ? totalListPrice : listPrice;

    return (
      <div>
        {displayListPrice > displayPrice &&
          (
            <span class="line-through text-sm text-gray-400">
              {formatPrice(displayListPrice)}
              {shouldShowTotal && (
                <span class="text-xs ml-1">
                  ({quantity} unidades)
                </span>
              )}
            </span>
          )}
        {hasPixDiscount
          ? (
            <p class="text-3xl font-semibold text-primary">
              {formatPrice(displayPix)}
              <span class="text-primary font-normal text-lg ml-2">
                à vista
              </span>
            </p>
          )
          : (
            <div class="flex gap-2 items-center">
              <div class="flex flex-col">
                <span class="text-3xl font-semibold text-primary flex items-center gap-1 lg:gap-2 ">
                  {formatPrice(displayPrice)}
                  {percent >= 1 && (
                    <div class="text-xs font-semibold text-white uppercase bg-primary text-center px-2 py-1 rounded-full w-fit">
                      {percent} % off
                    </div>
                  )}
                </span>
                {selectedDiscount && quantity > 1 && (
                  <p class="text-sm text-green-600 font-medium m-0" >
                    Nessa compra você economiza: {formatPrice((price * quantity) - (finalPrice * quantity))}
                  </p>
                )}
              </div>

            </div>
          )}

        <p class="text-gray-400 text-sm">{updatedInstallments}</p>
      </div>
    );
  }

  return null;
}
