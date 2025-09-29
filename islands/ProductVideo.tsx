import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import { useState } from "preact/hooks"; // Importamos o useState

/** @titleBy client */
export interface Video {
  /** @title Cliente */
  client: string;
  /** @title Vídeo */
  video: VideoWidget;
  /** @title Título do Vídeo */
  title?: string;
  /** @title Thumbnail (opcional) */
  thumbnail?: ImageWidget;
}

export interface Props {
  /**
    @format rich-text 
   * @title Título Principal */
  title: string;
  /**
    @format rich-text 
   * @title Subtítulo */
  subtitle?: string;
  /** @title Imagem de Fundo */
  backgroundImage?: ImageWidget;
  /** * @title Cor de Fundo
    * @format color
  */
  backgroundColor?: string;
  /** @title Vídeos (máximo 3) */
  videos: Video[];
}

// Funções auxiliares (sem alterações)
const getYouTubeEmbedUrl = (url: string, autoplay = false) => {
  const shortMatch = url.match(/shorts\/([0-9A-Za-z_-]{11})/);
  const normalMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
  const videoId = shortMatch?.[1] || normalMatch?.[1];

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;
    const type = shortMatch ? "vertical" : "horizontal";
    return { type, url: embedUrl, videoId };
  }
  return null;
};

const getInstagramEmbedUrl = (url: string) => {
  const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
  const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
  if (postMatch?.[1]) return { type: "vertical", url: `https://www.instagram.com/p/${postMatch[1]}/embed` };
  if (reelMatch?.[1]) return { type: "vertical", url: `https://www.instagram.com/reel/${reelMatch[1]}/embed` };
  return null;
};

const getEmbed = (url: string, autoplay = false) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return getYouTubeEmbedUrl(url, autoplay);
  if (url.includes("instagram.com")) return getInstagramEmbedUrl(url);
  return null;
};


// Componente principal com a lógica integrada
export default function ProductVideo({
  title,
  subtitle,
  videos,
  backgroundImage,
  backgroundColor,
}: Props) {
  const displayVideos = videos.slice(0, 3);
  
  // 1. Estado para controlar os vídeos que estão tocando.
  // A chave é o índice (number) e o valor é um booleano.
  const [playing, setPlaying] = useState<{ [key: number]: boolean }>({});

  const handlePlay = (index: number) => {
    // 2. Atualiza o estado para marcar o vídeo 'index' como tocando.
    setPlaying(prev => ({
      ...prev, // Mantém o estado dos outros vídeos
      [index]: true, // Define o vídeo atual como true
    }));
  };

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : backgroundColor
    ? { backgroundColor }
    : {};

  return (
    <section class="py-8" style={backgroundStyle}>
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <div dangerouslySetInnerHTML={{ __html: title }} class="text-lg md:text-xl font-bold text-gray-900 mb-2" />
          {subtitle && <div dangerouslySetInnerHTML={{ __html: subtitle }} class="text-gray-900 text-sm" />}
        </div>

        <div class="flex flex-col md:flex-row gap-6 justify-center items-start">
          {displayVideos.map((videoItem, index) => {
            const embedInfo = getEmbed(videoItem.video, true);
            if (!embedInfo) return null; // Pula vídeos com URL inválida

            const isPlaying = playing[index]; // 3. Verifica se este vídeo específico está tocando.

            const containerClass = embedInfo.type === "vertical"
              ? "w-full max-w-[380px] aspect-[9/16]"
              : "w-full aspect-video";

            return (
              <div key={index} class="flex-1 max-w-sm mx-auto md:mx-0">
                <div class="bg-transparent rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                  <div class={containerClass}>
                    {isPlaying ? (
                      // 4. Se estiver tocando, renderiza o iframe
                      <iframe
                        class="w-full h-full rounded-lg"
                        src={embedInfo.url}
                        title={videoItem.title || `video-${index}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      // 5. Se não, renderiza a thumbnail
                      <div class="relative w-full h-full cursor-pointer group" onClick={() => handlePlay(index)}>
                        <img
                          src={videoItem.thumbnail ?? `https://img.youtube.com/vi/${embedInfo.videoId}/hqdefault.jpg`}
                          alt={videoItem.title || "Thumbnail do vídeo"}
                          class="w-full h-full object-cover rounded-lg"
                        />
                        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50">
                          <svg class="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {videoItem.title && (
                    <div class="p-4 w-full">
                      <h3 class="text-lg font-semibold text-gray-800 text-center">{videoItem.title}</h3>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export const LoadingFallback = (props: Props) => {
    return (
   <div style={{ height: "716px" }} class="flex justify-center items-center">
     <span class="loading loading-spinner" />
   </div>
    );
};