import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";

import { useOffer } from "../../sdk/useOffer.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

interface Props {
    page: ProductDetailsPage | null;
}

export default function ProductTitle({ page }: Props) {
    if (page === null) {
        throw new Error("Missing Product Details Page Info");
    }

    const { breadcrumbList, product } = page;
    const { isVariantOf, offers, additionalProperty } = product;
    const title = isVariantOf?.name ?? product.name;

    const breadcrumb = {
        ...breadcrumbList,
        itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
        numberOfItems: breadcrumbList.numberOfItems - 1,
    };

    const {
        price = 0,
        listPrice,
    } = useOffer(offers);

    const item = mapProductToAnalyticsItem({
        product,
        breadcrumbList: breadcrumb,
        price,
        listPrice,
    });

    const refId = additionalProperty?.find((p) => {
        return p.name === "RefId";
    })?.value;

    return (
        <div class="flex flex-col gap-2">
            <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
            <div class="flex items-center justify-between">
                <h1 class="text-xl lg:text-3xl font-semibold">
                    {title}
                </h1>
                <WishlistButton item={item} variant="icon" />
            </div>
            {refId && (
                <p class="text-sm font-medium text-gray-400 uppercase">Ref: {refId}</p>
            )}
        </div>
    );
}