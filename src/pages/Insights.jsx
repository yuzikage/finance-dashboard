import { fmt, fmtShort, parseMonth } from "../utils/formatters";
import { MONTHS, CATEGORY_COLORS } from "../data/constants";
import { useAppContext } from "../hooks/useAppContext";
import S from "../styles/tokens";

export default function Insights() {
  const { state } = useAppContext();
  const txns = state.transactions;

  const byCategory = useMemo(() => {
    const map = {};
    txns.filter(t => t.type==="expense").forEach(t => { map[t.category] = (map[t.category]||0)+t.amount; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  }, [txns]);

  const byMonth = useMemo(() => {
    const map = {};
    txns.forEach(t => {
      const m = parseMonth(t.date);
      if (!map[m]) map[m] = { income:0, expense:0 };
      map[m][t.type] += t.amount;
    });
    return Object.entries(map).sort().map(([k,v]) => ({ month: MONTHS[parseInt(k.split("-")[1])-1], ...v, net: v.income-v.expense }));
  }, [txns]);

  const topCat = byCategory[0];
  const totalExpenses = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const totalIncome = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const savingsRate = totalIncome ? ((totalIncome-totalExpenses)/totalIncome*100).toFixed(1) : 0;
  const lastMonth = byMonth[byMonth.length-1];
  const prevMonth = byMonth[byMonth.length-2];
  const spendingChange = prevMonth && lastMonth ? (((lastMonth.expense-prevMonth.expense)/prevMonth.expense)*100).toFixed(1) : null;

  const insightCards = [
    {
      icon: "🏷️", color:"#4A90D9", bg:"#EFF6FF",
      title: "Top Spending Category",
      value: topCat ? topCat[0] : "—",
      detail: topCat ? `${fmt(topCat[1])} spent · ${((topCat[1]/totalExpenses)*100).toFixed(0)}% of total` : "No data",
    },
    {
      icon: "💰", color: savingsRate >= 20 ? "#27AE60" : "#E84A7A", bg: savingsRate >= 20 ? "#F0FBF4" : "#FFF0F4",
      title: "Savings Rate",
      value: `${savingsRate}%`,
      detail: savingsRate >= 20 ? "Healthy savings rate ✓" : "Consider reducing expenses",
    },
    {
      icon: "📈", color:"#7B68EE", bg:"#F4F2FF",
      title: "Monthly Trend",
      value: spendingChange !== null ? `${spendingChange > 0 ? "+" : ""}${spendingChange}%` : "—",
      detail: spendingChange !== null ? `Spending vs previous month` : "Need more data",
    },
    {
      icon: "⚖️", color:"#E8854A", bg:"#FFF5EE",
      title: "Income vs Expenses",
      value: fmt(totalIncome - totalExpenses),
      detail: `Net position across all months`,
    },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14 }}>
        {insightCards.map((c, i) => (
          <div key={i} style={{ ...S.card, borderTop:`3px solid ${c.color}` }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontSize:12, color:"#999", fontWeight:500, marginBottom:4 }}>{c.title}</div>
            <div style={{ fontSize:22, fontWeight:700, color:c.color }}>{c.value}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:4 }}>{c.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={S.card}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:16 }}>Spending by Category</div>
          {byCategory.length === 0 ? <div style={{ color:"#aaa", fontSize:13 }}>No expense data</div> : byCategory.map(([cat, val], i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, color:"#555" }}>{cat}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#111" }}>{fmt(val)}</span>
              </div>
              <div style={{ height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", background:CATEGORY_COLORS[cat]||"#ccc", borderRadius:3, width:`${(val/byCategory[0][1])*100}%`, transition:"width 0.4s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:16 }}>Month-over-Month</div>
          {byMonth.length === 0 ? <div style={{ color:"#aaa", fontSize:13 }}>No data</div> : byMonth.map((m, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:13, fontWeight:500, color:"#333" }}>{m.month}</span>
                <span style={{ fontSize:12, fontWeight:600, color: m.net >= 0 ? "#27AE60" : "#E84A7A" }}>{m.net >= 0 ? "+" : ""}{fmt(m.net)}</span>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                <div style={{ flex: m.income, height:8, background:"#27AE6040", borderRadius:3 }}>
                  <div style={{ height:"100%", background:"#27AE60", borderRadius:3, width:"100%" }} />
                </div>
                <div style={{ flex: m.expense, height:8, background:"#E84A7A40", borderRadius:3 }}>
                  <div style={{ height:"100%", background:"#E84A7A", borderRadius:3, width:"100%" }} />
                </div>
              </div>
              <div style={{ display:"flex", gap:12, marginTop:3 }}>
                <span style={{ fontSize:11, color:"#888" }}>Income: {fmtShort(m.income)}</span>
                <span style={{ fontSize:11, color:"#888" }}>Exp: {fmtShort(m.expense)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontSize:13, fontWeight:600, color:"#111", marginBottom:4 }}>Key Observations</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:12 }}>
          {[
            byCategory[0] && `Your highest expense is in ${byCategory[0][0]} (${fmt(byCategory[0][1])}), accounting for ${((byCategory[0][1]/totalExpenses)*100).toFixed(0)}% of total spending.`,
            savingsRate > 0 && `You are saving ${savingsRate}% of your income. ${Number(savingsRate) >= 20 ? "Great job — you're above the recommended 20% threshold." : "Try to increase savings to at least 20% of income."}`,
            spendingChange !== null && `Your spending ${Number(spendingChange) > 0 ? "increased" : "decreased"} by ${Math.abs(spendingChange)}% compared to the previous month.`,
            byCategory.length > 2 && `You spend across ${byCategory.length} categories. Consider consolidating discretionary spend in ${byCategory[1]?.[0]} and ${byCategory[2]?.[0]}.`,
          ].filter(Boolean).map((obs, i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 14px", background:"#F9F9F9", borderRadius:8, fontSize:13, color:"#444", lineHeight:1.6 }}>
              <span style={{ color:"#4A90D9", flexShrink:0, marginTop:1 }}>→</span>
              {obs}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}