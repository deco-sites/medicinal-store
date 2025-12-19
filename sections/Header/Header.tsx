import type { INavItem } from "../../components/header/NavItem.tsx";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import SignIn from "../../components/header/SignIn.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice, useScript } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import ModalCoupon from "../../islands/ModalCoupon.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
  mobileWidth?: number;
  mobileHeight?: number;
}
/** @titleBy text */
export interface AlertProps {
  /**
   * @description 16x16
   */
  icon?: ImageWidget;
  text?: RichText;
}
/** @titleBy text */
interface LinkProps {
  /**
   * @description Icone 24x24
   */
  icon?: ImageWidget;
  text: RichText;
  href: string;
}
export interface SectionProps {
  /** @title Logo */
  logo: Logo;
  alerts?: AlertProps[];
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: INavItem[];
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  links?: LinkProps[];
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
  /**
   * @title Modal Cupom
   * @description Configuração do Modal que aparece após 3 segundos na entrada do site
   */
  modal?: Modal;
  /**
   * @title Frete Grátis - Valor Mínimo
   * @description Valor mínimo de compra para ganhar frete grátis
   */
  freeShippingTarget?: number;
}

interface Modal {
  /**
   *  @title Desativar Modal
   *  @description Marque esta opção para desativar o modal de cupom que aparece na entrada do site
   */
  disabledModal?: boolean;
  /**
   * @title Imagem
   * @description Tamanho recomendado 313 x 326
   */
  image?: ImageWidget;
  /**
   *  @title Código do cupom
   * @description Ex: PRIMEIRACOMPRA10
   */
  coupom?: string;
  /**
   * @title Link regulamento
   * @description Link para o regulamento do cupom
   */
  regulation?: string;
}
type Props = Omit<SectionProps, "alert">;
const onLoad = (freeShippingTarget?: number) => {
  // Armazenar freeShippingTarget globalmente
  if (freeShippingTarget && typeof window !== "undefined") {
    (window as any).STORE_CONFIG = (window as any).STORE_CONFIG || {};
    (window as any).STORE_CONFIG.freeShippingTarget = freeShippingTarget;
  }

  const handleScroll = () => {
    const header = document.getElementById("header");
    if (!header) return null;

    const scrollY = globalThis.scrollY;
    if (scrollY > 36) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  };

  handleScroll();

  setInterval(handleScroll, 100);
};
const Link = ({
  icon = "",
  text = "",
  href = "",
}) => (
  <a class="flex items-center gap-2" href={href}>
    <Image
      src={icon}
      width={24}
      height={24}
      loading="lazy"
      title={text}
      alt={text}
    />
    <div
      class="hidden sm:block text-sm"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </a>
);
const Desktop = (
  { navItems, logo, searchbar, loading, links, modal }: Props,
) => (
  <>
    <div class="relative bg-white px-2 xl:px-0 w-full shadow-sm rounded-b-xl">
      {
        <>
          {modal?.disabledModal ? null : (
            <ModalCoupon
              image={modal?.image}
              coupom={modal?.coupom}
              regulation={modal?.regulation}
            />
          )}
        </>
      }
      <div class="md:flex items-center gap-8 hidden mx-auto pt-4 w-full container px-4">
        <div class="flex-none">
          <a href="/" aria-label="Store logo" class="block">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <div class="w-full max-w-full h-12">
          {loading === "lazy"
            ? (
              <div class="flex justify-center items-center">
                <span class="loading loading-spinner" />
              </div>
            )
            : <Searchbar {...searchbar} />}
        </div>

        <div class="flex flex-none justify-end items-center gap-6 col-span-1">
          <SignIn />
          {links?.map((link) => <Link {...link} />)}
          <div class="flex items-center font-thin text-xs">
            <Bag />
          </div>
        </div>
      </div>

      <div class="mx-auto py-4 w-full container px-4">
        <div class="w-full">
          <ul class="flex justify-between items-center">
            {navItems?.slice(0, 10).map((item, index) => (
              <NavItem item={item} key={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
);
const Mobile = (
  { logo, searchbar, navItems, loading, links, modal }: Props,
) => (
  <>
    <>
      {modal?.disabledModal ? null : (
        <ModalCoupon
          image={modal?.image}
          coupom={modal?.coupom}
          regulation={modal?.regulation}
        />
      )}
    </>
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      class="drawer-end"
      aside={
        <Drawer.Aside drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "90vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </Drawer.Aside>
      }
    />

    <div class="flex flex-col gap-4 bg-white p-4 w-full shadow-sm rounded-b-3xl">
      <div
        class="flex justify-between items-center gap-4"
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
          gridTemplateColumns:
            "min-content auto min-content min-content min-content",
        }}
      >
        {logo && (
          <a
            href="/"
            class="flex-grow inline-flex justify-start"
            style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
            aria-label="Store logo"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.mobileWidth || 125}
              height={logo.mobileHeight || 24}
            />
          </a>
        )}

        <div class="flex flex-none justify-end items-center gap-4">
          {/* <SignIn /> */}
          {links?.map((link) => <Link {...link} />)}
          <Bag />
          <label
            for={SIDEMENU_DRAWER_ID}
            class="btn btn-circle btn-sm btn-primary sm:btn-ghost"
            aria-label="open menu"
          >
            <Icon id="menu" />
          </label>
        </div>
      </div>
      <Searchbar {...searchbar} />
    </div>
  </>
);
function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  freeShippingTarget = 250,
  ...props
}: Props) {
  const device = useDevice();
  return (
    <>
      {alerts.length > 0 && <Alert alerts={alerts} />}
      <div class="pb-2 bg-transparent">
        <header
          style={{
            height: device === "desktop"
              ? HEADER_HEIGHT_DESKTOP
              : HEADER_HEIGHT_MOBILE,
          }}
        >
          <div id="header" class="bg-base-100 top-0 w-full z-40">
            {device === "desktop"
              ? <Desktop logo={logo} {...props} />
              : <Mobile logo={logo} {...props} />}
          </div>
        </header>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, freeShippingTarget),
        }}
      />
    </>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...props as any} loading="lazy" />
);
export default Header;
