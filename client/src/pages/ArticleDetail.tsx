import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById } from "../api/articles";
import type { Article } from "../types/articles";

type ViewMode = "original" | "updated";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [view, setView] = useState<ViewMode>("original");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getArticleById(id).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  const hasUpdated = Boolean(article.updatedContent);

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </span>
        <h1>{article.title}</h1>
      </div>

      {/* Toggle */}
      {hasUpdated && (
        <div className="toggle-bar">
          <button
            className={view === "original" ? "active" : ""}
            onClick={() => setView("original")}
          >
            Original
          </button>

          <button
            className={view === "updated" ? "active" : ""}
            onClick={() => setView("updated")}
          >
            Updated
          </button>
        </div>
      )}

      {/* Content */}
      <section className="card">
        {view === "original" && (
          <>
            <h2>Original Article</h2>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </>
        )}

        {view === "updated" && hasUpdated && (
          <>
            <h2>Updated Article</h2>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.updatedContent! }}
            />

            {article.references && article.references.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h3>References</h3>
                <ul>
                  {article.references.map((ref, i) => (
                    <li key={i}>
                      <a href={ref} target="_blank" rel="noreferrer">
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
