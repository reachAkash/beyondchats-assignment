import axios from "axios";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL &&
    `${import.meta.env.VITE_API_BASE_URL}/api/articles`) ||
  "http://localhost:8000/api/articles";

export const getArticles = () => axios.get(API_BASE);
export const getArticleById = (id: string) => axios.get(`${API_BASE}/${id}`);
