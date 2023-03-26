import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { SoldProduct } from 'src/app/interfaces/Products';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private UsersPath = 'Users'

  purchaseRef!: AngularFireList<SoldProduct>

  constructor(private _auth: AngularFireAuth, private _database: AngularFireDatabase, private _http: HttpClient) { }

  getAllPurchases(user_ID: string | null | undefined) {
    this.purchaseRef = this._database.list(`${this.UsersPath}/${user_ID}/purchased_products`)
    return this.purchaseRef
  }

  getPurchaseUser(user_ID: string | null | undefined, purchase_id: string | null) {
    return this._database.list(`${this.UsersPath}/${user_ID}/purchased_products/${purchase_id}`).valueChanges();
  }
}
