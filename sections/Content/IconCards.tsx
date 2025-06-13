import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";

interface Card {
  /** @description 40x40 */
  icon: ImageWidget;
  title: RichText;
  text: RichText;
}

interface Props {
  title?: string;
  cards: Card[];
}

export default function ({
  title,
  cards = [],
}: Props) {
  return (
    <div class="container mx-auto p-4 w-full">
      {title && title !== "" && (
        <div class="text-lg sm:text-xl uppercase font-bold text-start mb-4">
          {title}
        </div>
      )}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch gap-2 md:gap-4">
        {cards.map((card) => (
          <div class="grid grid-cols-[40px_1fr] gap-4 py-2 px-6 rounded-3xl border border-base-200 items-center">
            <Image
              src={card.icon}
              width={40}
              height={40}
            />
            <div>
              <div
                class="fluid-text text-primary font-bold"
                dangerouslySetInnerHTML={{
                  __html: card.title,
                }}
              />
              <div
                class="fluid-text"
                dangerouslySetInnerHTML={{
                  __html: card.text,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
