"use client"

import Image from "next/image"
import { useCartStore } from "@/store"

const Cart = () => {
    //Now we can access to state what we created with zustand
    const cartStore = useCartStore();

  return (
    <div>Cart</div>
  )
}

export default Cart