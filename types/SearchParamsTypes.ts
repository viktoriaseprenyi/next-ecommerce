export type Params ={
    id: string
}

export type SearchParams = {
    name: string
    id: string
    unit_amount: number | null
    image: string
    description: string
}

export type SearchParamsType = {
    params: Params
    searchParams: SearchParams
}