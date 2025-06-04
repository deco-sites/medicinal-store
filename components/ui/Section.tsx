import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @description Section title */
  title?: string;
}

function Header({ title }: Props) {
  if (!title) {
    return null;
  }

  return (
    <div
      class={clx(
        "flex justify-center items-center gap-2 mb-4 sm:mb-6",
        "px-5 sm:px-0",
      )}
    >
      <span class="text-lg sm:text-xl uppercase font-semibold text-center">{title}</span>
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed(
  { children }: {
    children: JSX.Element;
  },
) {
  return (
    <>
      {children}
    </>
  );
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "container px-4 flex flex-col gap-4 sm:gap-6 w-full",
        _class?.toString(),
      )}
    />
  );
}

function Placeholder(
  { height, class: _class }: { height: string; class?: string },
) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() { }

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
