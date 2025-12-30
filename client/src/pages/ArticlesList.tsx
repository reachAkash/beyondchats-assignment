import { useEffect, useState } from "react";
import { getArticles } from "../api/articles";
import { Link } from "react-router-dom";
import type { Article } from "../types/articles";

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles().then((res) => {
      setArticles(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="container">
      <h1>Articles</h1>

      {articles.map((a) => (
        <div key={a._id} className="card">
          <div className="card-header">
            <h3>{a.title}</h3>
            <span className={`status ${a.status.toLowerCase()}`}>
              {a.status}
            </span>
          </div>

          <Link className="view-link" to={`/article/${a._id}`}>
            View →
          </Link>
        </div>
      ))}
    </div>
  );
}
