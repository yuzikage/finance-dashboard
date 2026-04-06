import { fmtShort } from "../../utils/formatters";
import { CATEGORY_COLORS } from "../../data/constants";

export default function DonutChart({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontSize:13 }}>No data</div>;
  let cumulative = 0;
  const r = 52, cx = size/2, cy = size/2;
  const segments = data.map(d => {
    const angle = (d.value / total) * 360;
    const start = cumulative;
    cumulative += angle;
    return { ...d, start, angle };
  });
  const polarToXY = (angle, radius) => {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const describeArc = (start, angle) => {
    if (angle >= 359.99) {
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }
    const s = polarToXY(start, r);
    const e = polarToXY(start + angle, r);
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${e.x} ${e.y} Z`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => (
        <path key={i} d={describeArc(seg.start, seg.angle)} fill={CATEGORY_COLORS[seg.label] || "#ccc"} stroke="#fff" strokeWidth={2}>
          <title>{seg.label}: {fmtShort(seg.value)} ({((seg.value/total)*100).toFixed(1)}%)</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={32} fill="white" />
      <text x={cx} y={cy-6} textAnchor="middle" fontSize={10} fill="#888" fontWeight={500}>Total</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize={11} fill="#333" fontWeight={600}>{fmtShort(total)}</text>
    </svg>
  );
}