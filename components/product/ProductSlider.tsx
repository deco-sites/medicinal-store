import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSlider({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div id={id}>
        <div className="relative">
          <div>
            <Slider class="carousel carousel-center sm:carousel-end gap-2 sm:gap-4 w-full">
              {products?.map((product, index) => (
                <Slider.Item
                  index={index}
                  class={clx(
                    "carousel-item",
                    "first:pl-4 first:sm:pl-0",
                    "last:pr-4 last:sm:pr-0",
                  )}
                >
                  <ProductCard
                    index={index}
                    product={product}
                    itemListName={itemListName}
                    class="w-[287px] sm:w-[300px]"
                    isRecommended={index < 3}
                  />
                </Slider.Item>
              ))}
            </Slider>
          </div>

          <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 left-0 mx-4">
            <Slider.PrevButton class="hidden sm:flex disabled:invisible btn btn-outline text-black hover:text-black btn-circle no-animation border-0 bg-white hover:bg-white shadow-lg">
              <Icon id="chevron-right" size={24} class="rotate-180" />
            </Slider.PrevButton>
          </div>

          <div class="hidden sm:flex items-center justify-center z-10 absolute top-1/2 -translate-y-1/2 right-0 mx-4">
            <Slider.NextButton class="hidden sm:flex disabled:invisible btn btn-outline text-black hover:text-black btn-circle no-animation border-0 bg-white hover:bg-white shadow-lg">
              <Icon id="chevron-right" size={24} />
            </Slider.NextButton>
          </div>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
