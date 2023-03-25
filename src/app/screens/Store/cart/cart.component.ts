import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { AddressService } from 'src/app/services/Address/address.service';
import { User } from 'src/app/interfaces/User';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { Product } from 'src/app/interfaces/Products';
import { MetadataMercadoPago } from 'src/app/interfaces/Shipment';
import { Address, AddressForcsec } from 'src/app/interfaces/Address';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/Store/store.service';
import { Carrier, LabelShipment } from 'src/app/interfaces/Shipment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  @Output() newItemEvent = new EventEmitter<string>();

  searchCPForm = new FormGroup({
    asentamiento: new FormControl(''),
    reference: new FormControl(''),
    cp: new FormControl(''),
    interior_house_number: new FormControl(''),
    exterior_house_number: new FormControl(''),
    municipality: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    name: new FormControl(''),
    last_name: new FormControl(''),
    phone_number: new FormControl(''),
    street: new FormControl(''),
    crossStreet: new FormControl(''),
  })

  public isFullShipment: boolean = false
  public isLogged: boolean = true;
  public shipment_item!: any;
  public address_selected!: Address;
  public modal!: boolean;
  public productTotal!: number;
  public quotation_address_selected!: Carrier;
  public spinner_shipment!: boolean;
  public spinner!: boolean;
  public quotation_address!: any;
  public user_data!: User;
  public cart_container: [Product] | any = [];
  public addressDirectionContainer!: any;
  public addAddressForm = false;
  public cpContainer!: AddressForcsec | any;
  public cityForm!: any;
  public preferenceID!: string;
  public addressContainer!: Address;

  public FORM_ID = 'payment-form'

  constructor(private _auth: AuthService, private _address: AddressService, private _checkout: CheckoutService, private route: Router, private _store: StoreService) { }

  sendProducts(products: any) {
    this.newItemEvent.emit(products)
  }

  getAllCartProduct() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data;

      try {
        this._auth.getAllCartProducts(this.user_data.user_ID).snapshotChanges().pipe(
          map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
          )
          )
        ).subscribe((data: any) => {
          this.cart_container = data
          console.log(this.cart_container)
        })
      } catch (error) {
        this.isLogged = false;
      }
    })
  }

  createPreference(addressTo: Address, shipmentType: Carrier): void {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data;

      this._auth.getAllCartProducts(this.user_data.user_ID).snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
        )
        )
      ).subscribe((data: any) => {
        this.cart_container = data;

        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        let pickup_date = new Date()
        pickup_date.toISOString().split('T')[0]

        console.log("Producto(s) => ", this.cart_container)

        const label: LabelShipment = {
          idRate: Number(shipmentType.idRate),
          myShipmentReference: id,
          requestPickup: true,
          pickupDate: pickup_date.toISOString().split('T')[0],
          insurance: true,
          package: {
            description: 'Evío de Retrocompu.com',
            contentValue: String(this.productTotal),
            weight: Number(this.cart_container[0].box_size.weight),
            length: Number(this.cart_container[0].box_size.length),
            height: Number(this.cart_container[0].box_size.heigth),
            width: Number(this.cart_container[0].box_size.width),
            items: [
              {
                c_ClaveUnidadPeso: "XPK",
                c_ClaveProdServCP: "31181701",
                c_MaterialPeligroso: null,
                c_TipoEmbalaje: null,
                contentValue: this.cart_container[0].unit_price,
                units: 1
              }
            ]
          },
          origin: {
            company: "Retrocompu",
            rfc: "XAXX010101000",
            firstName: "Yahir",
            lastName: "González",
            email: "retrocompu@gmail.com",
            phone: "1234567890",
            street: "Cerrada uruguay",
            number: "820",
            initNumber: "1",
            suburb: "La Guadalupana",
            crossStreet: "Calle uruguay entre Cerrada uruguay",
            zipCode: "77724",
            reference: "Casa de dos pisos con valla de madera"
          },
          destination: {
            company: "N/A",
            rfc: "XAXX010101000",
            firstName: addressTo.name,
            lastName: addressTo.last_name,
            email: this.user_data.email,
            phone: String(addressTo.phone_number),
            street: addressTo.street,
            number: addressTo.exterior_house_number,
            initNumber: "1",
            suburb: addressTo.asentamiento,
            crossStreet: String(addressTo.crossStreet),
            zipCode: String(addressTo.cp),
            reference: addressTo.reference
          }
        }

        console.log(label)

        const items: MetadataMercadoPago = {
          label_data: label,
          shipmentReference: String(id),
          addressTo: addressTo,
          shipmentType: shipmentType,
          items: this.cart_container,
          retrocompu_user_data: this.user_data,
          payer: {
            name: this.user_data.email,
            email: this.user_data.email,
          }
        }

        const items_preference = {
          purchase_data: items,
          shipment_cost: this.shipment_item
        }

        this._checkout.createMercadoPagoReferenceID(items_preference).subscribe((data: any) => {
          this.openMercadoPagoScript(data.id)
        })
      })
    })
  }

  // getAddressDirection() {
  //   this._auth.GetCurrentDataUser().subscribe((data: any) => {
  //     this.user_data = data
  //     this._auth.GetAllAddressDirection(this.user_data.user_ID).snapshotChanges().pipe(
  //       map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
  //       )
  //       )
  //     ).subscribe((data: any) => {
  //       this.addressDirectionContainer = data
  //       console.log(this.addressDirectionContainer)
  //     })
  //   })
  // }

  getAddressDirection() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data
      this._auth.GetAllAddressDirection(this.user_data.user_ID).subscribe(data => {
        this.addressDirectionContainer = data;
        console.log(this.addressDirectionContainer)
      })
    })
  }


  openAddAddressDirectionForm() {
    if (!this.addAddressForm) {
      this.addAddressForm = true;
    } else {
      this.addAddressForm = false
    }
  }

  goToMercadoPago() {
    this.createPreference(this.address_selected, this.quotation_address_selected)
  }

  handlerOnAddAddress() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data

      const input = {
        asentamiento: 'La guadalupana',
        reference: 'casa de dos pisos',
        cp: "77724",
        exterior_house_number: "820",
        municipality: 'Solidaridad',
        state: 'Quintana Roo',
        city: 'Playa del carmen',
        name: 'Yahir',
        last_name: 'González',
        phone_number: "9841420792",
        street: 'Cerrada uruguay',
        crossStreet: 'Calle uruguay',
      }

      console.log(this.user_data)

      this._address.setNewAddress(input, this.user_data.user_ID).subscribe(data => {
        console.log(data)
        this.cpContainer.status = 'no'
      })

      this.openAddAddressDirectionForm()
    })
  }

  setCityToForm(city: AddressForcsec) {
    this.cityForm = city
    console.log(this.cityForm)
    this.searchCPForm.patchValue({
      city: this.cityForm.ciudad,
      asentamiento: this.cityForm.nombre
    })
  }

  hanlderOnSearchCp() {
    this.spinner_shipment = true
    this._address.searchCP(Number(this.searchCPForm.value.cp)).subscribe((res: any) => {
      this.spinner_shipment = false
      this.cpContainer = res;
      this.searchCPForm.controls['city']
      this.searchCPForm.controls['state']
      this.searchCPForm.controls['municipality']
      this.searchCPForm.patchValue({
        municipality: this.cpContainer.data.municipio,
        state: this.cpContainer.data.estado,
      })
    })
  }

  DeleteProductCart(product: Product) {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data
      this._auth.DeleteOneProduct(product.key, this.user_data.user_ID)
    })
  }

  openMercadoPagoScript(preference: string) {
    if (preference) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        'https://www.mercadopago.com.mx/integrations/v1/web-payment-checkout.js';
      script.dataset['preferenceId'] = preference
      script.setAttribute('data-button-label', "Pagar con Mercado Pago")
      const form = document.getElementById(this.FORM_ID)
      form?.appendChild(script);
    }
  }

  setshipmentAddress(address: Carrier) {
    this.quotation_address_selected = address

    let total = 0
    this.cart_container.forEach(function (unit_price: any) {
      total += unit_price.unit_price
    })

    console.log(this.quotation_address_selected)

    const shipmet_price = {
      title: `Envío por ${this.quotation_address_selected.carrier}`,
      unit_price: this.quotation_address_selected.total,
      quantity: 1,
      description: 'shipment'
    }

    this.shipment_item = shipmet_price

    this.productTotal = total + this.quotation_address_selected.total

    this.isFullShipment = true
  }

  setAddress(address: Address | any) {
    console.log(address)
    console.log(this.cart_container)
    this.address_selected = address
    this.spinner_shipment = true;
    this._store.GetQuotationProducts(address, this.cart_container).subscribe((data: any) => {
      this.spinner_shipment = false;
      this.quotation_address = data.data.rates
      console.log(this.quotation_address)
    })
  }

  ngOnInit(): void {
    this.getAllCartProduct()
    this.getAddressDirection()
  }
}
