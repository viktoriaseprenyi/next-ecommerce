"use client"

import Image from "next/image"
import { useCartStore } from "@/store"
import formatPrice from "@/util/priceFormat"
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5"
import basket from "@/public/basket.png"
import {AnimatePresence, motion} from "framer-motion";
import Checkout from "./Checkout"
import { OrderConfirmed } from "./OrderConfirmed"

const Cart = () => {
    //Now we can access to state what we created with zustand
    const cartStore = useCartStore();

    //Calcualte total price with reduce
    const totalPrice = cartStore.cart.reduce((acc, item) => {
      return acc +item.unit_amount! * item.quantity!
    }, 0)

  return (
    <motion.div animate={{opacity:1}} initial={{opacity:0}} exit={{opacity:0}} onClick={()=> cartStore.toggleCart()} className="fixed w-full h-screen left-0 top-0 bg-black/25">
      {/*stopPropagation is for when I clicked inside the div it senses link a "toggle" by default so the Cart "modal" closed, stopPropagation allows us not to bubbling up our div to the parent div so does not close by a clicking*/}
      {/*Actual Cart*/}
      <motion.div layout onClick={(e) => e.stopPropagation()} className="bg-white absolute right-0 top-0 w-full lg:w-2/5 h-screen p-12 overflow-y-scroll text-gray-700">
     {cartStore.onCheckout === "cart" && (
      <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to store 🏃
          </button>
          )}
           {cartStore.onCheckout === "checkout" && (
      <button
            onClick={() => cartStore.setCheckout("cart")}
            className="text-sm font-bold pb-12"
          >
            Check your cart 🌟  
          </button>
          )}
          {/*Cart Items*/}
          {cartStore.onCheckout === 'cart' && (
            <>
        {cartStore.cart.map((item)=> (
          <motion.div layout key={item.id} className="flex py-4 gap-4">
            <Image className="rounded-md h-24" src={item.image} alt={item.name} height={120} width={120}/>
            <motion.div layout>
            <h2>{item.name}</h2>
            {/*Update quantity of a product*/}
            <motion.div layout className="flex gap-2">
              <h2>Quantity: {item.quantity}</h2>
              <button
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    ><IoRemoveCircle/></button>
              <button
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    ><IoAddCircle/></button>
            </motion.div>
            <p className="text-sm">{item.unit_amount && formatPrice(item.unit_amount)}</p>
          </motion.div>
          </motion.div>
        ))}
        </>
        )}
        {cartStore.cart.length > 0 && cartStore.onCheckout === 'cart' ? (
        <motion.div layout>
          <p>Total: {formatPrice(totalPrice)}</p>
        <button
              onClick={() => cartStore.setCheckout("checkout")}
              className="py-2 mt-4 bg-emerald-700 w-full rounded-md text-white"
            >
              Checkout
            </button>
      </motion.div>) : null}
      {/*Checkout form*/}
      {cartStore.onCheckout === 'checkout' && <Checkout/>}
      {cartStore.onCheckout === 'success' && <OrderConfirmed/>}
        <AnimatePresence>
        {!cartStore.cart.length && cartStore.onCheckout === 'cart' && <motion.div animate={{scale:1, rotateZ: 0, opacity: 0.75}}
        initial={{scale:0.5, rotateZ: -10, opacity: 0}}
        exit={{scale:0.5, rotateZ: -10, opacity: 0}}
        className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75">
          <h1>Uhh ohh...it's empty</h1>
          <Image src={basket} alt="empty basket" height={200} width={200}/>
          </motion.div>}
          </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default Cart