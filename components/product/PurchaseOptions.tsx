import { Cluster } from "../../apps/site.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import AddToCartButton from "./AddToCartButton.tsx";

interface Props {
  page: ProductDetailsPage;
  clusterDiscount: Cluster[];
}

export default function ({
  page,
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
    )[0]?.discounts || [];

  if (discountsOnCluster.length === 0) {
    return null;
  }

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  return (
    <div class="flex gap-2 flex-wrap">
      {discountsOnCluster.map((discount, index) => (
        <div
          key={index}
          class="card w-40 bg-white border border-primary text-primary p-4 flex flex-col gap-2"
        >
          <span class="badge border-primary bg-primary text-white">
            {`${discount.discount}%`}
          </span>
          <div>
            <h2 class="text-xl font-bold text-black">
              {`${discount.quantity} ${
                discount.quantity > 1 ? "unidades" : "unidade"
              }`}
            </h2>
            <span class="text-base text-black">
              {formatPrice(price * (1 - discount.discount / 100))} / cada
            </span>
          </div>
          <AddToCartButton
            type="shelf"
            item={item}
            class="btn bg-white border-primary text-primary hover:bg-primary hover:text-white hover:border-primary"
            seller={seller}
            product={product}
            quantity={discount.quantity}
            hideIcon={true}
            disabled={false}
          />
        </div>
      ))}
    </div>
  );
}
