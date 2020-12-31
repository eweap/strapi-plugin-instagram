export interface InstagramGetMedia {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    thumbnail_url: string;
    caption: string;
    permalink: string;
    timestamp: string;
}
