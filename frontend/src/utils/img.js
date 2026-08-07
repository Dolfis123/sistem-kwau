const BASE = import.meta.env.VITE_API_BASE_URL || '';
// Path dari database berbentuk /uploads/xxx.webp -> gabungkan dengan base URL API
export const imgUrl = (path) => (path ? `${BASE}${path}` : null);
