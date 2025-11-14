import Price from "../../sections/Product/Price.tsx";
import Image from "apps/website/components/Image.tsx";
import ProductCard from "./ProductCard.tsx";

import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useScript } from "@deco/deco/hooks";
import { formatPrice } from "../../sdk/format.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  page: ProductDetailsPage;
  products: Product[];
}

const onClick = () => {
    const container = document.getElementById("buy-together") as HTMLDivElement;
    if (container) {
        const items: unknown[] = [];
        const platform: Record<string, unknown> = {};
        platform.orderItems = [];
        platform.allowedOutdatedData = ["paymentData"];
        const productCards = container.querySelectorAll("div[data-item-id]");
        console.log('productCards', productCards);
        productCards.forEach((card) => {
            if (card.querySelector("input")?.checked) {
                const { item, platformProps } = JSON.parse(
                    decodeURIComponent(card.getAttribute("data-cart-item")!),
                );
                items.push(item);
                (platform.orderItems as unknown[]).push(platformProps.orderItems[0]);
            }
        });
        window.STOREFRONT.CART.addToCart(items as never, platform as never);
        setTimeout(() => {
            const minicartDrawer = document.querySelector(
                "label[for=minicart-drawer]",
            );
            if (minicartDrawer) {
                // @ts-ignore click is correct
                minicartDrawer.click();
            }
        }, 500);
    }
};

const onChange = () => {
    const container = document.getElementById("buy-together") as HTMLDivElement;
    if (container) {
        let pix = 0;
        let price = 0;
        const productCards = container.querySelectorAll("div[data-item-id]");
        productCards.forEach((card) => {
            if (card.querySelector("input")?.checked) {
                const { item } = JSON.parse(
                    decodeURIComponent(card.getAttribute("data-cart-item")!),
                );

                const pixPrice = parseFloat(
                    card.getAttribute("data-pix") || "0",
                );

                pix += pixPrice;
                price += item.price;
            }
        });
        const pixContainer = document.querySelector("#pix-price");
        if (pixContainer) {
            pixContainer.innerHTML = pix.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        }
        const priceContainer = document.querySelector("#total-price");
        if (priceContainer) {
            priceContainer.innerHTML = price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        }
        const addToCartCount = document.querySelector("#add-to-cart-count");
        if (addToCartCount) {
            addToCartCount.innerHTML = container.querySelectorAll(
                "div[data-item-id] input:checked",
            ).length.toString();
        }
    }
};

const onLoad = () => {
    window.STOREFRONT.CART.subscribe(() => {
        const container = document.getElementById("buy-together") as HTMLDivElement;
        if (container) {
            let pix = 0;
            let price = 0;
            const productCards = container.querySelectorAll("div[data-item-id]");
            productCards.forEach((card) => {
                if (card.querySelector("input")?.checked) {
                    const { item } = JSON.parse(
                        decodeURIComponent(card.getAttribute("data-cart-item")!),
                    );

                    const pixPrice = parseFloat(
                        card.getAttribute("data-pix") || "0",
                    );

                    pix += pixPrice;
                    price += item.price;
                }
            });
            const pixContainer = document.querySelector("#pix-price");
            if (pixContainer) {
                if (price > pix) {
                    pixContainer.innerHTML = pix.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });
                } else {
                    pixContainer.parentElement?.classList.add("hidden");
                }
            }
            const priceContainer = document.querySelector("#total-price");
            if (priceContainer) {
                priceContainer.innerHTML = price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            }
            const addToCartCount = document.querySelector("#add-to-cart-count");
            if (addToCartCount) {
                addToCartCount.innerHTML = container.querySelectorAll(
                    "div[data-item-id] input:checked",
                ).length.toString();
            }
            container?.querySelectorAll<HTMLButtonElement>("input").forEach((node) => {
                if (node.id !== 'mainProduct') {
                    node.checked = false;
                    node.disabled = false;
                }
            });
        }
    });
};

