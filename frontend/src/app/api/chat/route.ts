import { NextRequest, NextResponse } from "next/server";
import { fetchSmartphones } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string };
  const message = body.message?.trim().toLowerCase() ?? "";

  try {
    const products = await fetchSmartphones();
    const reply = buildProductReply(message, products);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply:
        "I can still help with the page: use search, tabs, quick view, favorites, cart preview, specs, and dark mode to compare products."
    });
  }
}

function buildProductReply(
  message: string,
  products: Awaited<ReturnType<typeof fetchSmartphones>>
) {
  if (message.includes("discount") || message.includes("deal")) {
    const product = [...products].sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
    return `${product.name} currently has the strongest discount at ${formatDiscount(
      product.discountPercentage
    )}, listed from ${formatPrice(product.price)}.`;
  }

  if (message.includes("camera")) {
    const product = products.find((item) => item.name.toLowerCase().includes("pro")) ?? products[0];
    return `${product.name} is a strong camera-oriented pick from this catalog. Open quick view to compare rating, warranty, and product details.`;
  }

  if (message.includes("compare")) {
    const mentioned = products.filter((product) =>
      message.includes(product.name.toLowerCase().replace("apple ", ""))
    );
    const picks = mentioned.length >= 2 ? mentioned.slice(0, 2) : products.slice(0, 2);
    return `${picks[0].name} is ${formatPrice(picks[0].price)} with ${formatRating(
      picks[0].rating
    )}; ${picks[1].name} is ${formatPrice(picks[1].price)} with ${formatRating(
      picks[1].rating
    )}. Use the compare icon to save both.`;
  }

  if (message.includes("warranty") || message.includes("shipping")) {
    return "Warranty and shipping are shown in the specs dashboard and quick view when the API provides those fields.";
  }

  const topRated = [...products].sort((a, b) => b.rating - a.rating)[0];
  return `${topRated.name} is the top-rated visible option at ${formatRating(
    topRated.rating
  )}. You can favorite it, add it to cart preview, or open quick view for specs.`;
}
