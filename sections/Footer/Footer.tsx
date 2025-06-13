import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";

import { asset } from "$fresh/runtime.ts";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
import { useComponent } from "../Component.tsx";

import type { ImageWidget } from "apps/admin/widgets.ts";

/** @titleBy title */
interface Item {
  href: string;
  title: string;
  /** @description size 20x20 */
  icon?: ImageWidget;
}

/** @titleBy title */
interface Link {
  href: string;
  title: string;
  children: Item[];
}

/** @titleBy alt */
interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy alt */
interface Seal {
  alt: string;
  href?: string;
  image: ImageWidget;
  width: number;
  height: number;
}

interface Logo {
  image: ImageWidget;
  width: number;
  height: number;
}

interface Props {
  logo?: Logo;
  seals?: Seal[];
  links?: Link[];
  social?: Social[];
  policies?: string;
  paymentMethods?: Social[];
}

function Footer({
  links = [],
  seals = [],
  social = [],
  policies =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ullamcorper facilisis dignissim. Vivamus gravida enim vitae tristique suscipit. Curabitur sed magna leo. Vestibulum eu varius velit. Nam ullamcorper, diam ac efficitur tempor, augue tellus ornare urna, vitae venenatis urna mauris non arcu. Fusce malesuada pellentesque ex, et lacinia nibh tempus eu. Nulla interdum condimentum orci, vel fermentum felis congue sed. Ut nec nisl ex.",
  paymentMethods = [],
  logo,
}: Props) {
  const id = useId();
  const device = useDevice();

  return (
    <div class="pt-2">
      <footer class="rounded-t-3xl bg-ice">
        <div class="container mx-auto px-4 flex flex-col gap-5 sm:gap-10 py-10">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pb-10 border-b border-base-200">
            <div class="w-full">
              <form
                hx-swap="innerHTML"
                hx-sync="this:replace"
                hx-post={useComponent(import.meta.resolve("./Result.tsx"))}
                hx-target={`#${id}`}
                class="flex flex-col sm:flex-row gap-4 w-full max-w-6xl items-center"
              >
                <div class="text-lg sm:text-2xl font-bold w-full max-w-80">
                  Receba promoções e novidades exclusivas por e-mail!
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center w-full">
                  <input
                    name="name"
                    class="input input-bordered w-full text-sm max-w-80"
                    type="text"
                    placeholder="Seu nome"
                  />
                  <input
                    name="email"
                    class="input input-bordered w-full text-sm max-w-80"
                    type="text"
                    placeholder="seu@email.com.br"
                  />
                  <button
                    class="btn btn-primary px-8 w-full sm:w-auto max-w-80"
                    type="submit"
                  >
                    <span class="[.htmx-request_&]:hidden inline">
                      Assinar
                    </span>
                    <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                  </button>
                </div>
              </form>
              <div id={id} />
            </div>
            {social && social.length > 0 && (
              <ul class="flex gap-4">
                {social.map(({ image, href, alt }) => (
                  <li class="w-12 h-12 flex items-center justify-center border border-primary rounded-full">
                    <a href={href}>
                      <Image
                        src={image}
                        alt={alt}
                        loading="lazy"
                        width={24}
                        height={24}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {device === "mobile"
            ? (
              <div>
                {links.map(({ title, children }) => (
                  <details class="collapse collapse-arrow rounded-none border-b border-base-200">
                    <summary class="collapse-title font-semibold flex items-center justify-between uppercase pl-0">
                      {title}
                    </summary>
                    <div class="collapse-content p-0">
                      <ul class="flex flex-col gap-4">
                        {children.map(({ title, href }) => (
                          <li>
                            <a
                              class="text-sm font-medium text-base-400"
                              href={href}
                            >
                              {title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            )
            : (
              <ul class="grid grid-flow-row sm:grid-flow-col gap-6 pb-10 border-b border-base-200">
                {links.map(({ title, href, children }) => (
                  <li class="flex flex-col gap-4">
                    <a class="text-base font-semibold uppercase" href={href}>
                      {title}
                    </a>
                    <ul class="flex flex-col gap-4">
                      {children.map(({ title, href, icon }) => (
                        <li>
                          <a
                            class="flex items-center gap-1 text-sm font-medium text-base-400"
                            href={href}
                          >
                            {icon && (
                              <Image
                                src={icon}
                                alt={title}
                                width={20}
                                height={20}
                                loading="lazy"
                              />
                            )}
                            {title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

          <div class="flex flex-col gap-5 sm:flex-row sm:gap-12 justify-between items-start sm:items-center pb-5 sm:pb-0">
            <ul class="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
              {paymentMethods.map(({ image, alt }) => (
                <li class="h-6 w-12 flex justify-center items-center">
                  <Image
                    src={image}
                    alt={alt}
                    width={49}
                    height={32}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>

            {seals.length > 0 && (
              <ul class="flex items-center gap-4 justify-center sm:justify-start w-full sm:w-auto">
                {seals.map(({ image, alt, href, width, height }) => {
                  if (href) {
                    return (
                      <li>
                        <a href={href}>
                          <Image
                            src={image}
                            alt={alt}
                            width={width}
                            height={height}
                            loading="lazy"
                          />
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li>
                      <Image
                        src={image}
                        alt={alt}
                        width={width}
                        height={height}
                        loading="lazy"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div class="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:items-center gap-x-8 gap-y-4">
            <img
              loading="lazy"
              src={logo?.image}
              width={logo?.width}
              height={logo?.height}
            />
            <p class="text-xs">{policies}</p>
            <div class="flex flex-nowrap items-center justify-center sm:justify-end gap-4 col-span-2">
              <a href="#">
                <img width={97} height={17} src={asset("/wave.png")} />
              </a>
              <a href="#">
                <img width={88} height={30} src={asset("/vtex.png")} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
