import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";
import type { RichText, ImageWidget } from 'apps/admin/widgets.ts';

interface ImageProps {
    alt: string;
    /** @description 640x400 */
    mobile: ImageWidget;
    /** @description 650x600 */
    desktop: ImageWidget;
}

export interface Props {
    image?: ImageProps;
    title?: RichText;
    description: RichText;
    /**
     * @default left
     */
    textAlign?: 'left' | 'right';
    /**
     * @default #F0F0EE
     * @format color-input
     */
    backgroundColor?: string;
}

export default function InfoCardHorizontal({
    title =
    '<p>Complementos alimentares <strong>perfeitos</strong> para quem tem uma rotina de <strong>atividades físicas intensas</strong></p>',
    image = {
        desktop: 'http://placehold.co/650x600',
        mobile: 'http://placehold.co/640x400',
        alt: 'imagem de teste'
    },
    textAlign = 'left',
    backgroundColor = '#F0F0EE',
    description =
    'Os suplementos ajudam a melhorar a resistência física, auxiliam no ganho de massa magra e também na recuperação muscular, além de diversos outros benefícios para você que busca hipertrofia ou definição muscular.\n\nProduzidos com substâncias naturais, nossos produtos são desenvolvidos por especialistas de peso e formulados com produtos altamente eficientes e, claro, muito saborosos. Para te ajudar a alcançar seus objetivos de treino, a True Source dispõe de tudo o que você precisa em proteínas, aminoácidos, termogênicos e vitaminas e minerais. Venha com a gente e conheça um pouco mais de nossos suplementos!',
}: Props) {
    const device = useDevice();
    const isMobile = device === 'mobile';
    const cardTextLeft = 'gap-4 flex-col-reverse md:gap-0 md:flex-row';
    const cardTextRight = 'gap-4 flex-col-reverse md:gap-0 md:flex-row-reverse';

    const alignment = textAlign === 'left' ? cardTextLeft : textAlign === 'right' ? cardTextRight : cardTextLeft;

    return (
        <div class='w-full container px-4 mx-auto my-4'>
            <div
                class={`flex ${alignment} items-center p-6 md:p-12 rounded-3xl`}
                style={{ backgroundColor }}
            >
                <div class='w-full md:w-1/2 flex items-center justify-center'>
                    <div class='w-full md:w-3/4'>
                        {title && (
                            <h2
                                class='custom-category-title mb-4'
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        )}
                        <div class='custom-category-text text-sm lg:text-base'>
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </div>
                    </div>
                </div>
                <div class='w-full md:w-1/2'>
                    <Image
                        src={isMobile ? image.mobile : image.desktop}
                        alt={image.alt}
                        class='rounded-2xl'
                        width={isMobile ? 640 : 650}
                        height={isMobile ? 400 : 600}
                    />
                </div>
            </div>
        </div>
    )
}
