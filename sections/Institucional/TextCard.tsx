import Image from "apps/website/components/Image.tsx";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

interface Props {
    title?: {
        /** @description 40x40 */
        icon?: ImageWidget;
        text: string;
    };
    text: RichText;
}

export default function ({
    title,
    text = ""
}: Props) {
    return (
        <div class="container mx-auto px-4 py-2 w-full">
            <div class="rounded-2xl border border-base-200 p-8 lg:p-10 w-full">
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
                        <h2 class="text-sm lg:text-base font-bold uppercase">{title.text}</h2>
                    </div>
                )}
                <div
                    class="fluid-text w-full"
                    dangerouslySetInnerHTML={{
                        __html: text
                    }}
                />
            </div>
        </div>
    );
}