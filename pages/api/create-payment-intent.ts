import Stripe from "stripe"
import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { AddCartType } from "@/types/AddCartType"
import { prisma } from "@/util/prisma";


//Init stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
})

//Calculate the whole orders total price
const calculateOrderAmount = (items : AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!
  }, 0)
  return totalPrice
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Get user - check if the user is logged in, if not jump back to the log in screen
  const userSession = await getServerSession(req, res, authOptions)
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" })
    return
  }
  //Extract the data from the body
  const { items, payment_intent_id } = req.body

  const total = calculateOrderAmount(items)
  //Create the order data
  const orderData = {
    user: { connect: { id: userSession.user?.id } },
    amount: total,
    currency: "usd",
    status: "pending",
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map((item) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: parseFloat(item.unit_amount),
        image: item.image,
        quantity: item.quantity,
      })),
    },
  }  

  //Check if the payment intent exists just update the order
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    )
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      )
      //Fetch order with product ids
      const existing_order = await prisma.order.findFirst({
          where: { paymentIntentID: updated_intent.id },
          include: { products: true },
        })
        if (!existing_order) {
            res.status(400).json({ message: "Invalid Payment Intent" })
            return
          }
          const updated_order = await prisma.order.update({
          where: { id: existing_order?.id },
          data: {
            amount: total,
            products: {
                //Get rid all of data what is in the database and re-create another order with the updated version
              deleteMany: {},
              create: items.map((item) => ({
                name: item.name,
                description: item.description || null,
                //Make sure it is a number and its not being converted to a string because it cause error
                unit_amount: parseFloat(item.unit_amount),
                image: item.image,
                quantity: item.quantity,
              })),
            },
          },
        })
      res.status(200).json({ paymentIntent: updated_intent })
      return
    }
  } else {
    //By default we have not got payment intent id, so we need to create one/Create a new order with prisma
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    })

    //Create new order in our database
    orderData.paymentIntentID = paymentIntent.id
    const newOrder = await prisma.order.create({
      data: orderData,
    })
    res.status(200).json({ paymentIntent })
  }
}