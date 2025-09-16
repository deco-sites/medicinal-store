import Section from "../../components/ui/Section.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import ProductTitle from "../../components/product/ProductTitle.tsx";
import PurchaseOptions from "../../components/product/PurchaseOptions.tsx";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import DescriptionCollapse from "../../islands/DescriptionCollapse.tsx";

import { useDevice } from "@deco/deco/hooks";
import { SectionProps } from "@deco/deco";
import { renderSection } from "apps/website/pages/Page.tsx";
import { ProductDetailsPage, PropertyValue } from "apps/commerce/types.ts";

import type { AppContext, ClusterDiscount } from "../../apps/site.ts";
import type { Section as SectionComponent } from "@deco/deco/blocks";

// Função para limpar CSS e atributos indesejados
function sanitizeHTML(html: string): string {
  // Remove style attributes
  let clean = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove class attributes específicas que podem vir da plataforma
  clean = clean.replace(/\s*class\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove width, height, bgcolor e outros atributos visuais
  clean = clean.replace(/\s*(width|height|bgcolor|color|align|valign|cellpadding|cellspacing|border)\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove font tags
  clean = clean.replace(/<\/?font[^>]*>/gi, '');
  
  // Remove elementos específicos que podem causar problemas
  clean = clean.replace(/<\/?o:p[^>]*>/gi, '');
  clean = clean.replace(/<\/?span[^>]*>/gi, '');
  
  // Remove múltiplos espaços em branco
  clean = clean.replace(/\s+/g, ' ');
  
  // Remove espaços no início e fim
  clean = clean.trim();
  
  return clean;
}

/**
 * @titleBy matcher
 */
interface DescriptionSections {
  /**
   * @description Ex: /produtos
   */
  matcher: string;
  sections: SectionComponent[];
}

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  sections?: DescriptionSections[];
  clusterDiscount: ClusterDiscount[];
  /** @hidden */
  only_purchase_options?: boolean;
  /** @hidden */
  quantity?: number;
}

const Desktop = ({ page, clusterDiscount }: Props) => {
  return (
    <div class="grid grid-cols-[1fr_600px] gap-8">
      <div>
        <ImageGallerySlider page={page} />
      </div>
      <div>
        <ProductTitle page={page} />
        <ProductInfo page={page} clusterDiscount={clusterDiscount} />
      </div>
    </div>
  );
};

const Mobile = ({ page, clusterDiscount }: Props) => {
  return (
    <div class="flex flex-col w-full">
      <ProductTitle page={page} />
      <ImageGallerySlider page={page} />
      <ProductInfo page={page} clusterDiscount={clusterDiscount} />
    </div>
  );
};

function ProductDetails(props: SectionProps<typeof loader>) {
  const { page, descriptionSections } = props;

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product } = page;
  const { isVariantOf } = product;
  // @ts-ignore additionalProperty exists
  const { additionalProperty } = isVariantOf;
  const { description } = product;

  const device = useDevice();

  if (props.only_purchase_options) {
    return (
      <PurchaseOptions
        page={page}
        quantity={props.quantity || 1}
        clusterDiscount={props.clusterDiscount}
      />
    );
  }

  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  // Lógica para exibir 30% da descrição e expandir
  const descriptionText = description || "";
  const descriptionLength = descriptionText.length;
  const previewLength = Math.ceil(descriptionLength * 0.1);
  const previewDescription = descriptionText.slice(0, previewLength);
  const restDescription = descriptionText.slice(previewLength);

  return (
    <div class="container mx-auto w-full px-4 py-6 sm:py-10 flex flex-col gap-8">
      {device === "desktop" ? <Desktop {...props} /> : <Mobile {...props} />}
      {descriptionSections.length > 0 && (
        <>
          {descriptionSections.map(renderSection)}
        </>
      )}
      <div class="divide-y divide-base-200">
        <div class="pb-4">
          <h3 class="font-semibold mb-2">Descrição</h3>
          <DescriptionCollapse
            preview={previewDescription}
            rest={restDescription}
          />
        </div>
        {additionalProperty.map((p: PropertyValue) => {
          if (
            [
              "composição",
              "advertências",
              "modo de usar",
            ].includes(p.propertyID?.toLowerCase() || "")
          ) {
            return (
              <details class="collapse collapse-arrow rounded-none">
                <summary class="collapse-title font-semibold px-0 after:!right-1">
                  {p.name}
                </summary>
                <div
                  class="collapse-content fluid-text text-sm !p-0"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(p.value || ""),
                  }}
                />
              </details>
            );
          }
        })}
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const descriptionSections = props.sections?.find((section) => {
    if (req.url.indexOf(section.matcher) !== -1) {
      return section.sections;
    }
  })?.sections || [];

  return {
    ...props,
    clusterDiscount: ctx.clusterDiscount || [],
    descriptionSections,
  };
};

export default ProductDetails;
