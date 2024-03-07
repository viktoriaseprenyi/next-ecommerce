"use client"

import {useEffect, useState} from "react"
import {PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js"
import formatPrice from "@/util/priceFormat"
import { useCartStore } from "@/store"

export const CheckoutForm = ({clientSecret}: {clientSecret: string}) => {
const stripe = useStripe()
const elements = useElements()
const [isLoading, setIsLoading] = useState(false)

const cartStore = useCartStore()

const totalPrice = cartStore.cart.reduce((acc, item) =>{
    return acc + item.unit_amount! * item.quantity!
},0)

const formattedPrice = formatPrice(totalPrice)

/*When mounted correctly then execute our form, check if there is no stripe and elements initalized return,
 so do not even render out our form*/
useEffect(()=>{
if(!stripe){
    return
} if(!clientSecret){ //If there is no client secret than the user do not try to finish any payment
    return
}
},[stripe])

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(!stripe || !elements){
        return
    }
    setIsLoading(true)

    stripe.confirmPayment({
        elements,
        redirect: "if_required"
    }) //Make automatic validation check if the card is correct
    .then((result)=>{
if(!result.error){
    cartStore.setCheckout('success')
}
setIsLoading(false)
    })
}

    return (
<form className="text-gray-600" onSubmit={handleSubmit} id="payment-form">
<PaymentElement id="payment-element" options={{layout: 'tabs'}}/>
<h1 className="py-4 text-sm font-bold">Total: {formattedPrice}</h1>
<button className={`py-2 mt-4 w-full bg-emerald-700 rounded-md text-white disabled:opacity-25`} id="submit" disabled={isLoading || !stripe || !elements}>
    <span id="button-text">
        {isLoading ? <span>Processing 👀 </span> : <span>Pay now 🔥 </span>}
    </span>
</button>
</form>
    )
}