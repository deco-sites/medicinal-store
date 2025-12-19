interface Props {
    text: string;
}

const TextH1 = ({ text }: Props) => {
  return (
    <h1 class="text-lg sm:text-xl uppercase font-semibold text-center">{text}</h1>
  )
}

export const LoadingFallback = (props: Props) => {
    return (
   <div style={{ height: "20px" }} class="flex justify-center items-center">
     <span class="loading loading-spinner" />
   </div>
    );
};

export default TextH1