import { NextRequest, NextResponse } from "next/server";

const answers = [
  {
    keywords: ["price", "discount", "deal", "gia", "giá"],
    reply:
      "Product cards show live price and discount data. Start with the highest rating, then compare discount and stock."
  },
  {
    keywords: ["shipping", "warranty", "bao hanh", "bảo hành"],
    reply:
      "The specs area highlights warranty and shipping details from the product API when available."
  },
  {
    keywords: ["favorite", "cart", "gio hang", "giỏ hàng"],
    reply:
      "Use the heart and bag icons on each product. Favorites, cart preview, and recently viewed items stay in local storage."
  },
  {
    keywords: ["dark", "theme", "toi", "tối"],
    reply:
      "Use the moon or sun icon in the header to switch theme. The preference is saved locally."
  }
];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string };
  const message = body.message?.trim().toLowerCase() ?? "";
  const match = answers.find((answer) =>
    answer.keywords.some((keyword) => message.includes(keyword))
  );

  return NextResponse.json({
    reply:
      match?.reply ??
      "I can help compare phone price, discount, warranty, shipping, favorites, cart preview, and theme settings."
  });
}
