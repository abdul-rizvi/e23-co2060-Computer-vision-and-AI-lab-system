import { useState } from "react";
import { LuCamera, LuServer, LuWrench } from "react-icons/lu";
import { T } from "../styles/theme";

export function EquipmentPhoto({ item }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const Icon = /server|comput|gpu/i.test(`${item.name} ${item.category}`) ? LuServer
    : /camera|sensor/i.test(`${item.name} ${item.category}`) ? LuCamera : LuWrench;
  return <div style={{ height: 170, marginBottom: "1rem", borderRadius: 12, overflow: "hidden", background: T.surfaceAlt }}>
    {item.image_url && failedUrl !== item.image_url ?
      <img src={item.image_url} alt={item.name} loading="lazy" onError={() => setFailedUrl(item.image_url)} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> :
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".6rem", color: T.textMid }}>
        <Icon size={46} aria-hidden="true" />
        <span>Equipment photo pending</span>
        <small>Illustration placeholder</small>
      </div>}
  </div>;
}
