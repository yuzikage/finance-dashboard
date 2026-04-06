export default function SparkLine({ values, color = "#4A90D9", height = 40 }) {
  if (!values.length) return null;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const w = 200, h = height;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}