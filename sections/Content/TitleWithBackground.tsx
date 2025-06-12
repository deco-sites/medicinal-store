import { clx } from "../../sdk/clx.ts";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

interface Props {
    isFullWidth?: boolean;
    background?: {
        image: ImageWidget;
        position: 'center' | 'left' | 'right';
    };
    supTitle?: string;
    title: string;
    subTitle?: RichText;
    textAlign?: 'center' | 'left';
    textUppercase?: boolean;
}

export default function ({
    title = "",
    subTitle = "",
    supTitle = "",
    background,
    textAlign = 'center',
    isFullWidth = false,
    textUppercase = false,
}: Props) {

    if (background) {
        const {
            image = '',
            position = 'center'
        } = background;

        return (
            <div
                class={clx(
                    "mb-4 w-full",
                    isFullWidth === false && "mt-6 container px-4 mx-auto"
                )}
            >
                <div
                    class={clx(
                        'py-16',
                        isFullWidth ?
                            'rounded-b-3xl' :
                            'rounded-3xl',
                    )}
                    style={{
                        backgroundSize: 'cover',
                        backgroundImage: `url(${image})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${position} center`,
                    }}
                >
                    <div
                        class={clx(
                            'w-full',
                            isFullWidth ?
                                'container px-4 mx-auto' :
                                'px-12'
                        )}
                    >
                        <div
                            class={clx(
                                'w-full',
                                textAlign === 'center' && 'mx-auto max-w-3xl',
                                textAlign === 'left' && 'mr-auto max-w-lg',
                            )}
                        >
                            {supTitle && supTitle !== '' && (
                                <div
                                    class={clx(
                                        "my-3 text-sm lg:text-base text-white",
                                        textAlign === 'center' && 'text-center',
                                        textAlign === 'left' && 'text-start',
                                        textUppercase && 'uppercase'
                                    )}
                                    dangerouslySetInnerHTML={{
                                        __html: supTitle
                                    }}
                                />
                            )}
                            <h1 class={clx(
                                "text-2xl lg:text-4xl font-bold text-white",
                                textAlign === 'center' && 'text-center',
                                textAlign === 'left' && 'text-start',
                                textUppercase && 'uppercase'
                            )}>
                                {title}
                            </h1>
                            {subTitle && subTitle !== '' && (
                                <div
                                    class={clx(
                                        "fluid-text text-white",
                                        textAlign === 'center' && 'text-center',
                                        textAlign === 'left' && 'text-start',
                                    )}
                                    dangerouslySetInnerHTML={{
                                        __html: subTitle
                                    }}
                                />
                            )}
                        </div>
                    </div>
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