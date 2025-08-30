
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

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

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("Razorpay key ID or secret is not configured in environment variables.");
    return NextResponse.json(
      { error: "Payment gateway is not configured. Please contact support." },
      { status: 500, headers }
    );
  }

  try {
    const { amount } = await req.json()

    if (amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1' },
        { status: 400, headers }
      )
    }
    
    // Due to a bug in Razorpay's type definitions, we need to use `any` here.
    const razorpay: any = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ order }, { status: 200, headers })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Error creating Razorpay order: ${errorMessage}` },
      { status: 500, headers }
    )
  }
}
