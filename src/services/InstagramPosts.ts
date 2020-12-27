import { InstagramPost } from '../interfaces/instagram-post.interface';

const getAll = async function getAll(): Promise<InstagramPost[]> {
    return strapi.query('InstagramPost', 'instagram').find();
};

const module = {
    getAll,
};

export default module;
