# Fintrack — Personal Finance Dashboard

A clean, minimal financial dashboard built with React for tracking income, expenses, and spending patterns. Built as a frontend evaluation assignment.

---

## Tech Stack

- **React 18** with Vite
- **Context API + useReducer** for global state management
- **localStorage** for data persistence
- **Vanilla inline styles + tokens** for styling (no CSS framework)
- No external chart libraries — all visualisations built with raw SVG

---

## Getting Started

### Prerequisites

- Node.js `v22.15.0`
- npm `v11.4.2`

### Installation

```bash
# Clone the repository
git clone https://github.com/yuzikage/finance-dashboard.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

---

## Project Structure

```
src/
├── main.jsx                          # App entry point
├── App.jsx                           # Root shell, page routing, AppProvider wrapper
│
├── context/
│   └── AppContext.jsx                # Global state — reducer, initialState, AppProvider
│
├── data/
│   ├── constants.js                  # CATEGORIES, CATEGORY_COLORS, MONTHS, NAV
│   └── mockTransactions.js           # 30 seed transactions (used on first load only)
│
├── utils/
│   └── formatters.js                 # fmt(), fmtShort(), parseMonth() pure utilities
│
├── hooks/
│   └── useAppContext.js              # Typed context hook with provider guard
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx                # Top nav, role switcher, dark mode toggle
│   │   └── RoleBanner.jsx            # Viewer mode info strip
│   ├── charts/
│   │   ├── BarChart.jsx              # Monthly income vs expense bars
│   │   ├── DonutChart.jsx            # Category spending donut (raw SVG)
│   │   └── SparkLine.jsx             # Balance trend line
│   ├── ui/
│   │   └── Modal.jsx                 # Reusable overlay modal
│   └── transactions/
│       └── TransactionForm.jsx       # Add/edit transaction form
│
├── pages/
│   ├── Overview.jsx                  # Summary cards, charts, balance trend
│   ├── Transactions.jsx              # Full transaction table with filters and export
│   └── Insights.jsx                  # Spending analysis and observations
│
└── styles/
    ├── App.css                       # Common Styling 
    └── tokens.js                     # Shared style objects (S.card, S.btn, etc.)
```

---

## Features

### Dashboard Overview
- Four summary cards — Total Balance, Income, Expenses, Average Monthly Spend
- Monthly bar chart comparing income vs expenses
- Donut chart breaking down spending by category
- Sparkline showing balance trend across months

### Transactions
- Full transaction table with date, description, category, type, and amount
- Filter by type (income/expense) and category
- Full-text search across description and category
- Sort by any column, ascending or descending
- Export data as CSV or JSON

### Insights
- Highest spending category with percentage of total
- Savings rate with healthy/low threshold indicator
- Month-over-month spending change
- Category spend breakdown with proportional bars
- Auto-generated plain-English observations from the data

### Role-Based UI
Roles are simulated on the frontend via a dropdown in the header. No authentication required.

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard, transactions, insights | ✓ | ✓ |
| Add transactions | ✗ | ✓ |
| Edit transactions | ✗ | ✓ |
| Delete transactions | ✗ | ✓ |
| Export CSV / JSON | ✓ | ✓ |

### State Management
Global state is managed with `useReducer` + `createContext`. The state shape is:

```js
{
  transactions: [],   // full transaction list
  role: "viewer",     // "viewer" | "admin"
  filters: {          // active filter state
    type: "all",
    category: "all",
    search: ""
  },
  sortBy: "date",     // active sort column
  sortDir: "desc",    // "asc" | "desc"
  darkMode: false     // light/dark theme toggle
}
```

All transaction mutations (add, edit, delete) are immediately persisted to `localStorage`. On page load, persisted data takes priority over the mock seed data.

### Data Persistence
Transaction data is saved to `localStorage` under the key `fin_transactions`. The mock data in `mockTransactions.js` is only used on the very first load when no saved data exists. All subsequent loads read from localStorage, so edits, additions, and deletions survive page refresh and server restarts.

### Dark Mode
A toggle in the header (🌙 / ☀️) switches between light and dark themes across all pages, 
charts, modals, and UI components. The preference is applied via a CSS class on the root 
element using CSS custom properties.

### Export
From the Transactions page, data can be exported in two formats:
- **CSV** — compatible with Excel, Google Sheets, and most data tools
- **JSON** — full structured data including all fields

---

## Key Notes

- Currency is fixed to INR (₹) 
- Roles are frontend-only with no authentication — switching roles via the dropdown is intentional for demonstration
- The 30 seed transactions span January to March 2026 to populate charts meaningfully on first load
- Balance is calculated as total all-time income minus total all-time expenses, not a running account balance

---

## What I Would Add With More Time

- Date range filtering in the Transactions view
- Grouping transactions by week or month in the table
- Animated counter on the summary cards
- Unit tests for the reducer and formatter utilities
- A settings page for currency preference and category management