import { useAppContext } from "../../hooks/useAppContext";

export default function RoleBanner(){
    const { state } = useAppContext();
    if (state.role !== "viewer") return null;

    return (
    <div style={{
      background: state.darkMode ? "#1A2535" : "#EFF6FF",
      borderBottom: `1px solid ${state.darkMode ? "#1E3A5F" : "#DBEAFE"}`,
      padding: "8px 24px",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", fontSize:12, color:"#3B82F6" }}>
        <strong>Viewer mode</strong> — You can view all data but cannot add, edit or delete transactions. Switch to Admin to make changes.
      </div>
    </div>
  );
}