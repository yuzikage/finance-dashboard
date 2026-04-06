import { fmt } from "../../utils/formatters";


export default function BarChart({ data, height = 180 }) {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
  if (!max) return <div style={{ height, display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontSize:13 }}>No data</div>;
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height, padding:"0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, height:"100%" }}>
          <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end", gap:3 }}>
            <div title={`Income: ${fmt(d.income)}`} style={{ flex:1, background:"#27AE60", borderRadius:"3px 3px 0 0", height:`${(d.income/max)*100}%`, minHeight:2, transition:"height 0.4s ease", cursor:"pointer" }} />
            <div title={`Expenses: ${fmt(d.expenses)}`} style={{ flex:1, background:"#E84A7A", borderRadius:"3px 3px 0 0", height:`${(d.expenses/max)*100}%`, minHeight:2, transition:"height 0.4s ease", cursor:"pointer" }} />
          </div>
          <span style={{ fontSize:11, color:"#888", fontWeight:500, marginTop:4 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}