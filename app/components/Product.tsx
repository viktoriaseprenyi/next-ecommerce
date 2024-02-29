import Image from "next/image";
import formatPrice from "@/util/priceFormat";
import { ProductType } from "@/types/ProductTypes";

export default function Product({name,image,unit_amount}:ProductType) {

  return (
      <div>
        <Image
          src={image}
          alt={name}
          width={800}
          height={800}
          className="w-full h-96 object-cover rounded-lg"
          priority={true}
        />
        <h1>{name}</h1>
        {/*If price is exists then format price for us otherwise gives N/A*/}
        {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
      </div>

  )
}