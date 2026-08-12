import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { productName, productSlug, quantity, customerName, customerEmail, customerPhone, shippingAddress, unitPrice, totalPrice } = data

    if (!productName || !quantity || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.buyerInquiry.create({
      data: {
        buyerName: customerName,
        email: customerEmail,
        phone: customerPhone,
        country: "N/A", // We can store the shipping address in the message
        product: productName,
        quantity: quantity.toString(),
        unit: "Units",
        message: `ORDER PLACEMENT\nProduct: ${productName}\nQuantity: ${quantity}\nTotal Price: $${totalPrice.toFixed(2)}\nShipping Address: ${shippingAddress}`
      }
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("[api/orders] post error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}
