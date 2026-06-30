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

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
  stock?: number;
  discountPercentage?: number;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type SmartphoneProduct = {
  id: number;
  productId: string;
  title: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  image: string;
  gallery: string[];
  tags: string[];
  specs: ProductSpec[];
  processor: string;
  camera: string;
  display: string;
  battery: string;
};

export type ProductLoadState =
  | { status: "loading"; products: [] }
  | { status: "success"; products: SmartphoneProduct[] }
  | { status: "empty"; products: [] }
  | { status: "error"; products: []; message: string };

const QTPHONE_MODELS = [
  {
    title: "QTPhone 16 Ultra Titanium",
    processor: "Qualcomm Snapdragon 8 Gen 3 Mobile Platform",
    camera: "200MP Quad Matrix Optics + Leica Studio Lens",
    display: '6.82" 1Hz-144Hz 2K LTPO SuperAMOLED',
    battery: "5600mAh + 120W HyperCharge",
    description: "Crafted with aerospace-grade titanium chassis and neural imaging processing. Delivers peerless photography with its 200MP Quad Matrix optics and all-day 5600mAh endurance."
  },
  {
    title: "QTPhone 16 Pro Cyber Edition",
    processor: "Apple A17 Pro Bionic Architecture (3nm)",
    camera: "48MP Pro Telephoto Matrix + Photonic Engine",
    display: '6.7" ProMotion XDR Retina OLED 120Hz',
    battery: "5200mAh + 90W FlashCharge",
    description: "Engineered for futuristic aesthetic lovers and extreme mobile gaming. Featuring next-gen 3nm neural architecture, custom vapor cooling, and 120Hz ProMotion display."
  },
  {
    title: "QTPhone Fold Apex 5G",
    processor: "Qualcomm Snapdragon 8 Gen 3 Fold Edition",
    camera: "64MP Ultra-Wide FlexCam System + OIS",
    display: '7.9" Seamless Foldable Dynamic AMOLED 2X',
    battery: "5000mAh Dual-Cell Silicon Carbon",
    description: "The pinnacle of foldable smartphone engineering. Seamless zero-gap hinge mechanism paired with dual-screen productivity and revolutionary 64MP Ultra-Wide FlexCam optics."
  },
  {
    title: "QTPhone Air Slim GT",
    processor: "MediaTek Dimensity 9300 4nm Octa-Core",
    camera: "50MP Sony IMX989 Studio Optics",
    display: '6.55" Zero-Bezel FlowAMOLED 144Hz',
    battery: "4800mAh + 67W TurboCharge",
    description: "Impossibly thin profile without compromising flagship power. Equipped with Dimensity 9300 architecture, studio acoustics, and a stunning 144Hz FlowAMOLED display."
  },
  {
    title: "QTPhone 15 Pro Quantum",
    processor: "Google Tensor G3 Titan M2 AI Engine",
    camera: "50MP AI Cinematic Portrait System",
    display: '6.7" Super Actua LTPO OLED HDR10+',
    battery: "5100mAh Wireless Reverse Charge",
    description: "Powered by advanced neural AI processing for real-time live voice translation, generative photo studio tools, and cinematic 8K video recording."
  },
  {
    title: "QTPhone Nova X AI Studio",
    processor: "Qualcomm Snapdragon 8s Gen 3 Mobile SoC",
    camera: "108MP Dual-Aperture Telephoto Pro System",
    display: '6.67" 120Hz Ultra-Bright 3000-Nit OLED',
    battery: "5000mAh Marathon Power Profile",
    description: "Designed specifically for creators and studio photographers with dual-aperture 108MP sensors, AI lighting correction, and a marathon 3000-nit ultra-bright OLED display."
  }
];

function getQTPhoneModelInfo(index: number) {
  if (index < QTPHONE_MODELS.length) {
    return QTPHONE_MODELS[index];
  }
  const seriesNames = ["Apex", "Ultra", "Quantum", "Cyber", "Neo", "Horizon", "Elite"];
  const chips = [
    "Qualcomm Snapdragon 8 Gen 3 Mobile Platform",
    "MediaTek Dimensity 9300 4nm Octa-Core",
    "Qualcomm Snapdragon 8s Gen 3 Mobile SoC"
  ];
  const series = seriesNames[index % seriesNames.length];
  const chip = chips[index % chips.length];

  return {
    title: `QTPhone ${14 + (index % 4)} ${series} 5G`,
    processor: chip,
    camera: "108MP Triple Matrix Studio Lens + OIS",
    display: '6.7" 120Hz ProMotion AMOLED HDR10+',
    battery: "5000mAh + 80W Fast FlashCharge",
    description: `A flagship smart device from QTPhone featuring ${chip}, studio-grade computational camera optics, and all-day intelligent battery efficiency.`
  };
}

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

  return data.products.map((product, index) => normalizeSmartphoneProduct(product, index));
}

export function normalizeSmartphoneProduct(product: DummyJsonProduct, index = 0): SmartphoneProduct {
  const dimensions = product.dimensions
    ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
    : "7.8 x 16.2 x 0.82 cm";

  const modelInfo = getQTPhoneModelInfo(index);
  const qtBrand = "QTPhone";

  return {
    id: product.id,
    productId: String(product.id),
    title: modelInfo.title,
    name: modelInfo.title,
    brand: qtBrand,
    category: product.category || "smartphones",
    description: modelInfo.description,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    thumbnail: product.thumbnail || product.images[0],
    images: product.images,
    image: product.thumbnail || product.images[0],
    gallery: product.images,
    tags: product.tags ?? ["Flagship", "AI Camera", "5G"],
    processor: modelInfo.processor,
    camera: modelInfo.camera,
    display: modelInfo.display,
    battery: modelInfo.battery,
    specs: [
      { label: "Brand", value: qtBrand },
      { label: "Category", value: "Smartphones" },
      { label: "Processor", value: modelInfo.processor },
      { label: "Display", value: modelInfo.display },
      { label: "Camera System", value: modelInfo.camera },
      { label: "Battery & Charge", value: modelInfo.battery },
      { label: "Stock", value: `${product.stock} units ready` },
      { label: "Dimensions", value: dimensions },
      { label: "Warranty", value: product.warrantyInformation ?? "2-Year QTPhone VIP Warranty" },
      { label: "Shipping", value: product.shippingInformation ?? "Free Express Insured Shipping" }
    ]
  };
}
