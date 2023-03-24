import { Address } from "./Address"
import { Product } from "./Products"

export interface LabelShipment {
  idRate: number
  myShipmentReference: string
  requestPickup: boolean
  pickupDate: string
  insurance: boolean
  package: {
    description: string
    contentValue: string
    weight: number
    length: number
    height: number
    width: number
    items: [
      {
        c_ClaveUnidadPeso: string
        c_ClaveProdServCP: string
        c_MaterialPeligroso: boolean | null | string
        c_TipoEmbalaje: boolean | null | string
        contentValue: number
        units: number
      }
    ]
  }
  origin: {
    company?: string
    rfc: string
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    number: string
    initNumber: string
    suburb: string
    crossStreet: string
    zipCode: string
    reference: string
    observations?: string
  }
  destination: {
    company?: string
    rfc: string
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    number: string
    initNumber: string
    suburb: string
    crossStreet: string
    zipCode: string
    reference: string
    observations?: string
  }
}

export interface Carrier {
  carrier: string
  cod: boolean
  codDetails: null | string | number
  deliveryDays: number
  deliveryType: string
  distance: null | string | number
  idCarrier: number
  idProduct: number
  idRate: number
  product: string
  quotationType: string
  total: number
  vehicle: string | null | number
}

export interface MetadataMercadoPago {
  label_data: LabelShipment
  shipmentReference: string
  items: [Product]
  retrocompu_user_data: string | any
  shipmentType: Carrier
  addressTo: Address
  payer: {
    name: string
    surname?: string
    email: string
    phone?: {
      area_code: number,
      number: number
    },
    identification?: {
      type: "INE" | "PASSPORT",
      number: string
    },
    address?: {
      street_name: string,
      street_number: number,
      zip_code: number
    }
  }
}
