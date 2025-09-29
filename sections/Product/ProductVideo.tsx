import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";

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
   *  @title Subtítulo */
  subtitle?: string;
  /** @title Imagem de Fundo */
  backgroundImage?: ImageWidget;
  /** 
   * @title Cor de Fundo
   * @format color
  */
  backgroundColor?: string;
  /** @title Vídeos (máximo 3) */
  videos: Video[];
}

// 🔹 Converte YouTube normal/shorts para embed
const getYouTubeEmbedUrl = (url: string) => {
  const shortMatch = url.match(/shorts\/([0-9A-Za-z_-]{11})/);
  const normalMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);

  if (shortMatch && shortMatch[1]) {
    return { type: "vertical", url: `https://www.youtube.com/embed/${shortMatch[1]}` };
  }
  if (normalMatch && normalMatch[1]) {
    return { type: "horizontal", url: `https://www.youtube.com/embed/${normalMatch[1]}` };
  }
  return null;
};

// 🔹 Converte Instagram post/reel para embed
const getInstagramEmbedUrl = (url: string) => {
  const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
  const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);

  if (postMatch && postMatch[1]) {
    return { type: "vertical", url: `https://www.instagram.com/p/${postMatch[1]}/embed` };
  }
  if (reelMatch && reelMatch[1]) {
    return { type: "vertical", url: `https://www.instagram.com/reel/${reelMatch[1]}/embed` };
  }
  return null;
};

// 🔹 Decide qual embed usar
const getEmbed = (url: string) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return getYouTubeEmbedUrl(url);
  }
  if (url.includes("instagram.com")) {
    return getInstagramEmbedUrl(url);
  }
  return null;
};

export default function ProductVideo({
  title,
  subtitle,
  videos,
  backgroundImage,
  backgroundColor,
}: Props) {
  const displayVideos = videos.slice(0, 3);

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : backgroundColor
    ? { backgroundColor }
    : {};

  return (
    <section class="py-8" style={backgroundStyle}>
      <div class="container mx-auto px-4">
        {/* Título e Subtítulo */}
        <div class="text-center mb-8">
          <div
            dangerouslySetInnerHTML={{ __html: title }}
            class="text-lg md:text-xl font-bold text-gray-900 mb-2"
          />
          {subtitle && (
            <div
              dangerouslySetInnerHTML={{ __html: subtitle }}
              class="text-gray-900 text-sm"
            />
          )}
        </div>

        {/* Grid de Vídeos */}
        <div class="flex flex-col md:flex-row gap-6 justify-center items-start">
          {displayVideos.map((videoItem, index) => {
            const embed = getEmbed(videoItem.video);

            return (
              <div key={index} class="flex-1 max-w-sm mx-auto md:mx-0">
                <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                  {embed?.url ? (
                    <div
                      class={
                        embed.type === "vertical"
                          ? "w-full max-w-[380px] aspect-[9/16]" // Shorts/Reels
                          : "w-full aspect-video" // YouTube normal
                      }
                    >
                      <iframe
                        class="w-full h-full rounded-lg"
                        src={embed.url}
                        title={videoItem.title || `video-${index}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <p class="text-center text-red-600 p-4">
                      URL inválida ou não suportada
                    </p>
                  )}

                  {/* Título do Vídeo */}
                  {videoItem.title && (
                    <div class="p-4 w-full">
                      <h3 class="text-lg font-semibold text-gray-800 text-center">
                        {videoItem.title}
                      </h3>
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
