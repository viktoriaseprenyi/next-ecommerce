//State management library to able to pass data to given component
import {create} from "zustand";
import  {persist} from "zustand/middleware";
import { AddCartType } from "./types/AddCartType";    

type CartStateType = {
    isOpen: boolean
    cart: AddCartType[]
    toggleCart: ()=>void
    addProduct: (item: AddCartType) => void
    removeProduct: (item: AddCartType) => void
}

export const useCartStore = create<CartStateType>()(
    persist((set) => ({
        cart: [],
        isOpen:false,
        //Set is basically means "modification", so when I would like to make any modification on any state, we should use that - State is actually everything what is in out CartState like Cart, isOpen, addProduct ect.
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        addProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          )
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                //Make sure that every other things what we passed down like, name, image, id stay the same, only the quantity changes
                return { ...cartItem, quantity: cartItem.quantity! + 1 }
              }
              return cartItem
            })
            return { cart: updatedCart }
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] }
          }
        }),
        removeProduct: (item) => set((state) => {
          //Check if the item exsist and remove quantity -1
const existingItem = state.cart.find((cartItem) => cartItem.id === item.id)
if(existingItem && existingItem.quantity! > 1 ) {
  const updatedCart = state.cart.map((cartItem) => {
    if(cartItem.id === item.id) {
      return {...cartItem, quantity: cartItem.quantity!-1}
    }
    return cartItem
  })
  return {cart:updatedCart}
}else{
  //
  const filteredCart = state.cart.filter((cartItem) => cartItem.id !== item.id)
  return {cart:filteredCart}
}
})
    }),
   {name: 'cart-store'}
)
)