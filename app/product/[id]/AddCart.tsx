"use client"

import { useCartStore } from "@/store"
import { AddCartType } from "@/types/AddCartType"
import { useState } from "react"

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity,
}: AddCartType) {
  const cartStore = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    cartStore.addProduct({ id, name, unit_amount, quantity, image })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
    }, 500)
  }

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={added}
        className="bg-emerald-700 text-white my-12 rounded-lg py-2 px-6 font-medium"
      >
        {!added && <span>Add to cart</span>}
        {added && <span>Adding to cart 😄</span>}
      </button>
    </>
  )
}