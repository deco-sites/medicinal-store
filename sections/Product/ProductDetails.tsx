import Section from "../../components/ui/Section.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";

import PurchaseOptions from "../../components/product/PurchaseOptions.tsx";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import DescriptionCollapse from "../../islands/DescriptionCollapse.tsx";
import FormulationDetailsCards from "../../components/product/FormulationDetailsCards.tsx";
import Flag from "../../components/ui/Flag.tsx";



import { useDevice } from "@deco/deco/hooks";
import { SectionProps } from "@deco/deco";
import { renderSection } from "apps/website/pages/Page.tsx";
import {
  Product,
  ProductDetailsPage,
  PropertyValue,
} from "apps/commerce/types.ts";

import type { AppContext, Cluster } from "../../apps/site.ts";
import type { Section as SectionComponent } from "@deco/deco/blocks";
import type { ProductFlag } from "../../components/product/ProductCard.tsx";

// Função para limpar CSS e atributos indesejados
function sanitizeHTML(html: string): string {
  // Remove style attributes
  let clean = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, "");

  // Remove class attributes específicas que podem vir da plataforma
  clean = clean.replace(/\s*class\s*=\s*["'][^"']*["']/gi, "");

  // Remove width, height, bgcolor e outros atributos visuais
  clean = clean.replace(
    /\s*(width|height|bgcolor|color|align|valign|cellpadding|cellspacing|border)\s*=\s*["'][^"']*["']/gi,
    "",
  );

  // Remove font tags
  clean = clean.replace(/<\/?font[^>]*>/gi, "");

  // Remove elementos específicos que podem causar problemas
  clean = clean.replace(/<\/?o:p[^>]*>/gi, "");
  clean = clean.replace(/<\/?span[^>]*>/gi, "");

  clean = clean.replace(/\s+/g, " ");

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
  clusterDiscount: Cluster[];
  /** @title Produtos Relacionados (Leve Junto) */
  relatedProducts?: Product[] | null;
  /** @title Mostrar Seção Leve Junto */
  showLeveJunto?: boolean;
  /** @hidden */
  only_purchase_options?: boolean;
  /** @hidden */
  only_price_update?: boolean;
  /** @hidden */
  quantity?: number;
  /** @hidden */
  productFlags?: ProductFlag[];
}

const Desktop = (
  { page, clusterDiscount, relatedProducts, showLeveJunto, quantity, productFlags }: Props,
) => {
  // Verificar se LeveJunto deve ser exibido e se há produtos relacionados
  const hasLeveJunto = showLeveJunto && relatedProducts && relatedProducts.length > 0;

  // Extrair propriedades do produto para verificar flags
  const { product } = page || {};
  const { additionalProperty = [] } = product?.isVariantOf || {};
  const propertyIDs = additionalProperty?.map((prop) => prop.propertyID);

  return (
    <div class={`grid ${hasLeveJunto ? 'grid-cols-3' : 'grid-cols-[1fr_600px]'} gap-8`}>
      <div class={hasLeveJunto ? 'col-span-1' : ''}>
        <div class="relative">
          <ImageGallerySlider page={page} />
          
          {/* Renderizar flags sob a imagem */}
          <div class="flex flex-wrap gap-2 mt-4">
            {productFlags?.map((flag, flagIndex) => {
              // Renderizar flag apenas se:
              // 1. O produto tem a propriedade correspondente OU
              // 2. A flag não tem collectionID definido (flag global)
              const shouldRenderFlag = 
                !flag.collectionID || 
                flag.collectionID === "" ||
                propertyIDs?.includes(flag.collectionID);
              
              return shouldRenderFlag ? (
                <div key={flagIndex}>
                  <Flag {...flag} />
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div class={hasLeveJunto ? 'col-span-2' : ''}>
        {/* <ProductTitle page={page} /> */}
        <ProductInfo
          page={page}
          clusterDiscount={clusterDiscount}
          relatedProducts={relatedProducts}
          showLeveJunto={showLeveJunto}
          quantity={quantity}
          productFlags={productFlags || []}
        />
      </div>
    </div>
  );
};

const Mobile = (
  { page, clusterDiscount, relatedProducts, showLeveJunto, quantity, productFlags }: Props,
) => {
  return (
    <div class="flex flex-col w-full">
      {/* <ProductTitle page={page} /> */}
      <ImageGallerySlider page={page} />
      
      <ProductInfo
        page={page}
        clusterDiscount={clusterDiscount}
        relatedProducts={relatedProducts}
        showLeveJunto={showLeveJunto}
        quantity={quantity}
        productFlags={productFlags || []}
      />
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
  const { additionalProperty = [] } = isVariantOf || {};
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

  // Se only_price_update é true, retorna o ProductInfo completo atualizado
  if (props.only_price_update) {
    return (
      <ProductInfo
        page={page}
        clusterDiscount={props.clusterDiscount}
        relatedProducts={props.relatedProducts}
        showLeveJunto={props.showLeveJunto}
        quantity={props.quantity || 1}
        isPartialUpdate={true}
        productFlags={props.productFlags || []}
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
      {descriptionSections && descriptionSections.length > 0 && (
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
              "advertências",
              "modo de usar",
            ].includes(p.propertyID?.toLowerCase() || "")
          ) {
            console.log(p.propertyID, p.name)
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
          if (p?.name === "Composição do produto") {
            return (
              <details class="collapse collapse-arrow rounded-none">
                <summary class="collapse-title font-semibold px-0 after:!right-1">
                  {p.name}
                </summary>
                <div
                  class="collapse-content fluid-text text-sm !p-0"
                  dangerouslySetInnerHTML={{
                    __html: p.value || "",
                  }}
                />
              </details>
            );
          }

          if (p?.name === "Detalhes da formulação") {
            return (
              <details class="collapse collapse-arrow rounded-none">
                <summary class="collapse-title font-semibold px-0 after:!right-1">
                  {p.name}
                </summary>
                <div class="collapse-content !p-0 py-4">
                  <FormulationDetailsCards content={p.value || ""} />
                </div>
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
  const {
    productFlags = [],
  } = ctx;
  
  const descriptionSections = props.sections?.find((section) => {
    if (req.url.indexOf(section.matcher) !== -1) {
      return section.sections;
    }
  })?.sections || [];

  return {
    ...props,
    clusterDiscount: ctx.clusterDiscount || [],
    descriptionSections,
    productFlags,
  };
};

export default ProductDetails;
