import { clx } from "../../sdk/clx.ts";
import { useDevice } from "@deco/deco/hooks";

import Section from "../../components/ui/Section.tsx";

interface Props {
    title?: string;
    src: string;
    height: number;
    mobileHeight: number;
    isFullWidth?: boolean;
}

export default function ({
    src,
    title,
    height,
    isFullWidth = false,
    mobileHeight,
}: Props) {
    const device = useDevice();

    return (
        <div
            class={clx(
                'w-full p-4',
                !isFullWidth && 'container mx-auto'
            )}
        >
            {title && title !== '' && (
                <Section.Header title={title} />
            )}
            <iframe
                src={src}
                class='rounded-2xl'
                style={{ border: 0 }}
                width="100%"
                height={device === 'mobile' ? `${mobileHeight}px` : `${height}px`}
                loading="lazy"
                allowFullScreen
            />
        </div>
    );
}