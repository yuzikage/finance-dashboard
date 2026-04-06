export default function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
        <div style={{
            background: "var(--bg-card)", borderRadius: 16, padding: 28,
            width: 440, maxWidth: "90vw",
            border: "1px solid var(--border-color)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            animation: "modalIn 0.3s ease",
            }} 
            onClick={e => e.stopPropagation()}
        >   
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>{title}</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)", lineHeight: 1 }}>×</button>
            </div>
            {children}
        </div>
    </div>
  );
}