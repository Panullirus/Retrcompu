import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/Store/store.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit{

  public product: any = {};
  public product_price: number = 0;

  constructor(private _store: StoreService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    var producto = urlParams.get('id');

    this._store.findProduct(producto).subscribe(data => {
      this.product = data;

      const price: any = this.product[12]

      this.product_price = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    })

  }

  getProductList(product: any){
    console.log(product)
  }



}
