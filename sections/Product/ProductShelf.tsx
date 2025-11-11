import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import type { AppContext } from "../../apps/site.ts";
import type { ProductFlag } from "../../components/product/ProductCard.tsx";


export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  productFlags?: ProductFlag[];
}
export const loader = (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const {
    productFlags = [],
  } = ctx;

  return { ...props, productFlags };
};

export default function ProductShelf({ products, title, productFlags }: Props) {

  if (!products || products.length === 0) {
    return null;
  }
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...(useOffer(product.offers)),
          })
        ),
      },
    },
  });

  return (
    <div
      {...viewItemListEvent}
      class="w-full container p-0 py-4 lg:p-4 mx-auto"
    >
      <Section.Header title={title} />

      <ProductSlider productFlags={productFlags} products={products} itemListName={title} />
    </div>
  );
}
export const LoadingFallback = (
  { title }: LoadingFallbackProps<Props>,
) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="471px" />;
  </Section.Container>
);
