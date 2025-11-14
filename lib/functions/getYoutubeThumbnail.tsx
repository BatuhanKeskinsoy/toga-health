/**
 * YouTube linkini parse ederek thumbnail URL oluşturur
 * @param youtubeUrl - YouTube video URL
 * @param quality - Thumbnail kalitesi (default, hq, mq, sd, maxres)
 * @returns Thumbnail URL
 */
export const getYoutubeThumbnail = (youtubeUrl: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres'): string => {
  try {
    // YouTube video ID'sini çıkar
    const videoId = extractYoutubeVideoId(youtubeUrl);
    
    if (!videoId) {
      throw new Error('Geçersiz YouTube URL\'si');
    }

    // Thumbnail URLni oluştur
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
    
    return thumbnailUrl;
  } catch (error) {
    console.error('YouTube thumbnail oluşturulurken hata:', error);
    return '';
  }
};

/**
 * YouTube URLnden video ID'sini çıkarır
 * @param url - YouTube URL
 * @returns Video ID'si
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * YouTube video ID'sinden farklı kalitelerde thumbnail URL'leri oluşturur
 * @param videoId - YouTube video ID'si
 * @returns Farklı kalitelerde thumbnail URL'leri
 */
export const getYoutubeThumbnails = (videoId: string) => {
  return {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
};

/**
 * YouTube URLnin geçerli olup olmadığını kontrol eder
 * @param url - YouTube URL
 * @returns Geçerli ise true, değilse false
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/v\/.+/
  ];

  return patterns.some(pattern => pattern.test(url));
}; 