import { VideoMedia } from "../components/VideoMedia";
import { useEffect, useState } from "react";
import { T } from "../styles/theme";
import { Badge, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { NEWS_ITEMS } from "../data/labData";
import { getNews } from "../services/api";


function formatNewsDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeNews(rows) {
  return Array.isArray(rows) ? rows.map((item) => ({
    id: item.id,
    category: item.category || item.type || "News",
    title: item.title,
    content: item.content || item.desc || "",
    published_date: item.published_date || item.date,
    image_url: item.image_url,
    video_url: item.video_url
  })) : [];
}

export function NewsPage() {
  const [news, setNews] = useState(() => normalizeNews(NEWS_ITEMS));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadNews = async () => {
      try {
        const response = await getNews();
        const rows = normalizeNews(response.data);
        if (!cancelled) setNews(rows);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadNews();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-shell section-padding">
      <SectionLabel text="News" />
      <SectionTitle>Latest updates and events</SectionTitle>
      <Divider />
      
      {loading ? (
        <div style={{ color: T.textMid }}>Loading news...</div>
      ) : news.length === 0 ? (
        <div style={{ color: T.textMid }}>No news posts available.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {news.map((item, idx) => (
            <Card key={item.id || idx} style={{ borderTop: `3px solid ${T.gold}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Media Section */}
              {item.image_url ? (
                <div style={{ width: "100%", height: "200px", background: T.surfaceAlt }}>
                  <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : null}
              <VideoMedia url={item.video_url} title={item.title} />
              
              {/* Content Section */}
              <div style={{ padding: "1.2rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".7rem", flexWrap: "wrap" }}>
                  <Badge label={item.category} tone="Pending" />
                  <span style={{ color: T.textLight, fontSize: ".77rem" }}>{formatNewsDate(item.published_date || item.date)}</span>
                </div>
                <div style={{ fontWeight: 700, color: T.navyDark, lineHeight: 1.5, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</div>
                <p style={{ color: T.textMid, lineHeight: 1.7, fontSize: ".9rem", marginBottom: 0, flexGrow: 1 }}>{item.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
