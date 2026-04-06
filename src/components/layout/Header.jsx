import { useAppContext } from "../../hooks/useAppContext";
import { NAV } from "../../data/constants";
import S from "../../styles/tokens";

export default function Header({ page, setPage }) {
    const { state, dispatch } = useAppContext();
    return (
        <div style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-color)",
            position: "sticky", top: 0, zIndex: 100,
            transition: "background 0.3s ease",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 56 }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 40 }}>
                    <div style={{ width: 28, height: 28, background: "var(--text-primary)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--bg-primary)", fontSize: 14, fontWeight: 700 }}>₹</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>Fintrack</span>
                </div>

                <nav style={{ display: "flex", gap: 2, flex: 1 }}>
                {NAV.map(n => (
                    <button key={n.id} onClick={() => setPage(n.id)} style={{
                    background: page === n.id ? (state.darkMode ? "#2C2C2E" : "#EBEBEB") : "transparent",
                    border: "none", padding: "6px 14px", borderRadius: 8,
                    cursor: "pointer", fontSize: 13, fontWeight: 500,
                    color: page === n.id ? "var(--text-primary)" : "var(--text-muted)",
                    transition: "all 0.15s",
                    }}>
                    {n.label}
                    </button>
                ))}
                </nav>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Dark mode toggle */}
                    <button
                        onClick={() => dispatch({ type: "TOGGLE_DARK" })}
                        style={{
                        background: "none", border: "1px solid var(--border-input)",
                        borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 15,
                        transition: "border-color 0.15s ease",
                        }}
                    >
                        {state.darkMode ? "☀️" : "🌙"}
                    </button>

                    {/* Role switcher */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Role:</span>
                        <select
                        style={{ ...S.select, fontSize: 12, padding: "5px 8px", borderRadius: 6 }}
                        value={state.role}
                        onChange={e => dispatch({ type: "SET_ROLE", payload: e.target.value })}
                        >
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Avatar */}
                    <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: state.role === "admin" ? "var(--text-primary)" : (state.darkMode ? "#3A3A3C" : "#E0E0E0"),
                        border: "1px solid var(--border-color)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 600,
                        color: state.role === "admin" ? "var(--bg-primary)" : "var(--text-secondary)",
                        transition: "background 0.2s ease",
                    }}>
                        {state.role === "admin" ? "A" : "V"}
                    </div>
                </div>
            </div>
        </div>
  );
}