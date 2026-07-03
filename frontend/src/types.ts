export interface ProductSpecs {
  screenSize: string;
  displayType: string;
  refreshRate: string;
  processor: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  os: string;
  ram: string;
  storage: string;
  colors?: string[];
}

export interface Product {
  id: number;
  title: string;
  name?: string;
  brand: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images?: string[];
  description: string;
  specs: ProductSpecs;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface TelemetryEvent {
  id?: string | number;
  type: "navigation" | "scroll-depth" | "favorite" | "cart" | "click" | "newsletter" | "chatbot" | string;
  label: string;
  metadata?: Record<string, unknown>;
  timestamp: Date | string | number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  mode?: "AI" | "Demo";
}
