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
        <div key={index} class="badge badge-primary">
          {property.value}
        </div>
      ))}
    </div>
  );
}
