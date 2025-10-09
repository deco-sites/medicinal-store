import type { ImageWidget } from "apps/admin/widgets.ts";
interface BannerPdpProps {
  /**
   * @title Imagem Mobile
   */
  mobile: BannerMobileProps;
  /**
   * @title Imagem Desktop
   */
  desktop: BannerDesktopProps;
  /**
   * @title Link da imagem
   * @description URL para a qual o usuário será redirecionado ao clicar na imagem.
   */
  link: string;
}

interface BannerDesktopProps {
  /**
   * @title Imagem Desktop
   */
  desktop: ImageWidget;
  /**
   * @title Texto Alternativo
   */
  alt: string;
  /**
   * @title Altura Máxima (px)
   * @description Define a altura máxima da imagem em pixels. Se a imagem for maior que essa altura, ela será redimensionada proporcionalmente para caber dentro do limite definido. Se não for especificado, a imagem manterá sua altura original.
   */
  height?: number;
}
interface BannerMobileProps {
  /**
   * @title Imagem Mobile
   */
  mobile: ImageWidget;
  /**
   * @title Texto Alternativo
   */
  alt: string;
  /**
   * @title Altura Máxima (px)
   * @description Define a altura máxima da imagem em pixels. Se a imagem for maior que essa altura, ela será redimensionada proporcionalmente para caber dentro do limite definido. Se não for especificado, a imagem manterá sua altura original.
   */
  height?: number;
}

const BannerPdp = ({ mobile, desktop, link }: BannerPdpProps) => {
  return (
    <div class="flex justify-center my-4 container lg:px-0">
      <a href={link}>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobile.mobile}
          />
          <source
            media="(min-width: 768px)"
            srcSet={desktop.desktop}
          />
          <img
            src={desktop.desktop}
            alt={desktop.alt || mobile.alt}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: `${desktop.height}px`,
            }}
          />
        </picture>
      </a>
    </div>
  );
};

export default BannerPdp;
