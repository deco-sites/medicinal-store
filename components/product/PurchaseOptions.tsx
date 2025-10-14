import { Cluster } from "../../apps/site.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import AddToCartButton from "./AddToCartButton.tsx";
import { useSection } from "@deco/deco/hooks";

interface Props {
  page: ProductDetailsPage;
  quantity?: number;
  clusterDiscount: Cluster[];
}

export default function ({
  page,
  quantity = 1,
  clusterDiscount,
}: Props) {
  const { product, breadcrumbList } = page;
  const { additionalProperty = [], offers } = product;
  const { price = 0, listPrice, seller = "1" } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const discountsOnCluster =
    clusterDiscount.filter((cluster) =>
      additionalProperty.some(
        (prop) => prop.propertyID === cluster.clusterId,
      )
    )[0]?.discounts.filter((discount) => discount.quantity > 1) || [];

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  if (discountsOnCluster.length === 0) {
    return (
      <AddToCartButton
        type="productPage"
        item={item}
        seller={seller}
        product={product}
        class="btn btn-primary no-animation max-w-md"
        disabled={false}
      />
    );
  }

  // Criar array com opção de 1 unidade + descontos
  const allOptions = [
    { quantity: 1, discount: 0 }, // Opção padrão de 1 unidade
    ...discountsOnCluster
  ];

  return (
    <div id="purchase-options" class="max-w-md">
      <div
        class="flex flex-col gap-2"
        style={{ margin: 0 }}
      >
        {allOptions.map((discount, index) => {
          const isSelected = quantity === discount.quantity;
          const maxDiscount = discountsOnCluster.reduce((max, current) => {
            return current.discount > max.discount ? current : max;
          }, { discount: 0 });
          const isBestDiscount = discount.discount === maxDiscount.discount && maxDiscount.discount > 0 && discount.quantity > 1;
          return (
            <button
              key={index}
              class={`relative w-full rounded-full bg-white border text-primary p-2 flex gap-2 cursor-pointer items-center ${
                isSelected ? 'border-primary bg-primary/10' : 'border-primary'
              }`}
              hx-post={useSection({
                props: {
                  only_price_update: true,
                  quantity: isSelected ? 1 : discount.quantity,
                },
              })}
              hx-swap="innerHTML"
              hx-target="#product-info-content"
              hx-trigger="click"
              type="button"
            >
              {isBestDiscount && (
                <div 
                  class="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 h-full flex items-center "
                  style={{ borderRadius: "8px 20px 20px 8px" }}
                >
                  MAIOR DESCONTO
                </div>
              )}
              <input
                type="checkbox"
                name="quantity"
                value={discount.quantity}
                class="checkbox checkbox-primary pointer-events-none"
                checked={isSelected}
                readOnly
              />
              <span class="text-xs lg:text-sm flex items-center gap-1 leading-auto">
                <span>
                  {discount.quantity}{" "}
                  {discount.quantity > 1 ? "unidades " : "unidade "}
                </span>
                {discount.quantity === 1 ? (
                  <b>{formatPrice(price)}</b>
                ) : (
                  <b>por {formatPrice(price * (1 - discount.discount / 100))} cada</b>
                )}
                {discount.discount > 0 && (
                  <span class="ml-1">
                    ({discount.discount}% OFF)
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <AddToCartButton
        type="shelf"
        item={item}
        class="btn no-animation w-full mt-2 bg-white text-primary hover:text-white bg-primary border-primary"
        seller={seller}
        product={product}
        quantity={quantity}
        disabled={false}
      />
    </div>
  );
}
