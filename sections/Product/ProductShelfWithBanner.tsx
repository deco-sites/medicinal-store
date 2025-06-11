import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import type { Product } from "apps/commerce/types.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import type { LoadingFallbackProps } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";

export interface Banner {
  /** @description 640x400 */
  mobile: ImageWidget;
  /** @description 450x500 */
  desktop: ImageWidget;
  alt: string;
  href: string;
}

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  banner: Banner;
}

export default function ProductShelf({
  title,
  banner: {
    alt,
    href,
    mobile: mobileBanner,
    desktop: desktopBanner,
  },
  products,
}: Props) {
  const device = useDevice();

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

      <div class="grid grid-cols-1 sm:grid-cols-[450px_1fr_1fr] items-center gap-4 sm:gap-8">
        <a class="block px-4 lg:px-0" href={href}>
          <Image
            alt={alt}
            src={device === "mobile" ? mobileBanner : desktopBanner}
            class="rounded-2xl"
            width={device === "mobile" ? 640 : 450}
            height={device === "mobile" ? 400 : 500}
          />
        </a>

        <div class="lg:col-span-2">
          <ProductSlider products={products} itemListName={title} />
        </div>
      </div>
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
