import { T } from "../styles/theme";
import { Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { LuBookOpen, LuShieldCheck, LuServer, LuFileText } from "react-icons/lu";
import { renderIcon } from "../components/iconUtils";

const DOCS = [
  {
    title: "Lab Access Guidelines",
    icon: LuShieldCheck,
    desc: "Procedures and rules for obtaining physical access to the CV & AI Laboratory. Includes safety guidelines and operating hours.",
    link: "#access-guidelines"
  },
  {
    title: "Equipment Usage Policy",
    icon: LuServer,
    desc: "Rules for reserving, using, and returning lab equipment, including high-performance servers, GPUs, and specialized hardware.",
    link: "#equipment-policy"
  },
  {
    title: "Research Paper Guidelines",
    icon: LuFileText,
    desc: "Formatting standards, affiliation requirements, and submission processes for publishing research conducted at the lab.",
    link: "#research-guidelines"
  },
  {
    title: "Onboarding for New Members",
    icon: LuBookOpen,
    desc: "Step-by-step guide for new students and researchers joining the lab, including account setup and essential reading.",
    link: "#onboarding"
  }
];

export function DocumentationPage() {
  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Resources" />
      <SectionTitle>Documentation & Guidelines</SectionTitle>
      <Divider />
      
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "2rem" }}>
        Welcome to the CV & AI Lab documentation center. Here you can find all necessary guidelines, policies, and procedures required for working in the lab and utilizing our resources effectively.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {DOCS.map((doc, idx) => (
          <Card key={idx} style={{ padding: "1.5rem", borderTop: \`3px solid \${T.navy}\`, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: \`\${T.navy}10\`, color: T.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderIcon(doc.icon, { size: 24 })}
              </div>
              <h3 style={{ margin: 0, color: T.navyDark, fontSize: "1.1rem" }}>{doc.title}</h3>
            </div>
            <p style={{ color: T.textMid, fontSize: ".9rem", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>{doc.desc}</p>
            <div>
              <a href={doc.link} style={{ display: "inline-block", color: T.navy, fontWeight: 600, fontSize: ".85rem", textDecoration: "none", padding: ".4rem .8rem", background: T.surfaceAlt, borderRadius: "6px", border: \`1px solid \${T.border}\` }}>
                Read Document →
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "3rem", padding: "2rem", background: T.surfaceAlt, borderRadius: "12px", border: \`1px solid \${T.border}\` }}>
        <h3 style={{ margin: "0 0 1rem 0", color: T.navyDark }}>Need further assistance?</h3>
        <p style={{ color: T.textMid, fontSize: ".9rem", margin: "0 0 1rem 0" }}>
          If you cannot find the information you are looking for, please reach out to the Lab Administrator or Technical Officer.
        </p>
        <a href="mailto:cvailab@pdn.ac.lk" style={{ color: T.gold, fontWeight: 600, textDecoration: "none" }}>Contact Support</a>
      </div>
    </div>
  );
}
