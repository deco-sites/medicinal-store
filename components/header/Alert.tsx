import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";

import type { AlertProps } from "../../sections/Header/Header.tsx";

export interface Props {
  alerts?: AlertProps[];
}

const Card = ({
  icon = "",
  text = "",
}) => (
  <div class="flex items-center gap-2">
    <Image
      src={icon}
      width={16}
      height={16}
      loading="lazy"
    />
    <div
      class="text-sm"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </div>
);

function Alert({ alerts = [] }: Props) {
  const id = useId();

  if (!alerts.length) return null;

  return (
    <div id={id} class="border-b border-base-400 h-10 flex overflow-hidden">
      <div class="container px-4 overflow-hidden">
        <div class="flex gap-10 animate-marquee">
          {/* Primeiro conjunto de alertas */}
          <div class="flex flex-row gap-10 items-center h-10 whitespace-nowrap">
            {alerts.map((alert, index) => (
              <Card key={`first-${index}`} {...alert} />
            ))}
          </div>
          {/* Segundo conjunto (duplicado) para loop infinito */}
          <div class="flex flex-row gap-10 items-center h-10 whitespace-nowrap">
            {alerts.map((alert, index) => (
              <Card key={`second-${index}`} {...alert} />
            ))}
          </div>
          <div class="flex flex-row gap-10 items-center h-10 whitespace-nowrap">
            {alerts.map((alert, index) => (
              <Card key={`tertiary-${index}`} {...alert} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Alert;
