import { useState } from "react";
import { Button, Card } from "./UI";
import { T } from "../styles/theme";

const STOPS = [
  { title: "Entrance", text: "Check in with the Technical Officer and confirm your approved reservation before entering.", x: 20, y: 140 },
  { title: "Server area", text: "High-performance computing for model training and research. Request a server slot from Book Resource.", x: 20, y: 20 },
  { title: "Vision workbench", text: "Cameras and sensors for image capture and computer vision experiments. Ask staff for handling instructions.", x: 230, y: 20 },
  { title: "Project space", text: "A shared area for student projects, demonstrations, and supervised equipment use.", x: 230, y: 140 },
];

export function VirtualLabTour() {
  const [stop, setStop] = useState(0);
  return <Card style={{ padding: "1.5rem", maxWidth: 900 }}>
    <p>Interactive demo walkthrough — this illustration is a placeholder, not a recording or the actual lab layout.</p>
    <svg viewBox="0 0 440 250" role="img" aria-label={`Illustrated lab layout. Current stop: ${STOPS[stop].title}`} style={{ width: "100%", maxHeight: 320, background: T.surfaceAlt, borderRadius: 12 }}>
      {STOPS.map((station, index) => <g key={station.title}>
        <rect x={station.x} y={station.y} width="190" height="90" rx="12" fill={index === stop ? T.navy : T.border} />
        <text x={station.x + 95} y={station.y + 50} textAnchor="middle" fill={index === stop ? T.white : T.navyDark} fontSize="14">{index + 1}. {station.title}</text>
      </g>)}
    </svg>
    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "1rem" }}>
      {STOPS.map((station, index) => <Button key={station.title} variant={index === stop ? "primary" : "outline"} onClick={() => setStop(index)} aria-pressed={index === stop}>{station.title}</Button>)}
    </div>
    <div aria-live="polite"><h3>{STOPS[stop].title}</h3><p>{STOPS[stop].text}</p></div>
    <Button variant="outline" onClick={() => setStop((stop + 1) % STOPS.length)}>Next stop</Button>
  </Card>;
}
