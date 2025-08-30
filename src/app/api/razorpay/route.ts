
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Due to a bug in Razorpay's type definitions, we need to use `any` here.
// The instance is correctly created, but the types are not recognized by TypeScript.
const razorpay: any = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Define allowed origins
const allowedOrigins = [
    "https://6000-firebase-studio-1756288828902.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev",
    // You can add other origins here if needed, e.g., for local development
    // "http://localhost:3000" 
];

const corsHeaders = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get('origin') ?? '';
    if (allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 204,
            headers: {
                ...corsHeaders,
                "Access-Control-Allow-Origin": origin,
            }
        });
    }
    return new NextResponse(null, { status: 400, statusText: "Bad Request" });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const headers = { ...corsHeaders, "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0] };

  try {
    const { amount } = await req.json()

    // Razorpay requires the amount to be at least 1 INR
    if (amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1' },
        { status: 400, headers }
      )
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ order }, { status: 200, headers })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Error creating Razorpay order' },
      { status: 500, headers }
    )
  }
}
