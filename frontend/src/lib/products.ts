import { Product, ProductSpecs } from "@/types";
import { enrichSpecs } from "@/api";

export const SMARTPHONE_CATEGORY_ENDPOINT = "https://dummyjson.com/products/category/smartphones";

export type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  thumbnail?: string;
  images?: string[];
  brand?: string;
};

export type DummyJsonSmartphoneResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

// Re-export SmartphoneProduct alias for compatibility
export type SmartphoneProduct = Product;

export type ProductLoadState =
  | { status: "loading"; products: Product[]; message?: string }
  | { status: "success"; products: Product[]; message?: string }
  | { status: "empty"; products: Product[]; message?: string }
  | { status: "error"; products: Product[]; message?: string };

export async function fetchSmartphones(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(SMARTPHONE_CATEGORY_ENDPOINT, {
    signal,
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`DummyJSON request failed with status ${response.status}`);
  }

  const data = (await response.json()) as DummyJsonSmartphoneResponse;
  if (!data.products || !Array.isArray(data.products)) {
    throw new Error("Invalid response format from DummyJSON API.");
  }

  return data.products.map((product, index) => normalizeSmartphoneProduct(product, index));
}

const QTPHONE_LINES = [
  {
    label: "Ultra Titanium",
    prices: [899, 1049, 1174, 1299, 1399],
    brand: "QTPhone",
    description:
      "pairs grade-5 titanium, Neural Engine 2.0, and a pro camera system for flagship performance in a featherweight frame."
  },
  {
    label: "Pro Cyber",
    prices: [749, 849, 999, 1099, 1199],
    brand: "QTPhone",
    description:
      "is tuned for creators who need cinematic optics, 120Hz ProMotion, and all-day endurance without slowing down."
  },
  {
    label: "Fold Apex",
    prices: [1299, 1399, 1499, 1649, 1799],
    brand: "QTPhone",
    description:
      "expands into a larger workspace while keeping titanium strength, adaptive multitasking, and AI-assisted productivity close at hand."
  }
];

function getQtPhonePrice(product: DummyJsonProduct, index: number, priceOptions: number[]) {
  const basePrice = priceOptions[index % priceOptions.length];
  const apiVariance = product.price ? Math.round((product.price % 90) / 10) * 10 : 0;
  return basePrice + apiVariance;
}

function buildQtPhoneTitle(apiTitle: string | undefined, lineLabel: string, index: number) {
  const cleanedModel = (apiTitle || "")
    .replace(/^(apple|samsung|huawei|oppo|realme|vivo|xiaomi|motorola|oneplus)\s*/i, "")
    .replace(/^iphone\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const apiModel = cleanedModel || `${16 - (index % 4)} Series`;

  return `QTPhone ${apiModel} ${lineLabel}`;
}

export function normalizeSmartphoneProduct(product: DummyJsonProduct, index = 0): Product {
  const modelProfile = QTPHONE_LINES[index % QTPHONE_LINES.length];
  const normalizedTitle = buildQtPhoneTitle(product.title, modelProfile.label, index);
  const enrichedSpecs: ProductSpecs = enrichSpecs(product as Record<string, unknown>);

  return {
    id: product.id,
    title: normalizedTitle,
    name: normalizedTitle,
    brand: modelProfile.brand,
    price: getQtPhonePrice(product, index, modelProfile.prices),
    discountPercentage: product.discountPercentage || 12,
    rating: product.rating || 4.8,
    stock: product.stock || 50,
    thumbnail: product.thumbnail || (product.images && product.images[0]) || "",
    images: product.images && product.images.length > 0 ? product.images : [product.thumbnail || ""],
    description: `${normalizedTitle} ${modelProfile.description}`,
    specs: enrichedSpecs
  };
}
