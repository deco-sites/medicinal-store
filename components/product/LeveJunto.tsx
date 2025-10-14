import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useScript } from "@deco/deco/hooks";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

import Image from "apps/website/components/Image.tsx";
import type { Product } from "apps/commerce/types.ts";

export interface Props {
  /** @title Produtos Relacionados */
  products: Product[] | null;
  /** @title Mostrar Seção Leve Junto */
  showLeveJunto?: boolean;
  /** @title Título da Seção */
  title?: string;
}

const WIDTH = 80;
const HEIGHT = 80;

// Função para criar props do carrinho igual ao AddToCartButton
const useAddToCart = (product: Product, seller: string, quantity = 1) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: quantity,
    };
  }
  return null;
};

// Script para gerenciar a funcionalidade do LeveJunto
const setupLeveJunto = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const updateSummary = () => {
    const checkedBoxes = container.querySelectorAll('input[name="leve-junto-item"]:checked');
    let total = 0;
    let listTotal = 0;
    let count = 0;
    
    console.log(`LeveJunto - UpdateSummary: ${checkedBoxes.length} checkboxes checked`);
    
    checkedBoxes.forEach((checkbox, index) => {
      const input = checkbox as HTMLInputElement;
      const price = parseFloat(input.getAttribute('data-price') || '0');
      const listPrice = parseFloat(input.getAttribute('data-list-price') || '0');
      console.log(`LeveJunto - Checkbox ${index + 1}: value=${input.value}, price=${price}`);
      total += price;
      listTotal += listPrice || price;
      count++;
    });
    
    const priceElement = container.querySelector('.leve-junto-total');
    const savingsElement = container.querySelector('.leve-junto-savings');
    const textElement = container.querySelector('.leve-junto-text');
    if (textElement) {
      const text = count === 1 ? 
        `Compre este <span class="leve-junto-count">1</span> item por` :
        `Compre estes <span class="leve-junto-count">${count}</span> itens por até`;
      textElement.innerHTML = text;
    }
    if (priceElement) {
      priceElement.textContent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(total) + ' no pix';
    }
    
    // Calcular economia
    const savings = listTotal - total;
    if (savingsElement && savings > 0) {
      savingsElement.textContent = `Você economiza ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(savings)}`;
      (savingsElement as HTMLElement).style.display = 'block';
    } else if (savingsElement) {
      (savingsElement as HTMLElement).style.display = 'none';
    }
    
    // Disparar evento customizado para o ProductInfo
    const updateEvent = new CustomEvent('leveJuntoUpdate', {
      detail: { total, listTotal, count, savings }
    });
    document.dispatchEvent(updateEvent);
    
    console.log(`LeveJunto - Summary updated: ${count} items, total: R$ ${total.toFixed(2)}, savings: R$ ${savings.toFixed(2)}`);
  };

  const handleBuyClick = () => {
    // Buscar diretamente pelos checkboxes marcados
    const checkedBoxes = container.querySelectorAll('input[name="leve-junto-item"]:checked');
    
    console.log(`LeveJunto - Checked checkboxes count: ${checkedBoxes.length}`);
    console.log('LeveJunto - Checked checkboxes:', checkedBoxes);
    
    if (checkedBoxes.length === 0) {
      alert('Selecione pelo menos um produto');
      return;
    }
    
    // Adicionar cada produto selecionado ao carrinho com delay
    const addToCartSequentially = async () => {
      for (let i = 0; i < checkedBoxes.length; i++) {
        const checkbox = checkedBoxes[i] as HTMLInputElement;
        const itemContainer = checkbox.closest('.leve-junto-item') as HTMLElement;
        const cartData = itemContainer?.getAttribute('data-cart-item');
        console.log(`LeveJunto - Processing item ${i + 1}/${checkedBoxes.length}`);
        console.log(`LeveJunto - Checkbox value: ${checkbox.value}, checked: ${checkbox.checked}`);
        
        if (cartData && itemContainer) {
          try {
            const { item, platformProps } = JSON.parse(decodeURIComponent(cartData));
            console.log("LeveJunto - Adding to cart:", { item, platformProps });
            console.log("LeveJunto - Product ID:", item.item_id);
            console.log("LeveJunto - Product Name:", item.item_name);
            
            if (window.STOREFRONT && window.STOREFRONT.CART) {
              window.STOREFRONT.CART.addToCart(item, platformProps);
              console.log(`LeveJunto - Successfully added product ${i + 1} to cart`);
              
              // Pequeno delay para evitar conflitos
              if (i < checkedBoxes.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            } else {
              console.error("LeveJunto - STOREFRONT.CART not available");
            }
          } catch (error) {
            console.error(`LeveJunto - Error adding product ${i + 1} to cart:`, error);
          }
        } else {
          console.error(`LeveJunto - No cart data or container found for product ${i + 1}`);
          console.error(`LeveJunto - Container:`, itemContainer);
          console.error(`LeveJunto - Cart data:`, cartData);
        }
      }
    };
    
    addToCartSequentially();
    
    // Abrir minicart após adicionar todos os produtos
    setTimeout(() => {
      const drawer = document.querySelector('input[type="checkbox"][id*="minicart"]') as HTMLInputElement;
      if (drawer) {
        drawer.checked = true;
      }
    }, 200);
  };
  
  // Event listeners para checkboxes
  const checkboxes = container.querySelectorAll('input[name="leve-junto-item"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      console.log(`LeveJunto - Checkbox changed: ${target.value}, checked: ${target.checked}`);
      updateSummary();
    });
  });

  // Event listener para botão de compra
  const buyButton = container.querySelector('.leve-junto-buy-btn');
  if (buyButton) {
    buyButton.addEventListener('click', handleBuyClick);
  }
  
  // Inicializar estado dos items baseado nos checkboxes
  checkboxes.forEach((checkbox) => {
    const target = checkbox as HTMLInputElement;
    const itemContainer = target.closest('.leve-junto-item') as HTMLElement;
    if (itemContainer) {
      itemContainer.setAttribute('data-selected', target.checked ? 'true' : 'false');
      console.log(`LeveJunto - Initial state: ${target.value}, selected: ${target.checked}`);
    }
  });
  
  // Inicializar cálculo
  updateSummary();
};

