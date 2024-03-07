/*This checkout is responsible for loading up the Stripe libraby and initializing Stripe elements for us,
 also creates payment intents on server side and our api route and pushing back tp our client*/
"use client"

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckoutForm } from "./CheckoutForm"


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function Checkout() {
  const cartStore = useCartStore()
  const router = useRouter()
  /*Authorize a payment, so the client secret gives the ability to confirm the payment and complete the transaction
  we generate this secret on the server side bc we dont want a user to be able to complete the transaction for us*/
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    //Create a paymentIntent as soon as the page loads up, and it will be a uniqe "id" that connects only one order
    fetch('/api/create-payment-intent', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin")
        }
        return res.json()
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret)
        cartStore.setPaymentIntent(data.paymentIntent.id)
      })
  }, [])
  
  const options : StripeElementsOptions = {
    clientSecret,
    appearance: {
        theme: 'stripe',
        labels: 'floating'
    }
  }

  return (
    <div>
    {clientSecret && (
        <div>
            <Elements options={options} stripe={stripePromise}> {/*Make sure that stripe are loaded*/}
                <CheckoutForm clientSecret={clientSecret}/>
            </Elements>
        </div>
    )}
    </div>
  )
}