import Image from "apps/website/components/Image.tsx";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";

/** @titleBy text */
export interface Alert {
  /**
   * @description 16x16
   */
  icon?: ImageWidget;
  text: RichText;
}

interface Props {
  title?: RichText;
  text?: RichText;
  alerts: Alert[];
}

const Card = ({
  icon,
  text,
}: Alert) => (
  <div class="flex items-center gap-2">
    {icon && (
      <Image
        src={icon}
        width={16}
        height={16}
        loading="lazy"
      />
    )}
    <div
      class="fluid-text text-sm"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </div>
);

export default function Alerts({ title, text, alerts = [] }: Props) {
  return (
    <div class="w-full container p-4 mx-auto">
      {title && title !== "" && (
        <div class="flex flex-col items-center w-full gap-4 mb-4">
          <div class="w-20 h-[3px] bg-primary" />
          <div
            class="font-bold text-lg md:text-2xl text-center uppercase max-w-72 mx-auto"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      )}
      {text && text !== "" && (
        <div
          class="fluid-text max-w-96 mx-auto mb-4 text-center"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      <div class="grid md:flex items-center grid-cols-2 md:justify-between">
        {alerts.map((alert, index) => <Card key={index} {...alert} />)}
      </div>
    </div>
  );
}
