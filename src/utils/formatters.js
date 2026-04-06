export const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const fmtShort = (n) => n >= 1000 ? `₹${(n/1000).toFixed(1)}k` : `₹${Math.round(n)}`;

export const parseMonth = (d) => d.slice(0, 7);