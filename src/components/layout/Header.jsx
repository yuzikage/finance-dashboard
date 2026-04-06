import { useAppContext } from "../../hooks/useAppContext";
import { NAV } from "../../data/constants";
import S from "../../styles/tokens";

export default function Header({ page, setPage }) {
    const { state, dispatch } = useAppContext();
    return (
        <div style={{ background:"#fff", borderBottom:"1px solid #EBEBEB", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", height:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:40 }}>
              <div style={{ width:28, height:28, background:"#111", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>₹</span>
              </div>
              <span style={{ fontWeight:700, fontSize:15, letterSpacing:"-0.3px", color:"#111" }}>Fintrack</span>
            </div>

            <nav style={{ display:"flex", gap:2, flex:1 }}>
              {NAV.map(n => (
                <button key={n.id} onClick={() => setPage(n.id)} style={{ background:"none", border:"none", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, color: page===n.id ? "#111" : "#888", background: page===n.id ? "#F2F2F0" : "transparent", transition:"all 0.15s" }}>
                  {n.label}
                </button>
              ))}
            </nav>

            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:12, color:"#999", fontWeight:500 }}>Role:</span>
                <select style={{ ...S.select, fontSize:12, padding:"5px 8px", borderRadius:6 }} value={state.role} onChange={e => dispatch({ type:"SET_ROLE", payload: e.target.value })}>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ width:30, height:30, borderRadius:"50%", background: state.role==="admin" ? "#111" : "#E8E8E8", transition:"background 0.2s ease", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color: state.role==="admin" ? "#fff" : "#555" }}>
                {state.role==="admin" ? "A" : "V"}
              </div>
            </div>
          </div>
        </div>
    )
}