function Item({ 
    product,
    breadcrumb,
    inactive = false
}) {
    const { url, image: images, offers, isVariantOf } = product;
    const title = isVariantOf?.name ?? product.name;
    const [front] = images ?? [];
    const relativeUrl = relative(url);

    const { 
        pix = 0,
        price = 0, 
        listPrice = 0, 
        availability, 
        seller = "1", 
        installments = [] 
    } = useOffer(offers);

    const inStock = availability === "https://schema.org/InStock";
    const hasDiscount = listPrice > price;

    const item = mapProductToAnalyticsItem({
        price,
        product,
        listPrice,
        breadcrumbList: breadcrumb,
    });
    
    const percent = listPrice && price
        ? Math.round(((listPrice - price) / listPrice) * 100)
        : 0;

    return (
        <div
            class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
            data-pix={pix}
            data-item-id={product.productID}
            data-cart-item={encodeURIComponent(
                JSON.stringify({
                    item,
                    platformProps: {
                        allowedOutdatedData: ["paymentData"],
                        orderItems: [{
                            quantity: 1,
                            seller: seller,
                            id: product.productID,
                        }],
                    },
                }),
            )}
        >
            <div class="form-control">
                <label class="label cursor-pointer p-0">
                    <input
                        id={inactive ? 'mainProduct' : 'relatedProduct'}
                        type="checkbox"
                        class="checkbox checkbox-primary"
                        checked={inactive}
                        disabled={inactive}
                        hx-on:change={useScript(onChange)}
                    />  
                </label>
            </div>
            <div class="flex items-center gap-2 flex-1">
                <a href={relativeUrl} class="flex-shrink-0">
                    <Image
                        src={front?.url.replace("-55-55", "-80-80") || ""}
                        alt={front?.alternateName || title}
                        width={80}
                        height={80}
                        class="rounded object-cover"
                        style={{ aspectRatio: "1/1" }}
                    />
                </a>
                <div class="flex-1 flex flex-col gap-2 items-start">
                    {percent > 0 &&
                        <span class="text-xs font-bold text-white bg-primary text-center rounded-badge px-3 py-1 uppercase">
                        {percent}% off
                        </span>
                    }
                    <a href={relativeUrl}>
                        <h4 class="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary">
                            {title}
                        </h4>
                    </a>
                    <Price
                        type="buy-together"
                        product={product}
                    />
                </div>
            </div>
        </div>
    );
}

export default function BuyTogether({
  page,
  products,
}: Props) {
    const { breadcrumbList, product } = page;

    const breadcrumb = {
        ...breadcrumbList,
        itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
        numberOfItems: breadcrumbList.numberOfItems - 1,
    };

    const recommendations = products.filter((p) => {
        return product.productID !== p.productID;
    });

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <>
            <div
                id="buy-together"
                class="flex flex-col w-full max-w-md bg-gray-50 rounded-lg border border-gray-200 p-4 gap-4"
            >
                <h3 class="text-lg font-bold text-gray-800 uppercase">
                    Leve Junto
                </h3>
                <div class="flex flex-col gap-2">
                    <Item product={product} breadcrumb={breadcrumb} inactive={true} />
                    <p class="text-primary text-3xl font-bold text-center">+</p>
                    {recommendations.splice(0, 3).map(
                        (p: Product, index: number, arr: Product[]) => {
                            return <Item product={p} breadcrumb={breadcrumb} />
                        }
                    )}
                </div>
                <div class="border-b border-gray-200" />
                <div class="flex flex-col gap-4 items-center justify-center px-6">
                    <div class="text-primary font-normal text-[30px]">
                        <span
                            id="pix-price"
                            class="text-[40px] font-semibold text-primary"
                        >
                            R$ 0
                        </span>{" "}
                        no Pix
                    </div>
                    <div class="text-base">
                        Preço Total:{" "}
                        <span id="total-price" class="text-xl font-semibold">
                            R$ 0
                        </span>
                    </div>
                    <button
                        class="btn btn-primary px-4 uppercase text-sm w-full"
                        hx-on:click={useScript(onClick)}
                    >
                        Comprar itens selecionados
                    </button>
                </div>
            </div>
        
            <script
                type="module"
                dangerouslySetInnerHTML={{
                    __html: useScript(onLoad),
                }}
            />
        </>
    );
}