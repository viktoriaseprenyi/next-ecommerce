import Image from "next/image";
import formatPrice from "@/util/priceFormat";
import { ProductType } from "@/types/ProductTypes";

export default function Product({name,image,unit_amount}:ProductType) {

  return (
      <div className="text-gray-700">
        <Image
          src={image}
          alt={name}
          width={800}
          height={800}
          className="w-full h-96 object-cover rounded-lg"
          priority={true}
        />
        <div className="font-medium py-3">
        <h1>{name}</h1>
        {/*If price is exists then format price for us otherwise gives N/A*/}
        <h2 className="text-sm text-emerald-700">{unit_amount !== null ? formatPrice(unit_amount) : "N/A"}</h2>
        </div>
      </div>

  )
}