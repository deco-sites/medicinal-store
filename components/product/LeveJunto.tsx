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
  /** @hidden */
  mainProduct?: Product | null;
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

// Função para extrair número de parcelas e valor da string de parcelamento
const parseInstallments = (installmentsText: string) => {
  if (!installmentsText) return { count: 1, value: 0 };

  // Tenta extrair "3x de R$ 50,00" (com ou sem "ou " no início)
  const match = installmentsText.match(/(\d+)x\s+de\s+R\$\s+([\d.,]+)/);
  if (match) {
    const parsedValue = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
    return {
      count: parseInt(match[1]),
      value: isNaN(parsedValue) ? 0 : parsedValue
    };
  }
  return { count: 1, value: 0 };
};

// Script para gerenciar a funcionalidade do LeveJunto
const setupLeveJunto = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Obter dados do produto principal do atributo data
  const mainProductData = container.getAttribute('data-main-product');
  let mainProductItem: Record<string, unknown> | null = null;
  let mainProductProps: Record<string, unknown> | null = null;

  if (mainProductData) {
    try {
      const { item, platformProps } = JSON.parse(decodeURIComponent(mainProductData));
      mainProductItem = item;
      mainProductProps = platformProps;
    } catch (error) {
      console.error("LeveJunto - Error parsing main product data:", error);
    }
  }

  // Reabilitar checkboxes quando HTMX terminar a requisição
  document.addEventListener('htmx:afterSwap', () => {
    const allCheckboxes = container.querySelectorAll('input[name="leve-junto-item"]');
    allCheckboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      input.disabled = false;
      console.log("LeveJunto - Checkbox re-enabled after HTMX request");
    });
    // Atualizar resumo após HTMX swap (quando quantidade do produto principal muda)
    updateSummary();
  });

  document.addEventListener('htmx:afterRequest', () => {
    const allCheckboxes = container.querySelectorAll('input[name="leve-junto-item"]');
    allCheckboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      input.disabled = false;
      console.log("LeveJunto - Checkbox re-enabled after HTMX request");
    });
    // Atualizar resumo após HTMX request
    setTimeout(() => updateSummary(), 100);
  });

  const updateSummary = () => {
    const checkedBoxes = container.querySelectorAll('input[name="leve-junto-item"]:checked');
    let total = 0;
    let listTotal = 0;
    let count = 0;

    // Obter quantidade do produto principal
    let mainProductQuantity = 1;
    // Procura pelo input de número dentro do product-info-content (mais específico)
    const quantitySelector = document.querySelector('#product-info-content input[type="number"]') as HTMLInputElement;
    // Ou procura pelo checkbox selecionado no PurchaseOptions
    const purchaseOptionsCheckbox = document.querySelector('input[name="quantity"]:checked') as HTMLInputElement;

    if (quantitySelector && quantitySelector.value) {
      mainProductQuantity = parseInt(quantitySelector.value) || 1;
    } else if (purchaseOptionsCheckbox && purchaseOptionsCheckbox.value) {
      mainProductQuantity = parseInt(purchaseOptionsCheckbox.value) || 1;
    }

    console.log(`LeveJunto - UpdateSummary: ${checkedBoxes.length} checkboxes checked + ${mainProductQuantity} unidades do produto principal`);

    // Adicionar o produto principal ao total
    if (mainProductData) {
      try {
        const { item } = JSON.parse(decodeURIComponent(mainProductData));

        // Tentar extrair preço do item de múltiplas formas
        let mainPrice = 0;
        let mainListPrice = 0;

        // Tenta extrair preço diretamente do item
        if (item.price) {
          mainPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        }

        if (item.list_price) {
          mainListPrice = typeof item.list_price === 'string' ? parseFloat(item.list_price) : item.list_price;
        } else if (item.listPrice) {
          mainListPrice = typeof item.listPrice === 'string' ? parseFloat(item.listPrice) : item.listPrice;
        } else {
          mainListPrice = mainPrice; // Fallback: preço de lista = preço normal se não encontrado
        }

        // Fallback: tenta obter preço do elemento visível na página
        if (mainPrice === 0) {
          const priceElement = document.querySelector('#price-container [data-price]') as HTMLElement;
          if (priceElement) {
            const priceAttr = priceElement.getAttribute('data-price');
            mainPrice = priceAttr ? parseFloat(priceAttr) : 0;
          }
        }

        if (mainPrice > 0) {
          total += mainPrice * mainProductQuantity;
          listTotal += mainListPrice * mainProductQuantity;
          count += mainProductQuantity;
          console.log(`LeveJunto - Main product: price=${mainPrice}, quantity=${mainProductQuantity}, subtotal=${mainPrice * mainProductQuantity}`);
        } else {
          console.warn("LeveJunto - Could not extract main product price");
        }
      } catch (error) {
        console.error("LeveJunto - Error extracting main product price:", error);
      }
    }

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
    const installmentsElement = container.querySelector('.leve-junto-installments');

    if (textElement) {
      // Mostrar contagem total (incluindo produto principal)
      const text = count === 1 ?
        `Compre este <span class="leve-junto-count">1</span> item por` :
        `Compre estes <span class="leve-junto-count">${count}</span> itens`;
      textElement.innerHTML = text;
      console.log(`LeveJunto - Summary text updated to: ${text}`);
    }
    if (priceElement) {
      priceElement.textContent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(total) + ' no pix';
    }

    // Calcular economia (listPrice - price para cada item selecionado + produto principal)
    let totalSavings = 0;
    let totalInstallmentValue = 0;
    let hasInstallments = false;
    let totalInstallmentItems = 0;

    // Adicionar economia do produto principal (se houver)
    if (mainProductData) {
      try {
        const { item } = JSON.parse(decodeURIComponent(mainProductData));

        let mainPrice = 0;
        let mainListPrice = 0;

        // Tenta extrair preço diretamente do item
        if (item.price) {
          mainPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        }

        if (item.list_price) {
          mainListPrice = typeof item.list_price === 'string' ? parseFloat(item.list_price) : item.list_price;
        } else if (item.listPrice) {
          mainListPrice = typeof item.listPrice === 'string' ? parseFloat(item.listPrice) : item.listPrice;
        }

        // Calcular economia do produto principal multiplicado pela quantidade
        if (mainListPrice > mainPrice) {
          const mainProductSavings = (mainListPrice - mainPrice) * mainProductQuantity;
          totalSavings += mainProductSavings;
          console.log(`LeveJunto - Main product savings: price=${mainPrice}, listPrice=${mainListPrice}, quantity=${mainProductQuantity}, savings=${mainProductSavings}`);
        }

        // Verificar se produto principal tem parcelamento
        const priceElement = document.querySelector('#price-container [data-installments]') as HTMLElement;
        if (priceElement) {
          const mainInstallmentsText = priceElement.getAttribute('data-installments');
          if (mainInstallmentsText) {
            hasInstallments = true;
            const { value: mainInstallmentValue } = parseInstallments(mainInstallmentsText);
            if (mainInstallmentValue > 0) {
              totalInstallmentValue += mainInstallmentValue * mainProductQuantity;
              totalInstallmentItems += mainProductQuantity;
            }
          }
        }
      } catch (error) {
        console.error("LeveJunto - Error calculating main product savings:", error);
      }
    }

    checkedBoxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;

      // Converter valores com cuidado para lidar com vírgulas
      const priceStr = input.getAttribute('data-price') || '0';
      const listPriceStr = input.getAttribute('data-list-price') || '0';
      const price = parseFloat(priceStr.toString().replace(',', '.'));
      const listPrice = parseFloat(listPriceStr.toString().replace(',', '.'));
      const installmentsText = input.getAttribute('data-installments-text') || '';

      const itemSavings = listPrice - price;
      totalSavings += itemSavings;

      console.log(`LeveJunto - Raw: priceStr="${priceStr}", listPriceStr="${listPriceStr}", parsed price=${price}, listPrice=${listPrice}, savings=${itemSavings}`);

      if (installmentsText) {
        hasInstallments = true;
        const { value: installmentValue } = parseInstallments(installmentsText);
        if (installmentValue > 0) {
          totalInstallmentValue += installmentValue;
          totalInstallmentItems += 1;
          console.log(`LeveJunto - Item: price=${price}, listPrice=${listPrice}, savings=${itemSavings}, installments=${installmentsText}, parsedValue=${installmentValue}`);
        } else {
          console.warn(`LeveJunto - Failed to parse installments: "${installmentsText}"`);
        }
      } else {
        console.log(`LeveJunto - Item: price=${price}, listPrice=${listPrice}, savings=${itemSavings}, installments=none`);
      }
    });

    console.log(`LeveJunto - Total summary: savings=${totalSavings}, hasInstallments=${hasInstallments}, installmentTotal=${totalInstallmentValue}, checkedBoxes=${checkedBoxes.length}, installmentItems=${totalInstallmentItems}`);

    // Mostrar parcelamento
    if (installmentsElement) {
      if (hasInstallments && totalInstallmentItems > 0 && totalInstallmentValue > 0) {
        const avgInstallmentValue = totalInstallmentValue / totalInstallmentItems;
        const formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(avgInstallmentValue);
        installmentsElement.textContent = `ou 3x de ${formattedValue} sem juros`;
        (installmentsElement as HTMLElement).style.display = 'block';
        console.log(`LeveJunto - Showing installments: ${installmentsElement.textContent} (${totalInstallmentItems} items, avg: ${avgInstallmentValue})`);
      } else {
        installmentsElement.textContent = '';
        (installmentsElement as HTMLElement).style.display = 'none';
        console.log(`LeveJunto - Hiding installments - hasInstallments=${hasInstallments}, itemsCount=${totalInstallmentItems}, totalValue=${totalInstallmentValue}`);
      }
    }

    // Mostrar economia
    if (savingsElement) {
      // Se houver algum item selecionado OU produto principal, considerar mostrar economia
      const hasSelectedItems = checkedBoxes.length > 0 || mainProductQuantity > 0;
      
      if (hasSelectedItems) {
        // Se houver economia, mostra. Se não houver, esconde.
        if (totalSavings > 0) {
          savingsElement.textContent = `Nessa compra você economiza ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(totalSavings)}`;
          (savingsElement as HTMLElement).classList.remove('hidden');
          (savingsElement as HTMLElement).style.display = 'block';
          console.log(`LeveJunto - SHOWING SAVINGS: ${savingsElement.textContent}`);
        } else {
          (savingsElement as HTMLElement).classList.add('hidden');
          (savingsElement as HTMLElement).style.display = 'none';
          console.log(`LeveJunto - No savings for selected items (totalSavings=${totalSavings})`);
        }
      } else {
        (savingsElement as HTMLElement).classList.add('hidden');
        (savingsElement as HTMLElement).style.display = 'none';
        console.log(`LeveJunto - HIDING SAVINGS - no items selected`);
      }
    }

    // Disparar evento customizado para o ProductInfo
    const updateEvent = new CustomEvent('leveJuntoUpdate', {
      detail: { total, listTotal, count, savings: totalSavings }
    });
    document.dispatchEvent(updateEvent);

    console.log(`LeveJunto - Summary updated: ${count} items, total: R$ ${total.toFixed(2)}, savings: R$ ${totalSavings.toFixed(2)}`);
  };

  const handleBuyClick = async () => {
    // Buscar diretamente pelos checkboxes marcados
    const checkedBoxes = container.querySelectorAll('input[name="leve-junto-item"]:checked');
    const buyButton = container.querySelector('.leve-junto-buy-btn') as HTMLButtonElement;

    console.log(`LeveJunto - Checked checkboxes count: ${checkedBoxes.length}`);
    console.log('LeveJunto - Checked checkboxes:', checkedBoxes);

    if (checkedBoxes.length === 0) {
      alert('Selecione pelo menos um produto');
      return;
    }

    // Desabilitar botão enquanto processa
    if (buyButton) {
      buyButton.disabled = true;
      buyButton.textContent = 'Adicionando ao carrinho...';
    }

    // Obter quantidade selecionada do produto principal (do QuantitySelector ou do PurchaseOptions)
    let mainProductQuantity = 1;
    // Procura pelo input de número dentro do product-info-content (mais específico)
    const quantitySelector = document.querySelector('#product-info-content input[type="number"]') as HTMLInputElement;
    // Ou procura pelo checkbox selecionado no PurchaseOptions
    const purchaseOptionsCheckbox = document.querySelector('input[name="quantity"]:checked') as HTMLInputElement;

    if (quantitySelector && quantitySelector.value) {
      mainProductQuantity = parseInt(quantitySelector.value) || 1;
      console.log(`LeveJunto - Main product quantity from QuantitySelector: ${mainProductQuantity}`);
    } else if (purchaseOptionsCheckbox && purchaseOptionsCheckbox.value) {
      mainProductQuantity = parseInt(purchaseOptionsCheckbox.value) || 1;
      console.log(`LeveJunto - Main product quantity from PurchaseOptions: ${mainProductQuantity}`);
    }

    // Criar lista de produtos a adicionar (principal + selecionados)  
    const productsToAdd: Array<{
      item: Record<string, unknown>;
      platformProps: Record<string, unknown>;
      label: string;
      quantity?: number;
    }> = [];

    // Adicionar produto principal se disponível
    if (mainProductItem && mainProductProps) {
      // Clonar mainProductProps para não alterar o original
      const mainProductPropsClone = JSON.parse(JSON.stringify(mainProductProps));

      // Ajustar a quantidade conforme a plataforma
      if (mainProductPropsClone.orderItems) {
        mainProductPropsClone.orderItems[0].quantity = mainProductQuantity;
      } else if (mainProductPropsClone.quantity !== undefined) {
        mainProductPropsClone.quantity = mainProductQuantity;
      } else if (mainProductPropsClone.Quantity !== undefined) {
        mainProductPropsClone.Quantity = mainProductQuantity;
      } else if (mainProductPropsClone.productVariantId !== undefined) {
        mainProductPropsClone.quantity = mainProductQuantity;
      }

      productsToAdd.push({
        item: mainProductItem,
        platformProps: mainProductPropsClone,
        label: "Produto Principal",
        quantity: mainProductQuantity
      });
      console.log(`LeveJunto - Added main product to cart list with quantity: ${mainProductQuantity}`);
    }

    // Adicionar cada checkbox marcado
    for (let i = 0; i < checkedBoxes.length; i++) {
      const checkbox = checkedBoxes[i] as HTMLInputElement;
      const itemContainer = checkbox.closest('.leve-junto-item') as HTMLElement;
      const cartData = itemContainer?.getAttribute('data-cart-item');

      if (cartData && itemContainer) {
        try {
          const { item, platformProps } = JSON.parse(decodeURIComponent(cartData));
          productsToAdd.push({
            item,
            platformProps,
            label: `Produto Selecionado ${i + 1}`
          });
          console.log(`LeveJunto - Added "Produto Selecionado ${i + 1}" to processing list`);
        } catch (error) {
          console.error(`LeveJunto - Error parsing product ${i + 1} data:`, error);
        }
      }
    }

    console.log(`LeveJunto - Total products to add: ${productsToAdd.length}`);

    // Adicionar cada produto ao carrinho com delay e retry
    const addToCartSequentially = async () => {
      let successCount = 0;
      const maxRetries = 2;

      for (let i = 0; i < productsToAdd.length; i++) {
        const { item, platformProps, label } = productsToAdd[i];
        let retries = 0;
        let added = false;

        while (retries < maxRetries && !added) {
          console.log(`LeveJunto - Processing ${label} (${i + 1}/${productsToAdd.length}, attempt ${retries + 1}/${maxRetries})`);
          console.log("LeveJunto - Item data:", item);
          console.log("LeveJunto - Platform props:", platformProps);

          if (window.STOREFRONT && window.STOREFRONT.CART) {
            try {
              // Type assertion para contornar limitação do tipo
              const cartItem = item as never;
              const cartProps = platformProps as never;
              const result = window.STOREFRONT.CART.addToCart(cartItem, cartProps);

              // Se retornar uma promise, aguardar
              if (result && typeof result === 'object' && 'then' in result) {
                await result;
              }

              successCount++;
              added = true;
              console.log(`LeveJunto - Successfully added ${label} to cart (${successCount}/${productsToAdd.length})`);

              // Delay para evitar conflitos e garantir que a requisição foi processada
              await new Promise(resolve => setTimeout(resolve, 600));
            } catch (error) {
              retries++;
              console.error(`LeveJunto - Error adding ${label} to cart (attempt ${retries}):`, error);

              // Tentar novamente se não atingiu o máximo de tentativas
              if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 800));
              }
            }
          } else {
            console.error("LeveJunto - STOREFRONT.CART not available");
            break;
          }
        }

        if (!added && retries >= maxRetries) {
          console.error(`LeveJunto - Failed to add ${label} after ${maxRetries} attempts`);
        }
      }

      return successCount;
    };

    // Aguardar TODOS os produtos serem adicionados antes de abrir o carrinho
    const successCount = await addToCartSequentially();
    console.log(`LeveJunto - ${successCount}/${productsToAdd.length} products successfully added to cart`);

    // Aguardar mais um pouco para garantir que o carrinho foi atualizado
    await new Promise(resolve => setTimeout(resolve, 500));

    // Resetar checkboxes para seu estado inicial (todos desmarcados)
    try {
      const allCheckboxes = container.querySelectorAll('input[name="leve-junto-item"]');
      allCheckboxes.forEach((checkbox) => {
        const input = checkbox as HTMLInputElement;
        input.checked = false;
        input.disabled = false; // Garantir que não estão desabilitados
      });
      console.log("LeveJunto - Checkboxes reset to initial state (unchecked)");

      // Atualizar resumo após resetar checkboxes
      updateSummary();
    } catch (error) {
      console.error("LeveJunto - Error resetting checkboxes:", error);
    }

    // Aguardar um pouco mais antes de abrir o carrinho
    await new Promise(resolve => setTimeout(resolve, 300));

    // Abrir minicart APÓS adicionar todos os produtos
    try {
      const drawer = document.querySelector('input[type="checkbox"][id*="minicart"]') as HTMLInputElement;
      if (drawer) {
        drawer.checked = true;
        console.log("LeveJunto - Minicart opened");
      } else {
        console.warn("LeveJunto - Minicart drawer not found");
      }
    } catch (error) {
      console.error("LeveJunto - Error opening minicart:", error);
    }

    // Reabilitar botão
    if (buyButton) {
      buyButton.disabled = false;
      buyButton.textContent = 'COMPRAR ITENS SELECIONADOS';
    }
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

  // Event listener para mudanças na quantidade do produto principal (PurchaseOptions)
  document.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;

    // Escutar mudanças no checkbox de quantidade (PurchaseOptions)
    if (target.name === 'quantity' || target.id === 'qtd-id' || target.type === 'number') {
      console.log(`LeveJunto - Quantity selector changed, updating summary`);
      updateSummary();
    }
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
  mainProduct,
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

  // Preparar dados do produto principal para passar ao frontend
  let mainProductDataAttr = "";
  if (mainProduct) {
    const breadcrumb = {
      "@type": "BreadcrumbList" as const,
      itemListElement: [],
      numberOfItems: 0,
    };
    const { price = 0, listPrice = 0, seller = "1" } = useOffer(mainProduct.offers);
    const mainProductItem = mapProductToAnalyticsItem({
      product: mainProduct,
      breadcrumbList: breadcrumb,
      price,
      listPrice,
      index: 0
    });
    const mainProductProps = useAddToCart(mainProduct, seller, 1);
    mainProductDataAttr = encodeURIComponent(JSON.stringify({
      item: mainProductItem,
      platformProps: mainProductProps
    }));
  }

  return (
    <div
      id={id}
      class="w-full max-w-[500px] bg-gray-50 rounded-lg border border-gray-200 p-4 mt-6 lg:sticky lg:top-64"
      data-main-product={mainProductDataAttr}
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

  // Criar breadcrumb básico
  const breadcrumb = {
    "@type": "BreadcrumbList" as const,
    itemListElement: [],
    numberOfItems: 0,
  };

  // Criar item para analytics
  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
    index
  });

  // Criar props da plataforma
  const platformProps = useAddToCart(product, seller, 1);

  return (
    <div
      class="leve-junto-item flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
      data-selected="true"
      data-cart-item={encodeURIComponent(JSON.stringify({ item, platformProps }))}
    >
      <input
        type="checkbox"
        name="leve-junto-item"
        value={product.productID}
        class="checkbox checkbox-primary cursor-pointer"
        data-price={price}
        data-list-price={listPrice}
        data-installments={installments || ""}
        data-installments-text={installments || ""}
        checked={false}
        disabled={false}
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
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
          <span class="text-gray-600 text-sm leve-junto-text">
            Compre este <span class="leve-junto-count">1</span> item por
          </span>

          <div class="flex flex-col gap-1">
            <span class="font-bold text-lg text-primary leve-junto-total">
              R$ 0,00 no pix
            </span>
            <span class="text-xs text-gray-600 leve-junto-installments">
            </span>
            <div class="leve-junto-savings text-xs text-green-600 font-semibold hidden">
              Nessa compra você economiza R$ 0,00
            </div>
          </div>
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
