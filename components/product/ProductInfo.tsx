import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import OutOfStock from "./OutOfStock.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ShippingSimulationForm from "../shipping/Form.tsx";
import Price from "../../sections/Product/Price.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
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
    installments
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

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
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
