import { clx } from "../../sdk/clx.ts";
import type { RichText } from "apps/admin/widgets.ts";

export interface Props {
  title: RichText;
  description: RichText;
  /** @default 1 */
  columns: "1" | "2";
}

export default function OnlyText({
  columns = "1",
  title =
    "<p>Complementos alimentares <strong>perfeitos</strong> para quem tem uma rotina de <strong>atividades físicas intensas</strong></p>",
  description =
    "Os suplementos ajudam a melhorar a resistência física, auxiliam no ganho de massa magra e também na recuperação muscular, além de diversos outros benefícios para você que busca hipertrofia ou definição muscular.\n\nProduzidos com substâncias naturais, nossos produtos são desenvolvidos por especialistas de peso e formulados com produtos altamente eficientes e, claro, muito saborosos. Para te ajudar a alcançar seus objetivos de treino, a True Source dispõe de tudo o que você precisa em proteínas, aminoácidos, termogênicos e vitaminas e minerais. Venha com a gente e conheça um pouco mais de nossos suplementos!",
}: Props) {
  return (
    <div className="w-full container px-4 mx-auto">
      <div
        class={clx(
          "flex flex-col",
          "rounded-[35px] px-8 py-4 md:px-12",
          columns === "1"
            ? "items-center gap-8"
            : "md:flex-row items-stretch gap-6 md:gap-10",
        )}
      >
        <div
          class={clx(
            "w-full",
            columns === "1"
              ? "text-center w-full max-w-2xl flex flex-col items-center gap-8"
              : "text-left w-full md:w-2/5",
          )}
        >
          <div
            class={clx(
              "flex-col items-center",
              columns === "1" ? "flex" : "hidden",
            )}
          >
            <div class="w-20 h-[3px] bg-primary" />
          </div>
          <div
            class="custom-category-title static md:sticky md:top-28 mb-0"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        <div
          class={clx(
            "w-[1.5px] bg-primary",
            columns === "1" ? "hidden" : "hidden md:flex",
          )}
        />
        <div
          class={clx(
            "custom-category-text",
            !title ? "text-1xl sm:text-2xl  font-bold" : "text-sm lg:text-base",
            columns === "1"
              ? "text-center w-full max-w-[620px]"
              : "mt-8 md:mt-0 text-left w-full md:w-3/5 pl-6 md:pl-0 border-l-[1.5px] border-red md:border-0",
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    </div>
  );
}
