export type ProductType = {
    name: string
    id: string
    unit_amount: number | null
    image: string
    description: string
    quantity?: number | 1
}