import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { NAV } from "./data/constants";
import Header from "./components/layout/Header";
import RoleBanner from "./components/layout/RoleBanner";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import "./styles/App.css";

export default function App() {
  const [page, setPage] = useState("overview");

  return (
    <AppProvider>
      <div style={{minHeight:"100vh", background:"#F7F7F5", fontFamily:"'Geist', 'DM Sans', system-ui, sans-serif", color:"#111" }}>
        <Header page={page} setPage={setPage} />
        <RoleBanner />
        <div style={{maxWidth:1100, margin: "0 auto", padding:"28px 24px"}}>
          <div style={{ marginBottom:20 }}>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:"#111", letterSpacing:"-0.5px" }}>
              {NAV.find(n=>n.id===page)?.label}
            </h1>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#999" }}>
              {page==="overview" && "Your financial summary at a glance"}
              {page==="transactions" && "Browse and manage all your transactions"}
              {page==="insights" && "Understand your spending patterns"}
            </p>
          </div>

          {page === "overview" && <Overview />}
          {page === "transactions" && <Transactions />}
          {page === "insights" && <Insights />}
        </div>
      </div>
    </AppProvider>  
  );
}