import { SearchParamsType } from "@/types/SearchParamsTypes"
import formatPrice from "@/util/priceFormat"
import Image from "next/image"
import AddCart from "./AddCart"

//If we write "props" in the parentheses we got params(with the id what we passed down from Home page to Product component) and searchParams back
export default async function Product ({searchParams}:SearchParamsType) {
  return (
    <div className="flex justify-between gap-24 p-12 text-gray-700">
       <Image
          src={searchParams.image}
          alt={searchParams.name}
          width={600}
          height={600}
        />
        <div className="font-medium text-gray-700">
            <h1 className="text-2xl py-2">{searchParams.name}</h1>
            <p className="py-2">{searchParams.description}</p>
        <div className="flex gap-2">
          <p className="font-bold text-emerald-700">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
        <AddCart {...searchParams}/>
        </div>
    </div>
  )
}
