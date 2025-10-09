import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import PriceRangeSlider from "../../islands/PriceRangeSlider.tsx";

interface Props {
  filters: ProductListingPage["filters"];
  allowedFilters?: string[]; // Array de chaves dos filtros a mostrar (se definido, só mostra esses)
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <div
        aria-checked={selected}
        class="checkbox checkbox-primary w-5 h-5 border-accent"
      />
      <span class="text-sm">{label}</span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2`, flexDirection)}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "PriceRanges") {
          // if (item.value.length === 0) return null;

          const range = parseRange(item.value);

          return range && (
            <ValueItem
              {...item}
              label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
            />
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

const labelMap: Record<string, string> = {
  sellername: "Vendedores",
  priceranges: "Preços",
  departments: "Departamentos",
  brands: "Marcas",
  categories: "Categorias",
  categoria: "Subcategoria",
};

// Função para extrair min/max dos price ranges
function extractPriceRange(filter: FilterToggle) {
  const prices: number[] = [];

  filter.values.forEach((item) => {
    const range = parseRange(item.value);
    if (range) {
      prices.push(range.from, range.to);
    }
  });

  if (prices.length === 0) return null;

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    currentMin: Math.min(...prices),
    currentMax: Math.max(...prices),
  };
}

// Função para construir URL com price range
function buildPriceRangeUrl(min: number, max: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("price_range", `${min}:${max}`);
  return url.toString();
}

// Função para limpar price range
function clearPriceRange() {
  const url = new URL(window.location.href);
  url.searchParams.delete("price_range");
  window.location.href = url.toString();
}

function Filters({ filters, allowedFilters }: Props) {
  console.log("Filters received:", {
    filters: filters.map((f) => ({ key: f.key, label: f.label })),
    allowedFilters,
  });
  return (
    <ul class="flex flex-col gap-6 p-4 sm:p-0">
      {filters
        .filter(isToggle)
        .filter((filter) => {
          const shouldShow = !allowedFilters ||
            allowedFilters.includes(filter.key.toLowerCase());
          console.log(
            `Filter ${filter.key} (${filter.label}): shouldShow = ${shouldShow}`,
          );
          return shouldShow;
        })
        .map((filter) => {
          // Tratamento especial para price ranges
          if (filter.key === "PriceRanges") {
            const priceRange = extractPriceRange(filter);

            if (!priceRange) return null;

            return (
              <li class="flex flex-col gap-4">
                <span class="uppercase font-bold">
                  {labelMap[filter.label.toLowerCase()] ?? filter.label}
                </span>
                <PriceRangeSlider
                  minPrice={priceRange.min}
                  maxPrice={priceRange.max}
                  currentMin={priceRange.currentMin}
                  currentMax={priceRange.currentMax}
                  onApply={(min, max) => {
                    window.location.href = buildPriceRangeUrl(min, max);
                  }}
                  onClear={clearPriceRange}
                />
              </li>
            );
          }

          // Outros filtros continuam como antes
          return (
            <li class="flex flex-col gap-4">
              <span class="uppercase font-bold">
                {labelMap[filter.label.toLowerCase()] ?? filter.label}
              </span>
              <FilterValues {...filter} />
            </li>
          );
        })}
    </ul>
  );
}

export default Filters;
