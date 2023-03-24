export interface Product {
  key?: string | undefined
  retrocompu_id: string
  title: string
  unit_price: number
  description: string
  currency_id: string
  category_id: string
  picture_url: string
  quantity: number
  stock: number
  rating: {
    rate: number,
    count: number
  }
  refurbished_info: {
    name_technician: string
    refurbished_date: Date,
    refurbished_type: "A" | "B" | "C",
  }
  laptop_info: {
    model: string,
    brand: string,
    released_date: Date,
    memory_ram: number,
    memory_rom: number,
    color: string,
    screen_size: number,
    resolution: string,
    processor: string,
  }
  box_size: {
    weight: number,
    length: number,
    heigth: number,
    width: number
  }
}

export interface SoldProduct {
  key?: string
  collection_id?: number
  collection_status?: string
  external_reference?: string | null
  merchant_account_id?: string | null
  merchant_order_id?: number
  payment_id?: number
  payment_type?: string
  preference_id?: string
  processing_mode?: string
  site_id?: string
  status?: string
  retrocompu_user_dataFormControl: {
    cart_products: {
      key: string | undefined
      title: string
      unit_price: number
      description: string
      currency_id: string
      category_id: string
      picture_url: string
      quantity: number
      stock: number
      rating: {
        rate: number
        count: number
      },
      refurbished_info: {
        name_technician: string
        refurbished_date: Date,
        refurbished_type: "A" | "B" | "C",
      }
      laptop_info: {
        model: string,
        brand: string,
        released_date: Date,
        memory_ram: number,
        memory_rom: number,
        color: string,
        screen_size: number,
        resolution: string,
        processor: string,
      }
    }
  }
  purchased_dateFormControl: Date
  retrocompu_dataFormControl: {
    retrocompu_email_user: string
    retrocompu_name_user: string
    retrocompu_user_ID: string
  }
}
