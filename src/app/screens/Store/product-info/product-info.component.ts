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

  constructor(private _store: StoreService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    var producto = urlParams.get('id');

    const data = this._store.findProduct(producto).subscribe(data => {
      console.log(data)
    })

  }



}
