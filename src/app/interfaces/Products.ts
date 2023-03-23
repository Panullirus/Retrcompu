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
