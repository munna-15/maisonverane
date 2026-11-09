/* Fixed locale avoids server/client hydration mismatches */
const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function pluralizeItems(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`;
}
