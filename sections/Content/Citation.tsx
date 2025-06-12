import Image from "apps/website/components/Image.tsx";

import { clx } from "../../sdk/clx.ts";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";

interface Props {
    /** @description 200x200 */
    image: ImageWidget;
    cardText: RichText;
    title?: string;
    text: RichText;
}

export default function ({
    image,
    cardText,
    title,
    text,
}: Props) {
    return (
        <div class="container mx-auto p-4 w-full">
            <div class={clx(
                "grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-center",
                "rounded-2xl border border-base-200 px-8 py-4 lg:p-10 w-full"
            )}>
                <div class="flex flex-col items-center order-2 md:order-1">
                    <Image
                        src={image}
                        width={200}
                        height={200}
                        class="rounded-2xl shadow-sm"
                    />
                    <div
                        class="fluid-text text-center"
                        dangerouslySetInnerHTML={{
                            __html: cardText
                        }}
                    />
                </div>
                <div class="order-1 md:order-2">
                    <div class="max-w-3xl">
                        {title && title !== '' && (
                            <div class="text-primary text-base md:text-2xl font-bold my-4 text-center md:text-start">
                                {title}
                            </div>
                        )}
                        <div
                            class="fluid-text text-center md:text-start"
                            dangerouslySetInnerHTML={{
                                __html: text
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}