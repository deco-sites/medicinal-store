import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

interface Props {
    background?: {
        image: ImageWidget;
        position: 'center' | 'left' | 'right';
    };
    title: string;
    subTitle: string;
    text: RichText;
}

export default function ({
    background,
    title = ""
}: Props) {

    if (background) {
        const {
            image = '',
            position = 'center'
        } = background;

        return (
            <div class="mt-8 mb-4 container px-4 mx-auto w-full">
                <div
                    class="rounded-2xl py-16"
                    style={{
                        backgroundSize: 'cover',
                        backgroundImage: `url(${image})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${position} center`,
                    }}
                >
                    <h1 class="text-2xl lg:text-4xl uppercase font-bold text-white text-center">{title}</h1>
                </div>
            </div>
        );
    }

    return (
        <div class="container px-4 mx-auto w-full">
            <h1 class="mt-8 mb-4 text-4xl uppercase font-bold">{title}</h1>
        </div>
    )
}