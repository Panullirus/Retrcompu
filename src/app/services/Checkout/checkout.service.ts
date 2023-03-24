import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { SoldProduct } from 'src/app/interfaces/Products';
import { User } from 'src/app/interfaces/User';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  public soldProductData: any = "";
  public userData: any = ""
  private SoldProductsPath = "SoldProducts"
  private UserPath = "Users"

  private SERVER_URI = "http://localhost:8080/create_preference"

  soldProductsRef: AngularFireList<SoldProduct>;
  usersRef: AngularFireList<User>

  constructor(private _database: AngularFireDatabase, private _http: HttpClient, private _auth: AuthService) {
    this.soldProductsRef = _database.list(this.SoldProductsPath)
    this.usersRef = _database.list(this.UserPath)
  }

  createMercadoPagoReferenceID(items: any) {
    return this._http.post(this.SERVER_URI, items)
  }

  // Save into User data
  saveProductSold(SoldProduct: any) {
    try {
      this._auth.GetCurrentDataUser().subscribe((res: any) => {

        this._database.object(`${this.UserPath}/${this.userData?.user_ID}`).update({
          purchased_products: SoldProduct
        })

        console.log(`${this.UserPath}/${this.userData?.user_ID}`)
      })
    } catch (error) {
      console.log("Error guardando compra => ", error)
    }
  }

}
