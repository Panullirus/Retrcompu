import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Address } from 'src/app/interfaces/Address';
import { LabelShipment } from 'src/app/interfaces/Shipment';
import { Product } from 'src/app/interfaces/Products';
import { User } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from '../Auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public ENVIOCLICK_URI_QUOTATION = 'https://api.envioclickpro.com/api/v2/quotation';
  public ENVIOCLICK_CREATE_LABEL_URI = 'https://api.envioclickpro.com/api/v2/sandbox/shipment'
  public UPLOAD_IMAGE_URI = 'http://localhost:8080/save_image'
  public label_shipment!: LabelShipment;
  public user_data!: User;
  private ProductsPath = 'Products'
  private product = new BehaviorSubject<any>({})

  productsRef: AngularFireList<Product>

  constructor(private _database: AngularFireDatabase, private http: HttpClient, private _auth: AuthService) {
    this.productsRef = _database.list(this.ProductsPath);
  }

  setProduct(product: any){
    this.product.next(product)
  }

  getProduct(){
    return this.product.asObservable();
  }

  findProduct(product_id: string | null){
    return this._database.list(`Products/${product_id}`).valueChanges()
  }

  CreateProduct(product: Product) {
    return this.productsRef.push(product);
  }

  GetAllProducts() {
    return this._database.list(this.ProductsPath).snapshotChanges().pipe(
      map(products => {
        return products.map(product => {
          const data: any = product.payload.val();
          const id = product.payload.key;
          return {id, ...data}
        });
      })
    );
  }

  // CreateshipmentLabel(idRate: number, shipmentReference: string, product: Product, address: Address){
  //   this._auth.GetCurrentDataUser().subscribe((data: any) => {

  //     this.user_data = data
  //     const label: Labelshipment = {
  //       idRate: idRate,
  //       myShipmentReference: shipmentReference,
  //       requestPickup: true,
  //       pickupDate: Date(),
  //       insurance: true,
  //       package: {
  //         description: product.description,
  //         contentValue: String(product.unit_price),
  //         weight: 5,
  //         length: 30,
  //         height: 30,
  //         width: 20,
  //         items: [
  //           {
  //             c_ClaveUnidadPeso: "XPK",
  //             c_ClaveProdServCP: "31181701",
  //             c_MaterialPeligroso: null,
  //             c_TipoEmbalaje: null,
  //             contentValue: 100,
  //             units: 1
  //           }
  //         ]
  //       },
  //       origin: {
  //         company: "Retrocompu",
  //         rfc: "XAXX010101000",
  //         firstName: "Yahir",
  //         lastName: "González",
  //         email: "retrocompu@gmail.com",
  //         phone: "1234567890",
  //         street: "Cerrada uruguay",
  //         number: "820",
  //         initNumber: "1",
  //         suburb: "La Guadalupana",
  //         crossStreet: "Calle uruguay entre Cerrada uruguay",
  //         zipCode: "77724",
  //         reference: "Casa de dos pisos con valla de madera"
  //       },
  //       destination: {
  //         company: "N/A",
  //         rfc: "XAXX010101000",
  //         firstName: address.name,
  //         lastName: address.name,
  //         email: this.user_data.email,
  //         phone: String(address.phone_number),
  //         street: address.street,
  //         number: address.exterior_house_number,
  //         initNumber: "1",
  //         suburb: address.asentamiento.nombre,
  //         crossStreet: String(address.crossStreet),
  //         zipCode: String(address.cp),
  //         reference: address.reference
  //       }
  //     }

  //     this.label_shipment = label
  //   })
  //   return this.label_shipment
  // }

  GetQuotationProducts(address: Address, product: Product[]) {

    const address_quotation = {
      "origin_address": "Av. Revolución",
      "origin_number": "381",
      "origin_zip_code": "77724",
      "destination_address": address.street,
      "destination_number": address.exterior_house_number,
      "destination_zip_code": address.cp,
      "package": {
        "description": "Pink iPad",
        "contentValue": product[0].unit_price,
        "weight": product[0].box_size.weight,
        "length": product[0].box_size.length,
        "height": product[0].box_size.heigth,
        "width": product[0].box_size.width
      }
    }

    return this.http.post(this.ENVIOCLICK_URI_QUOTATION, address_quotation, { headers: { Authorization: environment.envioClickService } })
  }

  uploadImageProduct(image: any) {
    const data = image;
    return this.http.post(this.UPLOAD_IMAGE_URI, data)
  }

}
