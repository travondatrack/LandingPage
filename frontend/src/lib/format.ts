const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

export function formatPrice(value: number) {
  return currencyFormatter.format(value);
}

export function formatDiscount(value: number) {
  return `${percentFormatter.format(value)}% off`;
}

export function formatRating(value: number) {
  return `${value.toFixed(1)} / 5`;
}

export function formatStock(value: number) {
  if (value > 20) {
    return "Ready to ship";
  }

  if (value > 0) {
    return `${value} left`;
  }

  return "Restocking soon";
}

export function formatSpecValue(value: string) {
  return value.replaceAll("-", " ");
}
