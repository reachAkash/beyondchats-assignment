import { useEffect, useState } from "react";
import { getArticles } from "../api/articles";
import { Link } from "react-router-dom";
import type { Article } from "../types/articles";

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArticles()
      .then((res) => {
        setArticles(res.data);
      })
      .catch(() => {
        setError("Failed to load articles");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Articles</h1>
        <div className="loader">Fetching articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Articles</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Articles</h1>

      {articles?.map((a) => (
        <div key={a?._id} className="card">
          <div className="card-header">
            <h3>{a?.title}</h3>
            <span className={`status ${a?.status.toLowerCase()}`}>
              {a?.status}
            </span>
          </div>

          <Link className="view-link" to={`/article/${a?._id}`}>
            View →
          </Link>
        </div>
      ))}
    </div>
  );
}
