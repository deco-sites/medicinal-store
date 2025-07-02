import { useId } from "../../sdk/useId.ts";
import { Cluster } from "../../apps/site.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import OutOfStock from "./OutOfStock.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ShippingSimulationForm from "../shipping/Form.tsx";
import Price from "../../sections/Product/Price.tsx";
import Highlights from "./Highlights.tsx";
import PurchaseOptions from "./PurchaseOptions.tsx";

interface Props {
  page: ProductDetailsPage | null;
  clusterDiscount: Cluster[];
}

function ProductInfo({ page, clusterDiscount }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;

  const {
    price = 0,
    listPrice,
    seller = "1",
    availability,
  } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  return (
    <div {...viewItemEvent} class="flex flex-col gap-4 mt-4" id={id}>
      {hasValidVariants && <ProductSelector product={product} />}
      {availability === "https://schema.org/InStock"
        ? (
          <>
            <Highlights product={product} />
            <Price
              type="details"
              product={product}
            />
            <AddToCartButton
              type="productPage"
              item={item}
              seller={seller}
              product={product}
              class="btn btn-primary no-animation max-w-md"
              disabled={false}
            />
            <PurchaseOptions
              page={page}
              clusterDiscount={clusterDiscount}
            />
            <ShippingSimulationForm
              items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
            />
          </>
        )
        : <OutOfStock productID={productID} />}
    </div>
  );
}

export default ProductInfo;
