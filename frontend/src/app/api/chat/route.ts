import { NextRequest, NextResponse } from "next/server";
import { fetchSmartphones } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";
import type { SmartphoneProduct } from "@/lib/products";

type ChatProviderResult = {
  reply: string;
  provider: "openai" | "gemini" | "demo";
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string };
  const rawMessage = body.message?.trim() ?? "";
  const message = rawMessage.toLowerCase();

  if (!rawMessage) {
    return NextResponse.json(
      { reply: "Ask me about phone prices, discounts, camera picks, warranty, or shipping." },
      { status: 422 }
    );
  }

  try {
    const products = await fetchSmartphones();
    const providerReply = await getConfiguredProviderReply(rawMessage, products);

    if (providerReply) {
      return NextResponse.json(providerReply);
    }

    return NextResponse.json({
      reply: buildProductReply(message, products),
      provider: "demo",
      configured: false
    });
  } catch {
    return NextResponse.json({
      reply:
        "I can still help with the page: use search, tabs, quick view, favorites, cart preview, specs, and dark mode to compare products.",
      provider: "demo",
      configured: false
    });
  }
}

async function getConfiguredProviderReply(
  message: string,
  products: SmartphoneProduct[]
): Promise<ChatProviderResult | null> {
  if (process.env.OPENAI_API_KEY) {
    const reply = await callOpenAI(message, products);

    if (reply) {
      return { reply, provider: "openai" };
    }
  }

  if (process.env.GEMINI_API_KEY) {
    const reply = await callGemini(message, products);

    if (reply) {
      return { reply, provider: "gemini" };
    }
  }

  return null;
}

async function callOpenAI(message: string, products: SmartphoneProduct[]) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a concise smartphone landing-page product assistant. Answer from the provided catalog context only. If information is missing, say what the shopper can inspect on the page."
          },
          {
            role: "user",
            content: `Catalog context:\n${buildCatalogContext(products)}\n\nQuestion: ${message}`
          }
        ],
        max_tokens: 180,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

async function callGemini(message: string, products: SmartphoneProduct[]) {
  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a concise smartphone landing-page product assistant. Answer from this catalog context only.\n\n${buildCatalogContext(
                    products
                  )}\n\nQuestion: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 180,
            temperature: 0.4
          }
        })
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

function buildCatalogContext(products: SmartphoneProduct[]) {
  return products
    .slice(0, 8)
    .map(
      (product) =>
        `- ${product.name} (${product.brand}): ${formatPrice(product.price)}, ${formatDiscount(
          product.discountPercentage
        )}, ${formatRating(product.rating)}, stock ${product.stock}. ${product.description}`
    )
    .join("\n");
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
