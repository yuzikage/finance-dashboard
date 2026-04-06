import { INITIAL_TRANSACTIONS } from "../data/mockTransactions";

export const initialState = {
  transactions: JSON.parse(localStorage.getItem("fin_transactions") || "null") || INITIAL_TRANSACTIONS,
  role: "viewer",
  filters: { type: "all", category: "all", search: "" },
  sortBy: "date",
  sortDir: "desc",
  darkMode: false,
};

export default function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE": return { ...state, role: action.payload };
    case "SET_FILTER": return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT": return {
      ...state,
      sortBy: action.payload,
      sortDir: state.sortBy === action.payload && state.sortDir === "asc" ? "desc" : "asc",
    };
    case "ADD_TRANSACTION": {
      const next = [...state.transactions, { ...action.payload, id: Date.now() }];
      localStorage.setItem("fin_transactions", JSON.stringify(next));
      return { ...state, transactions: next };
    }
    case "EDIT_TRANSACTION": {
      const next = state.transactions.map(t => t.id === action.payload.id ? action.payload : t);
      localStorage.setItem("fin_transactions", JSON.stringify(next));
      return { ...state, transactions: next };
    }
    case "DELETE_TRANSACTION": {
      const next = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem("fin_transactions", JSON.stringify(next));
      return { ...state, transactions: next };
    }
    case "TOGGLE_DARK": return { ...state, darkMode: !state.darkMode };
    default: return state;
  }
}