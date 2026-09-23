import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { ICONS } from "../data/labData";
import { getItems } from "../services/api";

export function FacilitiesPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getItems();
        setEquipment(res.data || []);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Facilities" />
      <SectionTitle>Equipment and infrastructure</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "1.4rem" }}>
        Explore our state-of-the-art lab equipment and infrastructure available for research and student projects.
      </p>

      {loading ? (
        <div style={{ color: T.textMid }}>Loading equipment...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {equipment.map((item) => {
            const isAvail = item.status === "available" || item.status === "Active";
            // Map category to a default icon if not explicitly set
            const Icon = ICONS.equipmentAccess; // Default icon
            return (
              <Card key={item.id} style={{ padding: "1.2rem", borderTop: \`3px solid \${isAvail ? T.success : T.warning}\`, display: "flex", flexDirection: "column" }}>
                {item.image_url && (
                  <div style={{ width: "100%", height: "160px", marginBottom: "1rem", borderRadius: "8px", overflow: "hidden", background: T.surfaceAlt }}>
                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", marginBottom: ".8rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: \`\${T.navy}10\`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{renderIcon(Icon, { size: 19 })}</div>
                  <span style={{ padding: ".32rem .6rem", borderRadius: 999, background: isAvail ? \`\${T.success}12\` : \`\${T.warning}12\`, color: isAvail ? T.success : T.warning, border: \`1px solid \${isAvail ? \`\${T.success}26\` : \`\${T.warning}26\`}\`, fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap" }}>{isAvail ? "Available" : "In use"}</span>
                </div>
                <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".98rem" }}>{item.name}</div>
                <div style={{ color: T.textMid, fontSize: ".86rem", marginTop: ".35rem", flexGrow: 1 }}>{item.description || item.spec}</div>
                <div style={{ color: T.textLight, fontSize: ".79rem", marginTop: ".8rem" }}>Category: {item.category} {item.fee && \`· Fee: \${item.fee}\`}</div>
              </Card>
            );
          })}
        </div>
      )}

      <SectionTitle>360° Virtual Lab Walkthrough</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "1.4rem" }}>
        Take a virtual tour of our lab facilities and explore the space.
      </p>
      <div style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", background: T.surfaceAlt, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: \`1px solid \${T.border}\`, overflow: "hidden" }}>
         {/* Dummy 360 viewer - using an iframe to a sample 360 video */}
         <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/tcjZ3Z2r0R8" 
            title="360 Virtual Lab Tour (Demo)" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
      </div>
    </div>
  );
}
