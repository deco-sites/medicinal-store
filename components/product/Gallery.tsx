import Image from "apps/website/components/Image.tsx";
import Slider from "../ui/Slider.tsx";

import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 600;
const HEIGHT = 600;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const { page: { product: { name, isVariantOf, image: pImages } } } = props;

  const groupImages = isVariantOf?.image ?? pImages ?? [];
  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );
  const images = filtered.length > 0 ? filtered : groupImages;

  return (
    <div
      id={id}
      class="flex flex-col w-full gap-5 max-w-[600px] mx-auto"
    >
      <div class="relative h-min flex-grow">
        <Slider class="carousel carousel-center gap-6 w-full">
          {images.map((img, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-full"
            >
              <Image
                class="w-full"
                sizes="(max-width: 640px) 100vw, 40vw"
                style={{ aspectRatio: ASPECT_RATIO }}
                src={img.url!}
                alt={img.alternateName}
                width={WIDTH}
                height={HEIGHT}
                // Preload LCP image for better web vitals
                preload={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      {images.length > 1 && (
        <ul class="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <li class="h-24">
              <Slider.Dot index={index} class="w-full">
                <Image
                  style={{ aspectRatio: "1 / 1" }}
                  class="border border-base-200 group-disabled:border-primary rounded-2xl object-cover w-full h-full max-h-24"
                  width={64}
                  height={64}
                  src={img.url!}
                  alt={img.alternateName}
                />
              </Slider.Dot>
            </li>
          ))}
        </ul>
      )}

      <Slider.JS rootId={id} />
    </div>
  );
}
