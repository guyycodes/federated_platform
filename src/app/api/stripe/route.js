// src/app/api/stripe/route.js
// This is the route for the stripe API - creates Stripe Checkout sessions
// loads the hosted paymeent page

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    console.log('🔵 Stripe API Route - Creating checkout session');
    
    try {
        const body = await request.json();
        const { 
            items = [], 
            successUrl,
            cancelUrl,
            metadata = {},
            userEmail,
            userId 
        } = body;
        
        // Use frontend-provided URLs or fallback to defaults
        const finalSuccessUrl = successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        const finalCancelUrl = cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`;
        
        console.log('📦 Checkout Session Request:', {
            itemCount: items.length,
            userEmail,
            userId,
            metadata
        });

        // Transform cart items into Stripe line items
        const lineItems = items.map(item => {
            console.log('🛍️ Processing item:', item.name || item.title);
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name || item.title,
                        description: [
                            item.selectedSize && `Size: ${item.selectedSize}`,
                            item.selectedColor && `Color: ${item.selectedColor}`,
                        ].filter(Boolean).join(', ') || undefined,
                        images: item.image ? [item.image] : undefined,
                    },
                    unit_amount: Math.round(item.price), // Ensure amount is in cents
                },
                quantity: item.quantity,
            };
        });

        console.log('📋 Line items prepared:', lineItems.length);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: finalSuccessUrl,
            cancel_url: finalCancelUrl,
            customer_email: userEmail || undefined,
            client_reference_id: userId || undefined,
            metadata: {
                ...metadata,
                userId: userId || 'anonymous',
                userEmail: userEmail || 'not-provided',
                timestamp: new Date().toISOString(),
                itemCount: items.length.toString(),
                // Store a summary of items (Stripe metadata has a 500 char limit per key)
                itemsSummary: items.map(item => 
                    `${item.quantity}x ${item.name || item.title}`
                ).join(', ').substring(0, 400)
            },
            // Allow promotion codes
            allow_promotion_codes: true,
            // Collect billing address
            billing_address_collection: 'required',
            // Shipping if needed (can be configured based on your needs)
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'], // Add countries as needed
            },
        });

        console.log('✅ Checkout Session Created:', {
            id: session.id,
            url: session.url,
            amount_total: session.amount_total,
            currency: session.currency
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url
        });
        
    } catch (error) {
        console.error('❌ Stripe API Error:', {
            message: error.message,
            type: error.type,
            code: error.code,
            statusCode: error.statusCode
        });

        return NextResponse.json(
            { 
                error: 'Failed to create checkout session',
                details: error.message 
            },
            { status: 500 }
        );
    }
}