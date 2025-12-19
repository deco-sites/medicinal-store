import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: ImageWidget;

  /** @description mobile otimized image */
  mobile: ImageWidget;

  /** @description Image's alt text */
  alt: string;

  /** @description when user clicks on the image, go to this link */
  href: string;
}

export interface Props {
  images?: Banner[];

  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem(
  { image, lcp }: { image: Banner; lcp?: boolean },
) {
  const {
    alt,
    mobile,
    desktop,
    href,
  } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      {...selectPromotionEvent}
      href={href ?? "#"}
      class="relative block overflow-y-hidden w-full"
    >
      <Picture preload={lcp} {...viewPromotionEvent}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={412}
          height={660}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1440}
          height={600}
        />
        <img
          class="object-cover w-full h-full rounded-2xl"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
          title={alt}
        />
      </Picture>
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class="w-full container p-4 mx-auto"
    >
      <div class="relative">
        <Slider class="carousel carousel-center w-full gap-6 rounded-2xl">
          {images.map((image, index) => (
            <Slider.Item index={index} class="carousel-item w-full">
              <BannerItem image={image} lcp={index === 0 && preload} />
            </Slider.Item>
          ))}
        </Slider>

        <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 left-0 mx-4">
          <Slider.PrevButton
            class="hidden sm:flex disabled:invisible btn btn-outline text-black hover:text-black btn-circle no-animation border-0 bg-white hover:bg-white shadow-lg"
            disabled={false}
          >
            <Icon id="chevron-right" size={24} class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 right-0 mx-4">
          <Slider.NextButton
            class="hidden sm:flex disabled:invisible btn btn-outline text-black hover:text-black btn-circle no-animation border-0 bg-white hover:bg-white shadow-lg"
            disabled={false}
          >
            <Icon id="chevron-right" size={24} />
          </Slider.NextButton>
        </div>

        <ul class="flex items-center justify-center w-full gap-3 mt-2">
          {images.map((_, index) => (
            <li class="carousel-item">
              <Slider.Dot
                index={index}
                class="bg-base-200 h-2 w-2 no-animation rounded-full disabled:bg-primary"
              />
            </li>
          ))}
        </ul>
      </div>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
