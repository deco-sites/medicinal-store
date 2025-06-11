import Image from "apps/website/components/Image.tsx";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";

/**
 * @titleBy text
 */
export interface Benefit {
  /** @description 80x80 */
  icon: ImageWidget;
  text: string;
}

export interface BenefitsType {
  title?: RichText;
  benefits: Benefit[];
}

export default function Benefits({
  title = "Benefícios",
  benefits = [
    {
      icon:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/4232/b6b56684-9e26-4280-aab8-e403c28dd229",
      text:
        "Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit.",
    },
    {
      icon:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/4232/1b9160f6-359c-4db7-aec3-38cd90c952d8",
      text:
        "Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit.",
    },
    {
      icon:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/4232/1447a4af-bff0-4129-bae3-bbef83c72b74",
      text:
        "Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit.",
    },
    {
      icon:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/4232/5eef14d7-2499-43c9-88b3-e2afc3374604",
      text:
        "Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit.",
    },
  ],
}: BenefitsType) {
  const device = useDevice();
  const isMobile = device === "mobile";

  return (
    <div class="w-full container px-0 sm:px-4 mx-auto my-6">
      {title && (
        <h2
          class="custom-category-title text-center mb-4 px-4 sm:px-0"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      <ul class="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {benefits.map(({ icon, text }, index) => (
          <li
            data-item={index}
            class="w-60 sm:w-80 h-auto flex flex-none items-center gap-6 bg-ice px-4 py-3 rounded-lg text-sm lg:text-base first:ml-4 sm:first:ml-0 last:mr-4 sm:last:mr-0"
          >
            <Image
              alt="Icon"
              src={icon}
              class="shrink-0"
              width={isMobile ? 48 : 80}
              height={isMobile ? 48 : 80}
              loading="lazy"
              fetchPriority="low"
            />
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
