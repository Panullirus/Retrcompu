import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SoldProduct } from 'src/app/interfaces/Products';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { PurchaseService } from 'src/app/services/Purchase/purchase.service';

@Component({
  selector: 'app-purchased-products',
  templateUrl: './purchased-products.component.html',
  styleUrls: ['./purchased-products.component.scss']
})
export class PurchasedProductsComponent implements OnInit {
  public spinner!: boolean;

  public purchased_user_products: any = []
  public user_products!: [SoldProduct] | any
  public user_products_container = [];
  public user_data!: User;

  constructor(private _auth: AuthService, private _purchases: PurchaseService, private route: Router) { }

  getUserPurchasedProducts() {
    this.spinner = true;
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data
      this._purchases.getAllPurchases(this.user_data.user_ID).snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
        )
        )
      ).subscribe((data: any) => {
        this.spinner = false;
        this.user_products = data
        console.log(data)
      })
    })
  }

  goToVerCompras(purchase: SoldProduct) {
    this.route.navigate([`compras/status`], { queryParams: { order: purchase.key } })
  }

  ngOnInit(): void {
    this.getUserPurchasedProducts();
  }
}
