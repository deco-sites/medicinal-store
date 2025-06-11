import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { clx } from "../../sdk/clx.ts";

interface ImageProps {
  alt: string;
  /** @description 640x400 */
  mobile: ImageWidget;
  /** @description 650x600 */
  desktop: ImageWidget;
}

interface ButtonProps {
  /** @description 24x24 */
  icon?: ImageWidget;
  href: string;
  text: string;
}

export interface Props {
  image?: ImageProps;
  title?: RichText;
  description: RichText;
  /**
   * @default left
   */
  textAlign?: "left" | "right";
  /**
   * @default #F0F0EE
   * @format color-input
   */
  backgroundColor?: string;
  padding?: 'default' | 'none';
  button?: ButtonProps;
}

export default function InfoCardHorizontal({
  title =
  "<p>Complementos alimentares <strong>perfeitos</strong> para quem tem uma rotina de <strong>atividades físicas intensas</strong></p>",
  image = {
    desktop: "http://placehold.co/650x600",
    mobile: "http://placehold.co/640x400",
    alt: "imagem de teste",
  },
  button,
  padding = 'default',
  textAlign = "left",
  backgroundColor = "#F0E9E9",
  description =
  "Os suplementos ajudam a melhorar a resistência física, auxiliam no ganho de massa magra e também na recuperação muscular, além de diversos outros benefícios para você que busca hipertrofia ou definição muscular.\n\nProduzidos com substâncias naturais, nossos produtos são desenvolvidos por especialistas de peso e formulados com produtos altamente eficientes e, claro, muito saborosos. Para te ajudar a alcançar seus objetivos de treino, a True Source dispõe de tudo o que você precisa em proteínas, aminoácidos, termogênicos e vitaminas e minerais. Venha com a gente e conheça um pouco mais de nossos suplementos!",
}: Props) {
  const device = useDevice();
  const isMobile = device === "mobile";

  return (
    <div class="w-full container p-4 mx-auto">
      <div
        class={clx(
          'grid gap-8 rounded-3xl grid-cols-1',
          padding === 'none' && 'py-2',
          padding === 'default' && 'p-6 md:p-12',
          textAlign === 'left' && 'md:grid-cols-[1fr_650px]',
          textAlign === 'right' && 'md:grid-cols-[650px_1fr]',
        )}
        style={{ backgroundColor }}
      >
        <div
          class={clx(
            "flex items-center justify-center",
            textAlign === 'left' && 'md:order-1',
            textAlign === 'right' && 'md:order-2',
          )}
        >
          <div class="w-full max-w-xl">
            {title && (
              <h2
                class="custom-category-title mb-4"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            <div class="custom-category-text text-sm lg:text-base">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            {button && Object.keys(button).length > 0 && (
              <a class="btn btn-primary mt-4 items-center gap-1" href={button.href}>
                {button.icon && (
                  <Image
                    src={button.icon}
                    width={24}
                    height={24}
                  />
                )}
                {button.text}
              </a>
            )}
          </div>
        </div>
        <div
          class={clx(
            textAlign === 'left' && 'md:order-2',
            textAlign === 'right' && 'md:order-1',
          )}
        >
          <Image
            src={isMobile ? image.mobile : image.desktop}
            alt={image.alt}
            class="rounded-2xl"
            width={isMobile ? 640 : 650}
            height={isMobile ? 400 : 600}
          />
        </div>
      </div>
    </div>
  );
}
