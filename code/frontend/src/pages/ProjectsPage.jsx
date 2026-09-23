import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Badge, Button, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { LuChevronRight, LuGithub, LuExternalLink, LuVideo } from "react-icons/lu";
import { getProjects } from "../services/api";

export function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const shown = filter === "All" ? projects : projects.filter((project) => project.status === filter);

  return (
    <div className="page-shell section-padding">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="Projects" />
          <SectionTitle>Research projects</SectionTitle>
          <Divider />
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {["All", "Active", "Completed"].map((value) => (
            <Button key={value} variant={filter === value ? "primary" : "outline"} size="sm" onClick={() => setFilter(value)}>{value}</Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: T.textMid }}>Loading projects...</div>
      ) : shown.length === 0 ? (
        <div style={{ color: T.textMid }}>No projects found.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {shown.map((project) => {
            const tagsList = project.tags ? (typeof project.tags === 'string' ? project.tags.split(',').map(t => t.trim()) : project.tags) : [];
            
            return (
              <Card key={project.id} style={{ padding: "1.2rem", borderLeft: \`4px solid \${project.status === "Active" ? T.success : T.textLight}\` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Media Section */}
                  {(project.image_url || project.video_url) && (
                    <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                      {project.image_url && (
                        <div style={{ height: "200px", minWidth: "300px", borderRadius: "8px", overflow: "hidden", background: T.surfaceAlt, flexShrink: 0 }}>
                          <img src={project.image_url} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      {project.video_url && (
                        <div style={{ height: "200px", minWidth: "300px", borderRadius: "8px", overflow: "hidden", background: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", border: \`1px solid \${T.border}\`, flexShrink: 0 }}>
                           <a href={project.video_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: T.navy, textDecoration: 'none' }}>
                             <LuVideo size={32} style={{ marginBottom: '8px' }} />
                             <span>Watch Video</span>
                           </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Section */}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".55rem", flexWrap: "wrap" }}>
                        <Badge label={project.status || "Unknown"} />
                        <span style={{ color: T.textLight, fontSize: ".78rem" }}>{project.year}</span>
                      </div>
                      <h3 style={{ margin: 0, color: T.navyDark, fontSize: "1.12rem" }}>{project.title}</h3>
                      <div style={{ color: T.textLight, fontSize: ".8rem", marginTop: ".25rem" }}>
                        Lead: {project.lead || "N/A"} {project.supervisor && \`| Supervisor: \${project.supervisor}\`}
                      </div>
                      <p style={{ color: T.textMid, fontSize: ".88rem", lineHeight: 1.7, marginTop: ".55rem", marginBottom: 0 }}>{project.description}</p>
                      
                      {/* Action Links */}
                      {(project.github_link || project.demo_link) && (
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          {project.github_link && (
                            <a href={project.github_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: T.navy, fontWeight: 600, textDecoration: "none" }}>
                              <LuGithub size={16} /> GitHub Repo
                            </a>
                          )}
                          {project.demo_link && (
                            <a href={project.demo_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: T.navy, fontWeight: 600, textDecoration: "none" }}>
                              <LuExternalLink size={16} /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", maxWidth: 180 }}>
                      {tagsList.map((tag, idx) => (
                        <span key={idx} style={{ padding: ".28rem .55rem", borderRadius: 999, background: T.surfaceAlt, border: \`1px solid \${T.border}\`, color: T.navy, fontSize: ".72rem", fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: "1.25rem" }}>
        <Button variant="outline" icon={LuChevronRight}>Research pipeline</Button>
      </div>
    </div>
  );
}
