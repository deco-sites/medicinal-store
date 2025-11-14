import { Product } from "apps/commerce/types.ts";

interface Props {
  product: Product;
}

export default function ({
  product,
}: Props) {
  const { additionalProperty = [] } = product;

  const highlightedProperties = additionalProperty.filter((property) =>
    property.description && property.description === "highlight"
  );

  return (
    <div class="flex flex-col gap-2">
      {highlightedProperties.map((property, index) => (
        <div key={index} class="badge badge-primary py-1 px-2">
          {property.value}
        </div>
      ))}
    </div>
  );
}
