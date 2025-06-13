import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";

import { ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  title?: string;
  brands: Brand[];
}

/** @titleBy alt */
interface Brand {
  alt: string;
  link?: string;
  /** @description 80x80 */
  image: ImageWidget;
}

export default function Brands({
  title,
  brands = [],
}: Props) {
  return (
    <div class="container p-4 mx-auto w-full">
      {title && title !== "" && <Section.Header title={title} />}
      <div class="flex flex-wrap justify-center gap-4 w-full">
        {brands.map((item) => (
          <div class="min-w-20 h-20">
            <a href={item.link}>
              <Image
                src={item.image}
                alt={item.alt}
                width={80}
                height={80}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
