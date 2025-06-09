import { Suggestion } from "apps/commerce/types.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import ProductCard from "../../product/SuggestionsCard.tsx";
import { ACTION, NAME } from "./Form.tsx";
import { type Resolved } from "@deco/deco";
export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
}
export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;
  // @ts-ignore .
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};
export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const query = new URL(req.url).searchParams.get(NAME ?? "q");
  // @ts-ignore .
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};
export default function Suggestions(
  { suggestion }: ComponentProps<typeof loader, typeof action>,
) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products?.length);
  const hasTerms = Boolean(searches.length);
  return (<div class={clx(``, !hasProducts && !hasTerms && "flex")}>
    <div class="flex flex-col lg:grid grid-cols-4 gap-5 justify-center">
      {hasTerms && (<div class="flex flex-col col-span-1">
        <span class="font-extrabold text-sm uppercase text-primary pb-3" role="heading" aria-level={3}>
          Sugestões
        </span>
        <ul class="flex flex-col gap-3">
          {searches.map(({ term }) => (<li>
            <a href={`${ACTION}?${NAME}=${term}`}>
              <span class="text-dark-gray text-sm" dangerouslySetInnerHTML={{ __html: term }} />
            </a>
          </li>))}
        </ul>
      </div>)}
      <div class="flex flex-col pb-5 lg:pb-0 col-span-3 lg:inline-grid grid-cols-3 gap-3 mx-auto">
        {products && products.length > 0
          ? (<>
            {products.slice(0, 3).map((product, index) => (<div class="col-span-1">
              <ProductCard index={index} product={product} />
            </div>))}
          </>)
          : null}
      </div>
    </div>
  </div>);
}
