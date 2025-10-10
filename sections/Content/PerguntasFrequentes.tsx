



interface Props {
    /**
* @title Titulo
*/
    title?: string;
    /**
* @title Adicione uma nova pergunta
*/
    questions: Question[];
}

/**
 * @titleBy question
 */
interface Question {
    /**
 * @title Pergunta
 * @format textarea 
 */
    question: string;
    /**
 * @title Resposta
 * @format rich-text
 */
    answer: string;
    /** @hide true */
    number?: number;
    /** @hide true */
    originalNumber?: number;
}



const Question = ({ number, question, answer }: Question) => {
    return (
        <div class="flex flex-col gap-1 border-t border-gray-400 py-5">
            <>
                <h2 class="custom-category-title mb-4"><span>{number} - </span> {question}</h2>
                <p class="custom-category-text text-sm lg:text-base" dangerouslySetInnerHTML={{ __html: answer }} />
            </>
            <span class="text-xs text-gray-500">{new Date().toLocaleDateString("pt-BR")}</span>
        </div>
    )
}


const PerguntasFrequentes = ({
    questions,
    title = "Perguntas Frequentes"

}: Props) => {
    return (
        <div class="px-4 container mx-auto my-5 flex flex-col gap-5">
            <h2 class="custom-category-title mb-4">{title}</h2>
            <div class="flex flex-col gap-2">
                {questions && questions.map((q, index) => (
                    <Question key={index} {...q} number={index + 1} />
                ))}
            </div>
        </div>
    )
}

export const LoadingFallback = (props: Props) => {
    return (
        <div style={{ height: "300px" }} class="flex flex-col justify-center items-center">
            <div class="skeleton w-full h-[200px]">
                <>
                    <div class="skeleton w-full h-2"></div>
                    <div class="skeleton w-full h-2"></div>
                </>
                <div class="skeleton w-full h-2"></div>
            </div>
        </div>
    );
};


export default PerguntasFrequentes