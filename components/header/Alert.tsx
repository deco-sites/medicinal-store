import Image from "apps/website/components/Image.tsx";
import Slider from "../ui/Slider.tsx";
import { useDevice } from "@deco/deco/hooks";

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
  const device = useDevice();

  return (
    <div class="border-b border-base-400">
      {device === "mobile"
        ? (
          <Slider class="carousel carousel-center gap-4 sm:gap-6 w-full py-2">
            {alerts.map((alert, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-screen flex justify-center text-center"
              >
                <Card {...alert} />
              </Slider.Item>
            ))}
          </Slider>
        )
        : (
          <div class="w-full container py-2 px-4 mx-auto">
            <div class="flex items-center justify-between gap-4">
              {alerts.map((alert, index) => <Card key={index} {...alert} />)}
            </div>
          </div>
        )}
    </div>
  );
}

export default Alert;
