import Icon from "../../components/ui/Icon.tsx";
import Image from "apps/website/components/Image.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";

type ImageType = 'rounded-full' | 'rounded';
type AlignCards = 'start' | 'center';

/** @titleBy title */
interface CardProps {
    /** @description 220x120 ou 100x100 */
    image: ImageWidget;
    title?: string;
    text: RichText;
}

interface Props {
    title?: RichText;
    cards: CardProps[];
    imageType: ImageType;
    alignCards: AlignCards;
}

function Card({
    image,
    imageType,
    title,
    text,
    alignCards
}: CardProps & { imageType: ImageType, alignCards: AlignCards }) {
    return (
        <div class="card bg-base-100 w-full shadow-sm border border-base-200">
            <div class="px-8 pt-8 flex items-center justify-center">
                <Image
                    src={image}
                    class={clx(
                        'object-cover object-center',
                        imageType === 'rounded' && 'rounded-xl w-full h-[120px]',
                        imageType === 'rounded-full' && 'rounded-full w-[100px] h-[100px]',
                    )}
                    width={imageType === 'rounded-full' ? 100 : 220}
                    height={imageType === 'rounded-full' ? 100 : 120}
                />
            </div>
            <div
                class={clx(
                    'card-body',
                    alignCards === 'center' && 'text-center items-center'
                )}
            >
                {title && <h2 class="card-title">{title}</h2>}
                <div
                    class='text-sm md:text-base'
                    dangerouslySetInnerHTML={{
                        __html: text
                    }}
                />
            </div>
        </div>
    );
}

export default function ({
    title = "",
    cards = [],
    imageType = 'rounded',
    alignCards = 'start'
}: Props) {
    const id = useId();
    const device = useDevice();

    return (
        <div class="md:container py-4 md:px-4 md:mx-auto w-full">
            {title && title !== '' && (
                <div class="flex flex-col items-center w-full gap-4">
                    <div class="w-20 h-[3px] bg-primary" />
                    <div
                        class="font-bold text-lg md:text-2xl mb-4 text-center uppercase max-w-72 mx-auto"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                </div>
            )}
            {device === 'mobile' ? (
                <div class="flex overflow-x-auto gap-4">
                    {cards.map((card) => (
                        <div class="first:ml-4 last:mr-4 min-w-72">
                            <Card {...card} imageType={imageType} alignCards={alignCards} />
                        </div>
                    ))}
                </div>
            ) : (
                <div id={id}>
                    <div class="relative">
                        <Slider class="carousel carousel-center gap-6 w-full">
                            {cards.map((card, index) => (
                                <Slider.Item
                                    index={index}
                                    class="carousel-item w-72"
                                >
                                    <Card {...card} imageType={imageType} alignCards={alignCards} />
                                </Slider.Item>
                            ))}
                        </Slider>
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
                    <Slider.JS rootId={id} />
                </div>
            )}
        </div>
    );
}