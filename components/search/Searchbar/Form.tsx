/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import { useScript } from "@deco/deco/hooks";
import { asResolved } from "@deco/deco";
import { type Resolved } from "@deco/deco";
// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";
export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default O que você procura?
   */
  placeholder?: string;
  /** @description Loader to run when suggesting new elements */
  loader: Resolved<Suggestion | null>;
}
const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as HTMLInputElement | null;
      if (input) {
        input.checked = true;
        document.getElementById(formId)?.focus();
      }
    }
  });
};
const Suggestions = import.meta.resolve("./Suggestions.tsx");
export default function Searchbar(
  { placeholder = "O que você procura?", loader }: SearchbarProps,
) {
  const slot = useId();
  return (
    <div class="group w-full flex flex-col relative">
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        class="relative z-20 flex flex-grow flex-1 items-center bg-white pl-6 pr-0 border border-light-gray-200 rounded-full h-full max-h-10 sm:max-h-12 overflow-visible"
        action={ACTION}
      >
        <input
          autoFocus
          tabIndex={0}
          class="flex-grow bg-transparent border-0 w-full h-full max-h-10 sm:max-h-12 text-base-300 placeholder:font-semibold text-xs lg:text-sm placeholder:text-xs min-[391px]:placeholder:text-xs outline-none"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={loader && useComponent<SuggestionProps>(Suggestions, {
            loader: asResolved(loader),
          })}
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
        <button
          type="submit"
          class="btn join-item no-animation bg-transparent border-0 shadow-none px-6 hover:bg-transparent"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <Icon
            id="search"
            class="inline [.htmx-request_&]:hidden text-primary"
          />
        </button>
      </form>
      <div
        class="hidden group-hover:block absolute right-0 bg-white px-5 pt-10 pb-6 z-[1] top-[25px] rounded-b-2xl shadow-sm"
        id={slot}
      />
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID,
          ),
        }}
      />
    </div>
  );
}
