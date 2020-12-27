export interface InstagramGetMedia {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    username: string;
    timestamp: string;
}
