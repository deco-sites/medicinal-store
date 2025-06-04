import Icon from "../ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";

import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

/** @titleBy name */
interface Leaf {
  name: string;
  href: string;
}

/** @titleBy name */
interface Children {
  name: string;
  href: string;
  children?: Leaf[];
}

/** @titleBy name */
export interface INavItem {
  name: string;
  href: string;
  isBold?: boolean;
  children?: Children[];
  mobileOnly?: boolean;
  isHighlighted?: boolean;
}

interface Props {
  item: INavItem;
}

function NavItem({ item }: Props) {
  const {
    name,
    href,
    isBold = false,
    children,
    mobileOnly = false,
    isHighlighted = false,
  } = item;

  if (!mobileOnly) {
    return (
      <li class="group flex items-center relative">
        <a
          href={href}
          class={clx(
            "py-2 text-sm flex items-center justify-between gap-4 border-2 cursor-pointer",
            isBold && "text-primary font-bold",
            isHighlighted && "px-4 rounded-full bg-primary text-white border-primary group-hover:bg-white group-hover:text-primary font-bold",
            !isHighlighted && "border-transparent"
          )}
        >
          {name}
          {children && children.length > 0 && (
            <Icon
              id="chevron-down"
              size={16}
              class="group-hover:rotate-180"
            />
          )}
        </a>

        {children && children.length > 0 &&
          (
            <div class="absolute top-0 left-0 pt-16">
              <div class="hidden group-hover:block z-40 gap-6 bg-white rounded-2xl shadow-lg w-full p-4 relative min-h-80">
                <ul class="p-0">
                  {href && (
                    <li class="hover:bg-base-200 rounded-full px-4 py-2 text-sm text-primary uppercase font-bold cursor-pointer min-w-60 max-w-60">
                      <a href={href}>Ver tudo</a>
                    </li>
                  )}
                  {children.map((node) => (
                    <>
                      <li class="group/leaf hover:bg-base-200 rounded-full px-4 py-2 text-sm cursor-pointer min-w-60 max-w-60">
                        <a href={node.href} class="flex items-center justify-between w-full">
                          {node.name}
                          {node.children && node.children?.length > 0 && (
                            <Icon
                              id="chevron-down"
                              size={16}
                              class="-rotate-90"
                            />
                          )}
                        </a>

                        {node.children && node.children?.length > 0 && (
                          <div class="hidden group-hover/leaf:block absolute top-0 left-[calc(100%-64px)] p-0 pl-16 !bg-transparent h-full">
                            <ul class="p-4 bg-white ml-2 rounded-2xl shadow-lg flex flex-col flex-wrap max-h-full h-full w-max">
                              {node.children?.map((leaf) => (
                                <li class="hover:bg-base-200 rounded-full px-4 py-2 text-sm cursor-pointer min-w-60 max-w-60">
                                  <a class="block" href={leaf.href}>
                                    {leaf.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            </div>
          )}
      </li>
    );
  }
}

export default NavItem;
