import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "../api/articles";
import type { Article } from "../types/articles";
import { useNavigate } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    getArticleById(id).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="page-header">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </span>
        <h1>{article.title}</h1>
      </div>

      <section className="card">
        <h2>Original Article</h2>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </section>

      {article.updatedContent && (
        <section className="card">
          <h2>Updated Article</h2>
          <div dangerouslySetInnerHTML={{ __html: article.updatedContent }} />

          {article.references && article.references.length > 0 && (
            <>
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
            </>
          )}
        </section>
      )}
    </div>
  );
}
