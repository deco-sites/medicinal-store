import { useId } from "../../sdk/useId.ts";
import { Cluster } from "../../apps/site.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";


import ProductTitle from "../../components/product/ProductTitle.tsx";

import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ShippingSimulationForm from "../shipping/Form.tsx";
import Price from "../../sections/Product/Price.tsx";
import Highlights from "./Highlights.tsx";
import PurchaseOptions from "./PurchaseOptions.tsx";
import LeveJunto from "./LeveJunto.tsx";


interface Props {
  page: ProductDetailsPage | null;
  clusterDiscount: Cluster[];
  /** @title Produtos Relacionados */
  relatedProducts?: Product[] | null;
  /** @title Mostrar Leve Junto */
  showLeveJunto?: boolean;
  /** @hidden */
  quantity?: number;
  /** @hidden */
  isPartialUpdate?: boolean;
}

function ProductInfo(
  { page, clusterDiscount, relatedProducts, showLeveJunto = true, quantity = 1, isPartialUpdate = false }: Props,
) {
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

  const hasValidVariants = (isVariantOf?.hasVariant?.filter(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ).length ?? 0) > 1;

  return (
    <div {...viewItemEvent} class="flex flex-col gap-4 mt-4" id={id}>

      {hasValidVariants &&
        <ProductSelector product={product} />}
            {availability === "https://schema.org/InStock"
        ? (
          <div class={`flex flex-col lg:flex-row ${relatedProducts && relatedProducts.length > 0 ? 'gap-6' : ''} `}>
            <div id="product-info-content" class={`flex flex-col gap-4 mt-4 ${relatedProducts && relatedProducts.length > 0 ? '' : 'w-full'}`}>
              <ProductTitle page={page} />
              <Highlights product={product} />
              <div id="price-container">
                <Price
                  type="details"
                  product={product}
                  quantity={quantity}
                  clusterDiscount={clusterDiscount}
                />
              </div>
              <PurchaseOptions
                page={page}
                clusterDiscount={clusterDiscount}
                quantity={quantity}
              />
              <ShippingSimulationForm
                items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
              />

            </div>
            {relatedProducts && relatedProducts.length > 0 && showLeveJunto && !isPartialUpdate && (
              <div>
                <LeveJunto
                  products={relatedProducts || null}
                  showLeveJunto={showLeveJunto}
                  mainProduct={product}
                />
              </div>
            )}
          </div>

        )
        : <OutOfStock productID={productID} />}
    </div>
  );
}

export default ProductInfo;
