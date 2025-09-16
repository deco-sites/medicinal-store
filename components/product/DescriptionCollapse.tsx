import { useState } from "preact/hooks";

interface DescriptionCollapseProps {
  preview: string;
  rest: string;
}

// Função para limpar CSS e atributos indesejados
function sanitizeHTML(html: string): string {
  // Remove style attributes
  let clean = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove class attributes específicas que podem vir da plataforma
  clean = clean.replace(/\s*class\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove width, height, bgcolor e outros atributos visuais
  clean = clean.replace(/\s*(width|height|bgcolor|color|align|valign|cellpadding|cellspacing|border)\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove font tags
  clean = clean.replace(/<\/?font[^>]*>/gi, '');
  
  // Remove elementos específicos que podem causar problemas
  clean = clean.replace(/<\/?o:p[^>]*>/gi, '');
  clean = clean.replace(/<\/?span[^>]*>/gi, '');
  
  // Remove múltiplos espaços em branco
  clean = clean.replace(/\s+/g, ' ');
  
  // Remove espaços no início e fim
  clean = clean.trim();
  
  return clean;
}

export default function DescriptionCollapse(
  { preview, rest }: DescriptionCollapseProps,
) {
  const [expanded, setExpanded] = useState(false);

  // Limpa o HTML antes de usar
  const cleanPreview = sanitizeHTML(preview);
  const cleanRest = sanitizeHTML(rest);

  return (
    <div class="fluid-text text-sm">
      {!expanded
        ? (
          <>
            <span dangerouslySetInnerHTML={{ __html: cleanPreview }} />...{" "}
            <button
              class="link-btn ml-2"
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
                fontSize: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setExpanded(true)}
            >
              Ver mais
            </button>
          </>
        )
        : (
          <>
            <span class="text-sm" dangerouslySetInnerHTML={{ __html: cleanPreview + cleanRest }} />
            <button
              class="link-btn ml-2"
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
                fontSize: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                marginTop: "8px",
              }}
              onClick={() => setExpanded(false)}
            >
              Ver menos
            </button>
          </>
        )}
    </div>
  );
}
