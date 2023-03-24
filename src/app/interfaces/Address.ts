export interface Address {
  cp: number
  interior_house_number?: string
  exterior_house_number: string
  municipality: string
  state: string
  city: string
  name: string
  last_name: string
  phone_number: number
  reference: string
  street: string
  crossStreet?: string
  asentamiento: string
}

export interface AddressForcsec {
  estatus: string
  mensaje: string
  data: {
    estado: string,
    municipio: string,
    asentamientos:
    {
      nombre: string,
      tipo: string,
      ciudad: string
    }

  }
}
