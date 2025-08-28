import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Due to a bug in Razorpay's type definitions, we need to use `any` here.
// The instance is correctly created, but the types are not recognized by TypeScript.
const razorpay: any = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Razorpay requires the amount to be at least 1 INR
    if (amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1' },
        { status: 400 }
      )
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Error creating Razorpay order' },
      { status: 500 }
    )
  }
}
