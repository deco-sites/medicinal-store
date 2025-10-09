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

  return (
    <div id="purchase-options" class="max-w-md">
      <div
        class="flex flex-col gap-2"
        style={{ margin: 0 }}
      >
        {discountsOnCluster.map((discount, index) => {
          const isSelected = quantity === discount.quantity;
          return (
            <button
              key={index}
              class="w-full rounded-full bg-white border border-primary text-primary p-2 flex gap-2 cursor-pointer"
              hx-post={useSection({
                props: {
                  only_purchase_options: true,
                  quantity: isSelected ? undefined : discount.quantity, // desmarca se já está selecionado
                },
              })}
              hx-swap="outerHTML"
              hx-target="#purchase-options"
              type="button"
            >
              <input
                type="checkbox"
                name="quantity"
                value={discount.quantity}
                class="checkbox checkbox-primary pointer-events-none"
                checked={isSelected}
                readOnly
              />
              <span>
                <span>
                  {discount.quantity}{" "}
                  {discount.quantity > 1 ? "unidades " : "unidade "}
                </span>
                <b>por {formatPrice(price * (1 - discount.discount / 100))}</b>
                {discount.quantity > 1 && <span>cada</span>}
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
