export default function Flag({
  textColor = "#fff",
  backgroundColor = "#000",
  backgroundImage = "",
  text = "Promoção",
}) {
    return (
        <p 
            style={{
                color: textColor,
                backgroundColor,
                backgroundImage: `url(${backgroundImage ?? ""})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} 
            class="text-xs font-semibold  uppercase text-center px-2 py-1 rounded-full"
        >
            {text}
        </p>
    );
}