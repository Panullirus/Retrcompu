import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Address } from 'src/app/interfaces/Address';
import { Product } from 'src/app/interfaces/Products';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { PurchaseService } from 'src/app/services/Purchase/purchase.service';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { faBoxesPacking } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-purchased2-products',
  templateUrl: './purchased2-products.component.html',
  styleUrls: ['./purchased2-products.component.scss']
})
export class Purchased2ProductsComponent implements OnInit {
  faTruckFast = faTruckFast
  faBoxesPacking = faBoxesPacking
  faHouse = faHouse

  public spinner!: boolean;

  public cancel_shipment: boolean = true;
  public shipment_label: any = [];
  public payment_data!: any;
  public address_to!: Address;
  public purchase_id!: number;
  public user_data!: User;
  public purchase_product!: [Product];
  public product_bought!: [Product];

  constructor(private _purchases: PurchaseService, private _auth: AuthService, private route: Router) { }

  searchPurchaseFromUrl() {
    const queryString = window.location.search;
    const urlPurchaseParam = new URLSearchParams(queryString)

    return urlPurchaseParam.get('order')
  }

  cancelProduct() {
    this.cancel_shipment = false
  }

  getPurchase() {
    this.spinner = true;
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data

      const key = this.searchPurchaseFromUrl()

      try {
        this._purchases.getPurchaseUser(this.user_data.user_ID).snapshotChanges().pipe(
          map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
          )
          )
        ).subscribe(data => {
          this.spinner = false;

          const product: any = data.filter(function (el) {
            return el.key == key
          })

          this.shipment_label = product[0].shipment_label.data
          this.purchase_product = product
          this.purchase_id = product[0].merchant_order_id
          this.product_bought = product[0].retrocompu_user_data.cart_products
          this.address_to = product[0].retrocompu_user_data.addressTo
          this.payment_data = product[0]

        })
      } catch (error) {
        this.route.navigate(['404'])
      }
    })
  }

  ngOnInit(): void {
    this.getPurchase()
    this.searchPurchaseFromUrl()
  }

}
