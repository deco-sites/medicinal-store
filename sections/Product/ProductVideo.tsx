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

export default function ProductVideo({ title, subtitle, videos, backgroundImage, backgroundColor }: Props) {
    // Limita a 3 vídeos
    const displayVideos = videos.slice(0, 3);

    // Define o estilo do background
    const backgroundStyle = backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : backgroundColor
            ? { backgroundColor }
            : {};

    return (
        <section
            class="py-8"
            style={backgroundStyle}
        >
            <div class="container mx-auto px-4">
                {/* Título e Subtítulo */}
                <div class="text-center mb-8">
                    <div dangerouslySetInnerHTML={{ __html: title }} class="text-lg md:text-xl font-bold text-gray-900 mb-2" />
                    {subtitle && (
                        <div dangerouslySetInnerHTML={{ __html: subtitle }} class="text-gray-900 text-sm" />
                    )}
                </div>

                {/* Grid de Vídeos - Responsivo */}
                <div class="flex flex-col md:flex-row gap-6 justify-center items-start">
                    {displayVideos.map((videoItem, index) => (
                        <div key={index} class="flex-1 max-w-sm mx-auto md:mx-0">
                            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Vídeo */}
                                <div class="relative">
                                    <video
                                        class="w-full h-full object-cover"
                                        controls
                                        preload="metadata"
                                        poster={videoItem.thumbnail}
                                        height={600}
                                    >
                                        <source src={videoItem.video} type="video/mp4" />
                                        Seu navegador não suporta o elemento de vídeo.
                                    </video>
                                </div>

                                {/* Título do Vídeo */}
                                {videoItem.title && (
                                    <div class="p-4">
                                        <h3 class="text-lg font-semibold text-gray-800 text-center">
                                            {videoItem.title}
                                        </h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}