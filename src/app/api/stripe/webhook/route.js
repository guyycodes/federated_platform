// src/app/api/stripe/webhook/route.js
// Webhook handler for Stripe events
// Purpose: Listens for events FROM Stripe back to your app
// When it runs: AFTER payment happens (Stripe calls YOUR server)
// What it does:
// Receives notifications when payments succeed/fail
// Handles order fulfillment
// Updates your database
// Sends confirmation emails


import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to safely send emails
const sendEmailSafely = async (emailData, context) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY not configured, skipping email sending');
      return;
    }

    console.log(`📧 Attempting to send ${context} email to:`, emailData.to);
    console.log(`📋 Email subject:`, emailData.subject);
    
    const result = await resend.emails.send({
      from: 'Buster & Co <info@levelupco.com>',
      ...emailData
    });
    
    console.log(`✅ Email sent successfully for ${context}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send ${context} email:`, error.message);
    console.error(`📋 Error details:`, error);
    // Don't throw - we don't want email failures to break webhook processing
    return null;
  }
};

// Email templates
const createOrderConfirmationEmail = (orderDetails) => {
  const { 
    sessionId, 
    customerEmail, 
    customerName,
    amount, 
    currency, 
    itemsSummary,
    metadata 
  } = orderDetails;

  return {
    subject: `Order Confirmation - Your Buster & Co Purchase`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .total { font-size: 1.2em; font-weight: bold; color: #f65a1f; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
            .button { display: inline-block; background: #f65a1f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your purchase, ${customerName || 'valued customer'}!</p>
            </div>
            
            <div class="content">
              <div class="order-summary">
                <h2>Order Summary</h2>
                <p><strong>Order ID:</strong> ${sessionId}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                
                <h3>Items Purchased:</h3>
                <p>${itemsSummary || 'Your selected items'}</p>
                
                ${metadata?.memberDiscount && parseInt(metadata.memberDiscount) > 0 ? 
                  `<p><strong>Member Discount:</strong> -$${(parseInt(metadata.memberDiscount) / 100).toFixed(2)}</p>` : ''}
                
                ${metadata?.bundleDiscount && parseInt(metadata.bundleDiscount) > 0 ? 
                  `<p><strong>Bundle Discount:</strong> -$${(parseInt(metadata.bundleDiscount) / 100).toFixed(2)}</p>` : ''}
                
                ${metadata?.tax ? 
                  `<p><strong>Tax:</strong> $${(parseInt(metadata.tax) / 100).toFixed(2)}</p>` : ''}
                
                ${metadata?.shipping ? 
                  `<p><strong>Shipping:</strong> ${parseInt(metadata.shipping) === 0 ? 'FREE' : `$${(parseInt(metadata.shipping) / 100).toFixed(2)}`}</p>` : ''}
                
                <hr>
                <p class="total">Total Paid: $${amount.toFixed(2)} ${currency.toUpperCase()}</p>
              </div>
              
              <h3>What's Next?</h3>
              <ul>
                <li>We'll process your order within 1-2 business days</li>
                <li>You'll receive tracking information once your order ships</li>
                <li>Questions? Contact us at support@busterandco.com</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://busterandco.com'}/orders" class="button">
                  Track Your Order
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Buster & Co!</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

const createPaymentFailedEmail = (customerEmail, customerName, amount, currency) => ({
  subject: `Payment Issue - Buster & Co Order`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f65a1f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Issue</h1>
            <p>We encountered a problem processing your payment</p>
          </div>
          
          <div class="content">
            <p>Hello ${customerName || 'valued customer'},</p>
            
            <p>We were unable to process your payment of $${amount.toFixed(2)} ${currency.toUpperCase()}. This could be due to:</p>
            
            <ul>
              <li>Insufficient funds</li>
              <li>Card declined by your bank</li>
              <li>Incorrect card information</li>
              <li>Security restrictions</li>
            </ul>
            
            <p>Don't worry - your items are still reserved for a limited time. Please try again with a different payment method.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://busterandco.com'}/checkout" class="button">
                Try Again
              </a>
            </div>
            
            <p>If you continue to experience issues, please contact us at support@busterandco.com</p>
          </div>
        </div>
      </body>
    </html>
  `
});

const createAbandonedCartEmail = (customerEmail, customerName, sessionId) => ({
  subject: `Don't forget your items - Buster & Co`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f65a1f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 Your Items Are Waiting</h1>
            <p>Complete your purchase at Buster & Co</p>
          </div>
          
          <div class="content">
            <p>Hello ${customerName || 'valued customer'},</p>
            
            <p>You left some great items in your cart! Don't miss out on your selection.</p>
            
            <p>Your checkout session expired, but we've saved your items for you. Complete your purchase now to secure your order.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://busterandco.com'}/shop" class="button">
                Complete Your Purchase
              </a>
            </div>
            
            <p>Questions? Contact us at support@busterandco.com</p>
          </div>
        </div>
      </body>
    </html>
  `
});

export async function POST(request) {
    console.log('🔔 Stripe Webhook - Received event');
    console.log('🚨 WEBHOOK ENDPOINT HIT! This should appear in your Vercel logs');
    
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            console.error('❌ No stripe-signature header');
            return NextResponse.json(
                { error: 'No signature header' },
                { status: 400 }
            );
        }

        let event;

        // Verify webhook signature if secret is configured
        if (webhookSecret) {
            try {
                event = stripe.webhooks.constructEvent(
                    body,
                    signature,
                    webhookSecret
                );
            } catch (err) {
                console.error('❌ Webhook signature verification failed:', err.message);
                return NextResponse.json(
                    { error: `Webhook Error: ${err.message}` },
                    { status: 400 }
                );
            }
        } else {
            // For development without webhook secret
            event = JSON.parse(body);
            console.warn('⚠️  Webhook signature not verified (no STRIPE_WEBHOOK_SECRET)');
        }

        console.log(`📥 Event type: ${event.type}`);
        console.log(`📋 Event ID: ${event.id}`);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('✅ Checkout session completed:', {
                    id: session.id,
                    amount_total: session.amount_total,
                    currency: session.currency,
                    customer_email: session.customer_email,
                    metadata: session.metadata,
                });

                // TODO: Fulfill the order
                // - Save order to database
                // - Send confirmation email
                // - Update inventory
                // - Trigger any post-purchase workflows

                // Example: Log order details
                console.log('📦 Order to fulfill:', {
                    sessionId: session.id,
                    customerEmail: session.customer_email,
                    userId: session.client_reference_id,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    itemsSummary: session.metadata?.itemsSummary,
                });

                // Send confirmation email
                const email = createOrderConfirmationEmail({
                    sessionId: session.id,
                    customerEmail: session.customer_email,
                    customerName: session.customer_name,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    itemsSummary: session.metadata?.itemsSummary,
                    metadata: session.metadata
                });
                await sendEmailSafely({
                    to: session.customer_email,
                    ...email
                }, 'order confirmation');

                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('💰 Payment succeeded:', {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                });
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.error('❌ Payment failed:', {
                    id: paymentIntent.id,
                    error: paymentIntent.last_payment_error?.message,
                });
                
                // TODO: Handle failed payment
                // - Notify customer
                // - Log for follow-up

                // Send failed payment notification
                const email = createPaymentFailedEmail(
                    paymentIntent.customer_email,
                    paymentIntent.customer_name,
                    paymentIntent.amount / 100,
                    paymentIntent.currency
                );
                await sendEmailSafely({
                    to: paymentIntent.customer_email,
                    ...email
                }, 'payment failure');

                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object;
                console.log('⏰ Checkout session expired:', session.id);
                
                // TODO: Handle expired session
                // - Clean up any reserved inventory
                // - Send abandonment email

                // Send abandoned cart email
                const email = createAbandonedCartEmail(
                    session.customer_email,
                    session.customer_name,
                    session.id
                );
                await sendEmailSafely({
                    to: session.customer_email,
                    ...email
                }, 'abandoned cart');

                break;
            }

            default:
                console.log(`ℹ️  Unhandled event type: ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        return NextResponse.json({ received: true });
        
    } catch (error) {
        console.error('❌ Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
} 