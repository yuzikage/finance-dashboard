import { useMemo } from "react";
import { fmt, fmtShort, parseMonth } from "../utils/formatters";
import { MONTHS, CATEGORY_COLORS } from "../data/constants";
import { useAppContext } from "../hooks/useAppContext";
import BarChart from "../components/charts/BarChart";
import DonutChart from "../components/charts/DonutChart";
import SparkLine from "../components/charts/SparkLine";
import S from "../styles/tokens";

export default function Overview() {
  const { state } = useAppContext();
  const txns = state.transactions;

  const totalIncome = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const byMonth = useMemo(() => {
    const map = {};
    txns.forEach(t => {
      const m = parseMonth(t.date);
      if (!map[m]) map[m] = { income: 0, expenses: 0 };
      t.type === "income" ? (map[m].income += t.amount) : (map[m].expenses += t.amount);
    });
    return Object.entries(map).sort().map(([k, v]) => ({ label: MONTHS[parseInt(k.split("-")[1]) - 1], ...v }));
  }, [txns]);

  const byCategory = useMemo(() => {
    const map = {};
    txns.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,6).map(([label, value]) => ({ label, value }));
  }, [txns]);

  const balanceTrend = byMonth.map(m => m.income - m.expenses);

  const metrics = [
    { label:"Total Balance", value: fmt(balance), sub: `${savingsRate}% savings rate`, color: balance >= 0 ? "#27AE60" : "#E84A7A", bg: balance >= 0 ? "#F0FBF4" : "#FFF0F4" },
    { label:"Total Income", value: fmt(totalIncome), sub: `${txns.filter(t=>t.type==="income").length} transactions`, color:"#27AE60", bg:"#F0FBF4" },
    { label:"Total Expenses", value: fmt(totalExpenses), sub: `${txns.filter(t=>t.type==="expense").length} transactions`, color:"#E84A7A", bg:"#FFF0F4" },
    { label:"Avg Monthly Spend", value: fmt(byMonth.length ? totalExpenses / byMonth.length : 0), sub: `Over ${byMonth.length} months`, color:"#4A90D9", bg:"#F0F6FF" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ ...S.card, borderLeft:`4px solid ${m.color}` }}>
            <div style={{ fontSize:12, fontWeight:500, color:"#999", letterSpacing:"0.4px", textTransform:"uppercase", marginBottom:6 }}>{m.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color:"#111", lineHeight:1.2 }}>{m.value}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={S.card}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:4 }}>Monthly Overview</div>
          <div style={{ fontSize:12, color:"#999", marginBottom:16 }}>Income vs expenses by month</div>
          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
            {[["#27AE60","Income"],["#E84A7A","Expenses"]].map(([c,l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#666" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }} />{l}
              </span>
            ))}
          </div>
          <BarChart data={byMonth} height={160} />
        </div>

        <div style={S.card}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:4 }}>Spending Breakdown</div>
          <div style={{ fontSize:12, color:"#999", marginBottom:16 }}>By category</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <DonutChart data={byCategory} size={140} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
              {byCategory.map((d, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:CATEGORY_COLORS[d.label]||"#ccc", display:"inline-block", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#555", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:90 }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:"#111", flexShrink:0 }}>{fmtShort(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:4 }}>Balance Trend</div>
        <div style={{ fontSize:12, color:"#999", marginBottom:12 }}>Net savings across months</div>
        <SparkLine values={balanceTrend} color="#4A90D9" height={56} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          {byMonth.map((m, i) => <span key={i} style={{ fontSize:11, color:"#aaa" }}>{m.label}</span>)}
        </div>
      </div>
    </div>
  );
}