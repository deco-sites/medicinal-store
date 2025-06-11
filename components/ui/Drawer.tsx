import { type ComponentChildren } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "./Icon.tsx";
import { useDevice, useScript } from "@deco/deco/hooks";
export interface Props {
  open?: boolean;
  class?: string;
  children?: ComponentChildren;
  aside: ComponentChildren;
  id?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.checked = false;
  };
  addEventListener("keydown", handler);
};
function Drawer(
  { children, aside, open, class: _class = "", id = useId() }: Props,
) {
  return (
    <>
      <div class={clx("drawer", _class)}>
        <input
          id={id}
          name={id}
          checked={open}
          type="checkbox"
          class="drawer-toggle"
          aria-label={open ? "open drawer" : "closed drawer"}
        />

        <div class="drawer-content">
          {children}
        </div>

        <aside
          data-aside
          class={clx(
            "drawer-side h-full z-40 overflow-hidden",
            "[[data-aside]&_section]:contents",
          )}
        >
          <label for={id} class="drawer-overlay" />
          {aside}
        </aside>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}
function Aside({ title = "menu", drawer, children }: {
  title?: "cart" | "menu";
  drawer: string;
  children: ComponentChildren;
}) {
  const device = useDevice();

  return (
    <div
      data-aside
      class="w-full bg-base-100 grid grid-rows-[auto_1fr] h-full rounded-l-2xl overflow-hidden"
      style={{ maxWidth: device === "mobile" ? "90vw" : "425px" }}
    >
      {title === "menu" && (
        <div class="flex items-center justify-end">
          <label for={drawer} aria-label="X" class="btn btn-ghost">
            <Icon id="close" />
          </label>
        </div>
      )}
      {title === "cart" && (
        <div class="flex items-center justify-between pl-4 border-b border-base-200 font-bold text-sm sm:text-base">
          <span class="flex items-center gap-2 uppercase">
            <Icon id="shopping_bag" />
            Carrinho
          </span>
          <label for={drawer} aria-label="X" class="btn btn-ghost">
            <Icon id="close" />
          </label>
        </div>
      )}
      {children}
    </div>
  );
}
Drawer.Aside = Aside;
export default Drawer;
