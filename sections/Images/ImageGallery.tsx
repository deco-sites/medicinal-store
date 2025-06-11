import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
/**
 * @titleBy alt
 */
interface Banner {
  mobile: ImageWidget;
  desktop?: ImageWidget;
  /** @description Image alt texts */
  alt: string;
  /** @description Adicione um link */
  href: string;
}
interface Props {
  /**
   * @maxItems 2
   * @minItems 2
   */
  banners?: Banner[];
}
function Banner({ mobile, desktop, alt, href }: Banner) {
  return (
    <a href={href} class="overflow-hidden">
      <Picture>
        <Source
          width={190}
          height={190}
          media="(max-width: 767px)"
          src={mobile}
        />
        <Source
          width={640}
          height={420}
          media="(min-width: 768px)"
          src={desktop || mobile}
        />
        <img
          width={640}
          class="w-full h-full object-cover rounded-2xl"
          src={mobile}
          alt={alt}
          decoding="async"
          loading="lazy"
        />
      </Picture>
    </a>
  );
}
function Gallery({
  banners = [
    {
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      alt: "Fashion",
      href: "/",
    },
    {
      alt: "Fashion",
      href: "/",
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
    },
  ],
}: Props) {
  return (
    <div class="w-full container p-4 mx-auto">
      <ul class="grid gap-8 lg:gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2">
        {banners.map((item) => (
          <li>
            <Banner {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Gallery;
