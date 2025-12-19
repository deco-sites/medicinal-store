import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

export interface Props {
  mobile: ImageWidget;
  desktop: ImageWidget;
  alt: string;
  href: string;
}

function Banner({
  alt,
  href,
  mobile,
  desktop,
}: Props) {
  const params = { promotion_name: alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <div class="w-full container p-4 mx-auto">
      <div>
        <a
          {...selectPromotionEvent}
          href={href}
        >
          <Picture
            {...viewPromotionEvent}
          >
            <Source
              media="(max-width: 640px)"
              src={mobile}
              width={335}
              height={572}
            />
            <Source
              media="(min-width: 640px)"
              src={desktop}
              width={1320}
              height={480}
            />
            <img
              src={desktop}
              alt={alt}
              title={alt}
              class="w-full object-cover rounded-2xl"
            />
          </Picture>
        </a>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Banner;
