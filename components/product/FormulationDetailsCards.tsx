interface FormulationDetailsCardsProps {
  content: string;
}

// Função para limpar CSS e atributos indesejados
function sanitizeHTML(html: string): string {
  // Remove style attributes
  let clean = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, "");

  // Remove class attributes específicas que podem vir da plataforma
  clean = clean.replace(/\s*class\s*=\s*["'][^"']*["']/gi, "");

  // Remove width, height, bgcolor e outros atributos visuais
  clean = clean.replace(
    /\s*(width|height|bgcolor|color|align|valign|cellpadding|cellspacing|border)\s*=\s*["'][^"']*["']/gi,
    "",
  );

  // Remove font tags
  clean = clean.replace(/<\/?font[^>]*>/gi, "");

  // Remove elementos específicos que podem causar problemas
  clean = clean.replace(/<\/?o:p[^>]*>/gi, "");
  clean = clean.replace(/<\/?span[^>]*>/gi, "");

  // Remove espaços em branco excessivos
  clean = clean.replace(/\s+/g, " ");

  // Remove espaços no início e fim
  clean = clean.trim();

  return clean;
}

export default function FormulationDetailsCards(
  { content }: FormulationDetailsCardsProps,
) {
  if (!content || !content.trim()) {
    return null;
  }

  // Extrai cada bloco que começa com <h3>
  // Procura por <h3>...conteúdo até o próximo <h3> ou fim
  const regex = /<h3[^>]*>[\s\S]*?<\/h3>[\s\S]*?(?=<h3|$)/gi;
  const matches = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const card = match[0].trim();
    if (card.length > 0) {
      matches.push(card);
    }
  }

  console.log("Cards encontrados:", matches.length);

  if (matches.length === 0) {
    return (
      <div
        class="flex flex-wrap gap-4 w-full"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(content),
        }}
      />
    );
  }

  return (
    <>
      <style>{`
        .formulation-cards h3 {
          font-weight: bold;
        }
        .formulation-cards hr {
          border: none;
        }
      `}</style>
      <div class="formulation-cards flex flex-wrap gap-4 w-full">
        {matches.map((card, index) => (
          <div
            key={index}
            class="flex-1 min-w-[250px] border border-base-200 rounded-lg p-4 bg-white"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(card),
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