export default function LeveJunto({
  products,
  showLeveJunto = true,
  title = "LEVE JUNTO",
}: Props) {
  const id = useId();

  if (!showLeveJunto || !products || products.length === 0) {
    return null;
  }

  // Pega apenas os primeiros 3 produtos
  const relatedProducts = products.slice(0, 3);

  // Calcular qual produto tem o maior desconto percentual
  const productsWithDiscount = relatedProducts.map((product, index) => {
    const { price = 0, listPrice = 0 } = useOffer(product.offers);
    const discountPercentage = listPrice > price ? ((listPrice - price) / listPrice) * 100 : 0;
    return { index, discountPercentage };
  });

  const maxDiscountIndex = productsWithDiscount.reduce((max, current) => 
    current.discountPercentage > max.discountPercentage ? current : max
  ).index;

  return (
    <div
      id={id}
      class="w-full max-w-[500px] bg-gray-50 rounded-lg border border-gray-200 p-4 mt-6 lg:sticky lg:top-64"
    >
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      <div class="space-y-3">
        {relatedProducts.map((product, index) => (
          <LeveJuntoItem
            key={product.productID}
            product={product}
            index={index}
            hasMaxDiscount={index === maxDiscountIndex && productsWithDiscount[index].discountPercentage > 0}
          />
        ))}
      </div>

      <LeveJuntoSummary />

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(setupLeveJunto, id)
        }}
      />
    </div>
  );
}

interface LeveJuntoItemProps {
  product: Product;
  index: number;
  hasMaxDiscount?: boolean;
}

function LeveJuntoItem({ product, index, hasMaxDiscount: _hasMaxDiscount = false }: LeveJuntoItemProps) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];
  const relativeUrl = relative(url);

  const { price = 0, listPrice = 0, availability, seller = "1", installments } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const hasDiscount = listPrice > price;

  // Criar breadcrumb básico (será similar ao que temos no ProductInfo)
  const breadcrumb = {
    "@type": "BreadcrumbList" as const,
    itemListElement: [],
    numberOfItems: 0,
  };

  // Criar item para analytics igual ao ProductInfo
  const item = mapProductToAnalyticsItem({ 
    product, 
    breadcrumbList: breadcrumb,
    price, 
    listPrice,
    index 
  });

  // Criar props da plataforma igual ao AddToCartButton
  const platformProps = useAddToCart(product, seller, 1);

  return (
    <div 
      class="leve-junto-item flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
      data-selected={index === 0 ? "true" : "false"}
      data-cart-item={encodeURIComponent(JSON.stringify({ item, platformProps }))}
    >
      <input
        type="checkbox"
        name="leve-junto-item"
        value={product.productID}
        class="checkbox checkbox-primary"
        data-price={price}
        data-list-price={listPrice}
        checked={index === 0} // Primeiro item selecionado por padrão
      />

      <div class="flex items-center gap-3 flex-1">
        <a href={relativeUrl} class="flex-shrink-0">
          <Image
            src={front?.url || ""}
            alt={front?.alternateName || title}
            width={WIDTH}
            height={HEIGHT}
            class="rounded object-cover"
            style={{ aspectRatio: "1/1" }}
          />
        </a>

        <div class="flex-1 min-w-0">
          <a href={relativeUrl}>
            <h4 class="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary">
              {title}
            </h4>
          </a>

          <div class="flex flex-col gap-1 mt-2">
            {hasDiscount && (
              <span class="text-xs text-gray-400 line-through">
                {formatPrice(listPrice)}
              </span>
            )}
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-primary">
                {inStock ? formatPrice(price) : "Indisponível"}
              </span>
              {hasDiscount && inStock && (
                <span class="text-xs font-semibold text-white uppercase bg-primary text-center px-2 py-1 rounded-full">
                  {Math.round(((listPrice - price) / listPrice) * 100)}% OFF
                </span>
              )}
            </div>
            {installments && inStock && (
              <span class="text-xs text-gray-500">
                {installments}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeveJuntoSummary() {
  return (
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex flex-col gap-3">
        <div class="flex items-start flex-col gap-2 justify-between text-sm">
          <span class="text-gray-600 leve-junto-text">
            Compre este <span class="leve-junto-count">1</span> item por até
          </span>
          <span class="font-bold text-lg text-primary leve-junto-total">
            R$ 0,00
          </span>
        </div>

        <button
          type="button"
          class="btn btn-primary w-full leve-junto-buy-btn"
        >
          COMPRAR ITENS SELECIONADOS
        </button>
      </div>
    </div>
  );
}
