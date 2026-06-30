export const SMARTPHONE_CATEGORY_ENDPOINT = "https://dummyjson.com/products/category/smartphones";

export type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail: string;
  images: string[];
};

export type DummyJsonSmartphoneResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type SmartphoneProduct = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  image: string;
  gallery: string[];
  tags: string[];
  specs: ProductSpec[];
};

export type ProductLoadState =
  | { status: "loading"; products: [] }
  | { status: "success"; products: SmartphoneProduct[] }
  | { status: "empty"; products: [] }
  | { status: "error"; products: []; message: string };

export async function fetchSmartphones(signal?: AbortSignal): Promise<SmartphoneProduct[]> {
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

  return data.products.map(normalizeSmartphoneProduct);
}

export function normalizeSmartphoneProduct(product: DummyJsonProduct): SmartphoneProduct {
  const dimensions = product.dimensions
    ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
    : "Compact handheld build";

  return {
    id: product.id,
    name: product.title,
    brand: product.brand ?? "Smartphone",
    description: product.description,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    image: product.thumbnail || product.images[0],
    gallery: product.images,
    tags: product.tags ?? [],
    specs: [
      { label: "Brand", value: product.brand ?? "Smartphone" },
      { label: "Category", value: product.category },
      { label: "Stock", value: `${product.stock} units ready` },
      { label: "Dimensions", value: dimensions },
      { label: "Warranty", value: product.warrantyInformation ?? "Standard warranty" },
      { label: "Shipping", value: product.shippingInformation ?? "Fast shipping" }
    ]
  };
}
