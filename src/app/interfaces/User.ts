import { Product } from "./Products"

export interface User {
  name: string
  last_name: string
  email: string
  user_ID: string | null | undefined
  saved_products?: any
  purchased_products?: any
  cart_product?: [Product]
  image_profile: string | null | undefined
  address_direction?: [
    {
      cp: number,
      interior_house_number: string,
      exterior_house_number: string,
      address_1: string,
      address_2: string,
      settlement: [
        settlement_type: string
      ],
      municipality: string,
      state: string,
      city: string,
      name: string,
      phone_number: number,

    }
  ] | 0
}
