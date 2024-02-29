import Stripe from "stripe";
import Product from "./components/Product";

const getProducts = async()=>{
  //Initiate stripe with secret key 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
})
//Fetch products - gonna give us all the products from our system
const products = await stripe.products.list()
//Get products with price - need to loop over each products
const productWithPrices = await Promise.all(
  products.data.map(async (product) => {
        //Made an objcet to get product's price where product equal to product.id
    const prices = await stripe.prices.list({ product: product.id })
    return {
      id: product.id,
      name: product.name,
      unit_amount: prices.data[0].unit_amount,
      image: product.images[0],
      currency: prices.data[0].currency,
      description: product.description,
    }
  })
)
return productWithPrices
};


export default async function Home() {
  //Fetch function what we made on top to get data(id,name,price,image...)
  const products = await getProducts();

  return (
    <main>
      {products.map((product)=> <Product key={product.id} name={product.name} image={product.image} unit_amount={product.unit_amount}/>)}
    </main>
  )
}
