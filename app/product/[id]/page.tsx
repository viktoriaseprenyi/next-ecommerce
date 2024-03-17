import { SearchParamsType } from "@/types/SearchParamsTypes"
import formatPrice from "@/util/priceFormat"
import Image from "next/image"
import AddCart from "./AddCart"

//If we write "props" in the parentheses we got params(with the id what we passed down from Home page to Product component) and searchParams back
export default async function Product ({searchParams}:SearchParamsType) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
       <Image
          src={searchParams.image}
          alt={searchParams.name}
          width={600}
          height={600}
          className="w-full rounded-lg"
          priority={true}
        />
        <div className="font-medium">
            <h1 className="text-2xl py-2">{searchParams.name}</h1>
            <p className="py-2">{searchParams.description}</p>
        <div className="flex gap-2">
          <p className="font-bold text-primary">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
        <AddCart {...searchParams}/>
        </div>
    </div>
  )
}
