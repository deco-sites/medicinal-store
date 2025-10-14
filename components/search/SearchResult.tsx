import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { renderSection } from "apps/website/pages/Page.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";

import Sort from "./Sort.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Drawer from "../ui/Drawer.tsx";
import Filters from "../../components/search/Filters.tsx";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import ProductCard from "../../components/product/ProductCard.tsx";

import type { Section } from "@deco/deco/blocks";
import type { SectionProps } from "@deco/deco";
import type { ProductListingPage } from "apps/commerce/types.ts";

export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}

/**
 * @titleBy matcher
 */
interface DescriptionSections {
  /**
   * @description Ex: /produtos
   */
  matcher: string;
  sections: Section[];
}

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";
  sections?: DescriptionSections[];
  /** @title Exibir Filtros */
  showFilters?: boolean;
  /** @title Filtros Permitidos */
  allowedFilters?: string[];
}

function NotFound() {
  return (
    <div class="w-full py-10 flex flex-col gap-6 items-center">
      <p class="text-2xl text-base-200 text-center px-4 font-bold">
        Página Indisponível
      </p>
      <h1 class="text-lg text-center px-4 font-bold">
        A página que você tentou acessar está indisponível.
      </h1>
      <p class="text-primary text-center px-4 font-bold">
        Que tal fazer uma nova busca?
      </p>
    </div>
  );
}

function EmptySearch() {
  return (
    <div class="w-full py-10 flex flex-col gap-6 items-center">
      <Icon id="search" size={100} class="text-base-200" />
      <h1 class="text-2xl text-center px-4 font-bold">
        Não encontramos a sua pesquisa.
      </h1>
      <p class="text-primary text-center px-4 font-bold">
        Que tal fazer uma nova busca?
      </p>
    </div>
  );
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";
  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center gap-6">
      <div
        class={clx(
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-primary"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            Mostrar anteriores
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "sm:grid-cols-4 sm:gap-4",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full min-w-[160px] max-w-[300px]"
            isRecommended={index < 6}
          />
        ))}
      </div>

      <div>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-primary",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Mostrar mais
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const {
    startingPage = 0,
    url,
    partial,
    descriptionSections,
    showFilters = true,
    allowedFilters,
  } = props;
  console.log("SearchResult allowedFilters:", allowedFilters);
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...(useOffer(product.offers)),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });

  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-4 sm:gap-8 w-full px-4 py-6 sm:py-10">
              {breadcrumb?.itemListElement?.length > 0 && (
                <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
              )}

              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl font-semibold uppercase leading-none">
                    {breadcrumb?.itemListElement?.length > 0
                      ? breadcrumb.itemListElement[0].name
                      : "Resultado da busca"}
                  </h1>
                  {`(${pageInfo?.records ?? pageInfo?.recordPerPage})`}
                </div>
                {device !== "mobile" && (
                  <div>
                    {sortBy}
                  </div>
                )}
              </div>

              {device === "mobile" && showFilters && (
                <Drawer
                  id={controls}
                  aside={
                    <div
                      class="bg-base-100 flex flex-col h-full rounded-r-2xl w-full"
                      style={{
                        maxWidth: "90vw",
                      }}
                    >
                      <div class="flex justify-between items-center">
                        <label class="btn btn-ghost" for={controls}>
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <Filters
                          filters={filters}
                          allowedFilters={allowedFilters}
                        />
                      </div>
                    </div>
                  }
                >
                  <div class="flex items-center justify-between">
                    <label
                      class="btn btn-ghost btn-sm bg-ice flex items-center gap-1"
                      for={controls}
                    >
                      <Icon
                        id="menu"
                        width={20}
                        height={19}
                        class="-mt-[1px]"
                      />
                      Filters
                    </label>
                    <div class="w-full max-w-32">
                      {sortBy}
                    </div>
                  </div>
                </Drawer>
              )}

              <div
                class={clx(
                  "grid grid-cols-1",
                  showFilters && device === "desktop" &&
                    "sm:grid-cols-[350px_1fr]",
                )}
              >
                {device === "desktop" && showFilters && (
                  <aside>
                    <Filters
                      filters={filters}
                      allowedFilters={allowedFilters}
                    />
                  </aside>
                )}

                <PageResult {...props} />
              </div>
            </div>
          )}
        <div>
          {descriptionSections?.sections?.map(renderSection)}
        </div>
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }

  if (page.products.length === 0) {
    return <EmptySearch />;
  }

  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  const descriptionSections = props.sections?.find((section) => {
    if (req.url.indexOf(section.matcher) !== -1) {
      return section.sections;
    }
  })?.sections || [];

  // Ensure default sort is "orders:desc" (mais vendidos) if not specified
  const url = new URL(req.url);
  if (!url.searchParams.has("sort")) {
    url.searchParams.set("sort", "orders:desc");
  }

  return {
    ...props,
    url: url.href,
    descriptionSections,
  };
};

export default SearchResult;
