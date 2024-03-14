import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import {getServerSession} from "next-auth"
import formatPrice from "@/util/priceFormat";
import Image from "next/image";

//Refetch the data every time when user visit my page

export const revalidate = 0

const fetchOrder = async () => {
    const prisma = new PrismaClient();
    const user = await getServerSession(authOptions)
    if(!user){
        return null
    }
    const orders = await prisma.order.findMany({
        where: {userId: user?.user?.id},
        include: {products: true}
    })
    return orders
}

const Dashboard = async ()=> {
    const orders = await fetchOrder()
    if(orders === null){
        return <div>You need to be logged in to see your orders</div>
    }
    if(orders.length === 0) {
        return <div><h1>No orders placed</h1></div>
    }
    return(
        <div>
            <div className="font-medium">
                {orders.map((order) => (
                    <div key={order.id} className="rounded-md p-8 my-12 bg-base-200">
                        <h2 className="text-xs font-medium">Order reference: {order.id}</h2>
                        <p className="text-md py-2">Status: {""}<span className={`${order.status === 'complete' ? "bg-emerald-500" : "bg-orange-400"} text-white py-1 rounded-md px-2 mx-2 text-sm`}>{order.status}
                            </span></p>
                            <p className="text-xs">Time: {new Date(order.createdDate).toString()}</p>
                            <div className="text-sm lg:flex items-center gap-2">
                                {order.products.map((product)=> (
                                    <div className="py-2">
                                        <h2 className="py-2">{product.name}</h2>
                                        <div className=" flex items-center gap-4">
                                            <Image src={product.image!} alt={product.name} height={36} width={36}/>
                                            <p>{formatPrice(product.unit_amount)}</p>
                                            <p>Quantity: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <p className="font-medium">Total: {formatPrice(order.amount)}</p>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard