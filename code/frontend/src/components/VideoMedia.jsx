export function VideoMedia({ url, title = "Lab video" }) {
  if (!url) return null;
  let parsed;
  try { parsed = new URL(url); } catch { return <p>Video URL is unavailable.</p>; }
  if (!["http:", "https:"].includes(parsed.protocol)) return <p>Video URL is unavailable.</p>;
  return <div style={{ padding: "1rem" }}>
    {/\.(mp4|webm|ogg)$/i.test(parsed.pathname) && <video controls preload="metadata" aria-label={title} style={{ width: "100%", maxHeight: 320 }} src={url} />}
    <a href={url} target="_blank" rel="noopener noreferrer">Watch video: {title}</a>
  </div>;
}
