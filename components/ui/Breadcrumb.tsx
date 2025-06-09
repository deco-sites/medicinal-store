import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";
import Icon from "./Icon.tsx";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <div class="py-0 text-xs font-normal text-base-400">
      <ul class="flex items-center flex-wrap gap-1">
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }) => {
            if (name === 'Home') {
              return (
                <li class="flex items-center gap-1 after:content-['/']">
                  <a href={relative(item)}>
                    <Icon id="home" size={16} />
                  </a>
                </li>
              )
            }
            return (
              <li class="flex items-center gap-1 after:content-['/'] last:after:content-[''] last:text-gray-500">
                <a href={relative(item)}>{name}</a>
              </li>
            )
          })}
      </ul>
    </div>
  );
}

export default Breadcrumb;
