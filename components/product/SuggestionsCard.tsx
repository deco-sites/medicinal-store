import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import Price from "../../sections/Product/Price.tsx";
import Image from "apps/website/components/Image.tsx";

import type { Product } from "apps/commerce/types.ts";

interface Props {
    product: Product;
    index: number;
}

const WIDTH = 200;
const HEIGHT = 200;
const ASPECT_RATIO = `1/1`;

export default function ProductSuggestionsCard({
    product,
    index,
}: Props) {
    const { url, image: images, offers, isVariantOf } = product;
    const title = isVariantOf?.name ?? product.name;
    const [front] = images ?? [];

    const { listPrice, price } =
        useOffer(offers);
    const relativeUrl = relative(url);

    const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

    const event = useSendEvent({
        on: "click",
        event: {
            name: "select_item" as const,
            params: {
                item_list_name: "product-suggestions",
                items: [item],
            },
        },
    });

    return (
        <div
            {...event}
            class="inline-grid lg:block grid-cols-3 items-center gap-4 bg-white p-0 rounded-lg"
        >
            <div class="col-span-1 lg:mb-4">
                <a href={relativeUrl} aria-label="view product">
                    <Image
                        src={front.url!.replace('-25-25', `-${WIDTH}-${HEIGHT}`)}
                        alt={front.alternateName}
                        class="lg:w-full"
                        style={{ aspectRatio: ASPECT_RATIO }}
                        width={WIDTH}
                        height={HEIGHT}
                        loading="eager"
                        decoding="async"
                    />
                </a>
            </div>
            <div class="col-span-2">
                <a href={relativeUrl} class="flex flex-col gap-4">
                    <span class="text-sm text-ellipsis font-bold line-clamp-2 h-10">
                        {title}
                    </span>
                    <Price type="shelf" product={product} />
                </a>
            </div>
        </div>
    );
}