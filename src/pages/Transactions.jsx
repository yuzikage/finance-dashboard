import { useState, useMemo, useEffect } from "react";
import {fmt} from "../utils/formatters";
import { CATEGORIES, CATEGORY_COLORS } from "../data/constants";
import { useAppContext } from "../hooks/useAppContext";
import S from "../styles/tokens";
import Modal from "../components/ui/Modal";
import TransactionForm from "../components/transactions/TransactionForm";

export default function Transactions() {
    const { state, dispatch } = useAppContext();
    const { transactions, filters, sortBy, sortDir, role } = state;
    const [showAdd, setShowAdd] = useState(false);
    const [editTxn, setEditTxn] = useState(null);
    const [showExport, setShowExport] = useState(false);

    const isAdmin = role === "admin";

    const filtered = useMemo(() => {
    let t = [...transactions];
    if (filters.type !== "all") t = t.filter(x => x.type === filters.type);
    if (filters.category !== "all") t = t.filter(x => x.category === filters.category);
    if (filters.search) t = t.filter(x => x.description.toLowerCase().includes(filters.search.toLowerCase()) || x.category.toLowerCase().includes(filters.search.toLowerCase()));
    t.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "date") cmp = new Date(a.date) - new Date(b.date);
        else if (sortBy === "amount") cmp = a.amount - b.amount;
        else if (sortBy === "description") cmp = a.description.localeCompare(b.description);
        return sortDir === "asc" ? cmp : -cmp;
    });
    return t;
    }, [transactions, filters, sortBy, sortDir]);

    const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ color:"#ccc" }}>↕</span>;
    return <span style={{ color:"#111" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
    };

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("[data-export-dropdown]")) setShowExport(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const exportCSV = () => {
        const header = "Date,Description,Category,Type,Amount\n";
        const rows = transactions.map(t => 
            `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
        ).join("\n");
        triggerDownload(header + rows, "transactions.csv", "text/csv");
        };

        const exportJSON = () => {
        const data = JSON.stringify(transactions, null, 2);
        triggerDownload(data, "transactions.json", "application/json");
        };

        const triggerDownload = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setShowExport(false);
    };
    
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Filters */}
      <div style={{ ...S.card, padding:"16px 20px" }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <input style={{ ...S.input, width:220 }} placeholder="Search transactions..." value={filters.search} onChange={e => dispatch({ type:"SET_FILTER", payload:{ search: e.target.value } })} />
          <select style={S.select} value={filters.type} onChange={e => dispatch({ type:"SET_FILTER", payload:{ type: e.target.value } })}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select style={S.select} value={filters.category} onChange={e => dispatch({ type:"SET_FILTER", payload:{ category: e.target.value } })}>
            <option value="all">All categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <div style={{ position:"relative" }} data-export-dropdown>
                <button
                    style={S.btnOutline}
                    onClick={() => setShowExport(v => !v)}
                >
                    Export ▾
                </button>
                {showExport && (
                    <div style={{
                    position:"absolute", top:"calc(100% + 6px)", right:0,
                    background:"#fff", border:"1px solid #E8E8E8", borderRadius:10,
                    boxShadow:"0 4px 20px rgba(0,0,0,0.08)", zIndex:50,
                    minWidth:140, overflow:"hidden"
                    }}>
                    {[["CSV", exportCSV], ["JSON", exportJSON]].map(([label, fn]) => (
                        <button key={label} onClick={fn} style={{
                        display:"block", width:"100%", padding:"10px 16px",
                        background:"none", border:"none", textAlign:"left",
                        fontSize:13, color:"#333", cursor:"pointer",
                        borderBottom: label==="CSV" ? "1px solid #F5F5F5" : "none",
                        }}
                        onMouseEnter={e => e.target.style.background = "#F7F7F5"}
                        onMouseLeave={e => e.target.style.background = "none"}
                        >
                        Download {label}
                        </button>
                    ))}
                    </div>
                )}
            </div>
            {isAdmin && <button style={S.btn} onClick={() => setShowAdd(true)}>+ Add</button>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#FAFAFA", borderBottom:"1px solid #F0F0F0" }}>
                {[["date","Date"],["description","Description"],["category","Category"],["type","Type"],["amount","Amount"]].map(([col, label]) => (
                  <th key={col} style={{ padding:"12px 16px", textAlign:"left", fontWeight:500, color:"#777", fontSize:12, letterSpacing:"0.3px", whiteSpace:"nowrap", cursor:"pointer", userSelect:"none" }}
                    onClick={() => dispatch({ type:"SET_SORT", payload: col })}>
                    {label} <SortIcon col={col} />
                  </th>
                ))}
                {isAdmin && <th style={{ padding:"12px 16px", textAlign:"right", fontWeight:500, color:"#777", fontSize:12 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} style={{ padding:"40px", textAlign:"center", color:"#aaa", fontSize:14 }}>No transactions found</td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom:"1px solid #F8F8F8", background: i%2===0 ? "#fff" : "#FDFCFC" }}>
                  <td style={{ padding:"12px 16px", color:"#666", whiteSpace:"nowrap" }}>{new Date(t.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</td>
                  <td style={{ padding:"12px 16px", color:"#111", fontWeight:500 }}>{t.description}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background: `${CATEGORY_COLORS[t.category]}20`, color: CATEGORY_COLORS[t.category] || "#555", ...S.badge(CATEGORY_COLORS[t.category], `${CATEGORY_COLORS[t.category]}18`) }}>{t.category}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={t.type==="income" ? S.badge("#1a8a4a","#E8F8EF") : S.badge("#c73060","#FEF0F5")}>{t.type}</span>
                  </td>
                  <td style={{ padding:"12px 16px", fontWeight:600, color: t.type==="income" ? "#27AE60" : "#E84A7A" }}>
                    {t.type==="income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  {isAdmin && (
                    <td style={{ padding:"12px 16px", textAlign:"right" }}>
                      <button style={{ ...S.btnOutline, padding:"4px 10px", fontSize:12, marginRight:6 }} onClick={() => setEditTxn(t)}>Edit</button>
                      <button style={{ background:"#FFF0F4", color:"#E84A7A", border:"1px solid #FCCDD9", borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer" }} onClick={() => dispatch({ type:"DELETE_TRANSACTION", payload: t.id })}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"10px 16px", borderTop:"1px solid #F0F0F0", fontSize:12, color:"#aaa" }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      {showAdd && (
        <Modal title="Add Transaction" onClose={() => setShowAdd(false)}>
          <TransactionForm onSave={(f) => { dispatch({ type:"ADD_TRANSACTION", payload: f }); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
      {editTxn && (
        <Modal title="Edit Transaction" onClose={() => setEditTxn(null)}>
          <TransactionForm initial={editTxn} onSave={(f) => { dispatch({ type:"EDIT_TRANSACTION", payload: { ...f, id: editTxn.id } }); setEditTxn(null); }} onClose={() => setEditTxn(null)} />
        </Modal>
      )}
    </div>
  );
}