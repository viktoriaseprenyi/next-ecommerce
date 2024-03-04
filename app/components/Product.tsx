import Image from "next/image";
import formatPrice from "@/util/priceFormat";
import { ProductType } from "@/types/ProductTypes";
import Link from "next/link";

export default function Product({name,image,unit_amount,id, description}:ProductType) {

  return (
    //With query we can pass any info for example to the product page
    <Link href={{pathname:`/product/${id}`, query: {name, image, id, unit_amount, description}}}>
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
      </Link>

  )
}