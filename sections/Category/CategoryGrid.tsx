import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import Icon from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";
/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label: string;
}
export interface Props extends SectionHeaderProps {
  items: Item[];
}
function Card({ image, href, label }: Item) {
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-4">
      <div class="w-44 h-44 rounded-full bg-white flex justify-center items-center border border-base-200 hover:border-primary">
        <Image
          src={image}
          alt={label}
          width={100}
          height={100}
          loading="lazy"
        />
      </div>
      <span class="font-medium text-sm">{label}</span>
    </a>
  );
}
function CategoryGrid({ title, items }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class="w-full container px-0 py-4 lg:p-4 mx-auto"
    >
      {title && <Section.Header title={title} />}

      <div className="relative px-0 lg:px-16">
        <Slider class="carousel carousel-center gap-4 sm:gap-6 w-full">
          {items.map((i, index) => (
            <Slider.Item
              index={index}
              class={clx(
                "carousel-item",
                "first:pl-4 first:sm:pl-0",
                "last:pr-4 last:sm:pr-0",
              )}
            >
              <Card {...i} />
            </Slider.Item>
          ))}
        </Slider>

        <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 left-0">
          <Slider.PrevButton
            class="hidden sm:flex disabled:invisible btn btn-outline btn-circle text-black hover:text-black no-animation border-0 bg-white hover:bg-white shadow-lg"
            disabled={false}
          >
            <Icon id="chevron-right" size={24} class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 right-0">
          <Slider.NextButton
            class="hidden sm:flex disabled:invisible btn btn-outline btn-circle text-black hover:text-black no-animation border-0 bg-white hover:bg-white shadow-lg"
            disabled={false}
          >
            <Icon id="chevron-right" size={24} />
          </Slider.NextButton>
        </div>

        <Slider.JS rootId={id} />
      </div>
    </div>
  );
}
export const LoadingFallback = (
  { title }: LoadingFallbackProps<Props>,
) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="212px" />;
  </Section.Container>
);
export default CategoryGrid;
