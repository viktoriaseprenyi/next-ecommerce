"use client"

import Image from "next/image"
import { useCartStore } from "@/store"
import formatPrice from "@/util/priceFormat"

const Cart = () => {
    //Now we can access to state what we created with zustand
    const cartStore = useCartStore();

  return (
    <div onClick={()=> cartStore.toggleCart()} className="fixed w-full h-screen left-0 top-0 bg-black/25">
      <div onClick={(e) => e.stopPropagation()} className="bg-white absolute right-0 top-0  w-1/4 h-screen p-12 overflow-y-scroll text-gray-700">
        <h1>Here is your shopping list </h1>
        {cartStore.cart.map((item)=> (
          <div className="flex py-4 gap-4">
            <Image className="rounded-md h-24" src={item.image} alt={item.name} height={120} width={120}/>
            <div>
            <h2>{item.name}</h2>
            <h2>Quantity: {item.quantity}</h2>
            <p className="text-sm">{item.unit_amount && formatPrice(item.unit_amount)}</p>
          </div>
          </div>
        ))}
        <button className="py-2 mt-4 bg-emerald-700 w-full rounded-md text-white">Check out</button>
      </div>
    </div>
  )
}

export default Cart