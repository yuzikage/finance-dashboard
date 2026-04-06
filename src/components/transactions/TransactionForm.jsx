import { useState } from "react";
import S from "../../styles/tokens";
import { CATEGORIES } from "../../data/constants";

export default function TransactionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { date:"", description:"", amount:"", category:"Food & Dining", type:"expense" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.date && form.description && form.amount > 0;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div><label style={S.label}>Type</label>
        <div style={{ display:"flex", gap:8 }}>
          {["expense","income"].map(t => (
            <button key={t} onClick={() => set("type", t)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${form.type===t ? "var(--text-primary)" : "var(--border-color)"}`, background: form.type===t ? "var(--text-primary)" : "var(--bg-card)", color: form.type===t ? "var(--bg-card)" : "var(--text-secondary)", fontWeight:500, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
      </div>
      <div><label style={S.label}>Description</label><input style={S.input} value={form.description} onChange={e => set("description", e.target.value)} placeholder="What was this for?" /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div><label style={S.label}>Amount (₹)</label><input style={S.input} type="number" value={form.amount} onChange={e => set("amount", parseFloat(e.target.value))} placeholder="0" /></div>
        <div><label style={S.label}>Date</label><input style={S.input} type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
      </div>
      <div><label style={S.label}>Category</label>
        <select style={{ ...S.select, width:"100%" }} value={form.category} onChange={e => set("category", e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button style={{ ...S.btnOutline, flex:1 }} onClick={onClose}>Cancel</button>
        <button style={{ ...S.btn, flex:1, opacity: valid ? 1 : 0.4 }} disabled={!valid} onClick={() => valid && onSave(form)}>Save Transaction</button>
      </div>
    </div>
  );
}