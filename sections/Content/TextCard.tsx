import Image from "apps/website/components/Image.tsx";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { clx } from "../../sdk/clx.ts";

interface Props {
  title?: {
    /** @description 40x40 */
    icon?: ImageWidget;
    text: string;
  };
  text: RichText;
  padding?: "none" | "default";
}

export default function ({
  text = "",
  title,
  padding = "default",
}: Props) {
  return (
    <div class="container mx-auto px-4 py-2 w-full">
      <div
        class={clx(
          "w-full",
          padding === "default" &&
            "p-8 lg:p-10 border border-base-200 rounded-2xl",
        )}
      >
        {title && (
          <div class="flex items-center w-full gap-2">
            {title.icon && (
              <Image
                src={title.icon}
                alt={title.text}
                width={40}
                height={40}
              />
            )}
            <h2 class="text-sm lg:text-base font-bold uppercase">
              {title.text}
            </h2>
          </div>
        )}
        <div
          class="fluid-text w-full"
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </div>
    </div>
  );
}
