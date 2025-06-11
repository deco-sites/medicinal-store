import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import type { INavItem } from "./NavItem.tsx";
import SignIn from "./SignIn.tsx";

export interface Props {
  navItems?: INavItem[];
}

function MenuItem({ item }: { item: INavItem }) {
  const {
    isBold = false,
    children = [],
    isHighlighted = false,
  } = item;

  const itemClass = clx(
    "text-sm border-2 border-transparent",
    isBold && "text-primary font-bold",
    isHighlighted &&
      "px-4 rounded-full bg-primary text-white !border-primary active:!bg-white active:!text-primary focus-visible:!bg-white focus-visible:!text-primary font-bold group-open:!text-primary group-open:!bg-white",
    !isHighlighted &&
      "active:!bg-transparent active:!text-primary focus-visible:!bg-transparent focus-visible:!text-primary",
  );

  if (!children || children.length === 0) {
    return (
      <li class="!bg-transparent">
        <a
          href={item.href}
          class={itemClass}
        >
          {item.name}
        </a>
      </li>
    );
  }

  return (
    <li>
      <details class="group">
        <summary class={itemClass}>{item.name}</summary>
        <ul class="before:w-[0] p-0">
          {item.href && (
            <li class="!bg-transparent text-primary font-bold uppercase">
              <a href={item.href}>Ver tudo</a>
            </li>
          )}
          {children.map((sub) => {
            if (!sub.children || sub.children.length === 0) {
              return (
                <li class="!bg-transparent text-base-300">
                  <a href={item.href}>{item.name}</a>
                </li>
              );
            }

            return (
              <li>
                <details>
                  <summary class="!bg-transparent text-base-300">
                    {sub.name}
                  </summary>
                  <ul class="before:w-[0] p-0">
                    {sub.children.map((leaf) => {
                      return (
                        <li class="!bg-transparent text-base-300">
                          <a href={leaf.href}>{leaf.name}</a>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </details>
    </li>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "90vw" }}
    >
      <ul class="p-4">
        <li class="flex items-center justify-between px-4 py-2 bg-base-200 rounded-full">
          <SignIn />
          <Icon id="chevron-down" size={16} class="-rotate-90" />
        </li>
      </ul>
      <ul class="menu rounded-box py-0 px-4">
        {navItems.map((item) => <MenuItem item={item} />)}
      </ul>
    </div>
  );
}

export default Menu;
