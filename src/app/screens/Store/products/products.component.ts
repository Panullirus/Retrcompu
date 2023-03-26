import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { StoreService } from 'src/app/services/Store/store.service';
import { Product } from 'src/app/interfaces/Products';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  public spinner!: boolean;

  public enableMiPrice: boolean = false;
  public enableMaPrice: boolean = false;

  public MSI: number = 3
  public spinner_shipment!: boolean;
  public user_data!: User;
  public is_user: boolean = false;
  public is_not_user: boolean = false;
  public products_container!: any[];
  public filtered_product_container!: any[] | undefined;
  public other_filters!: any;
  public cart_contianer: any | number = [];
  public cart_quantify_container: any[] = [];

  constructor(private route: Router, private _auth: AuthService, private _store: StoreService, private _snackBat: MatSnackBar) { }

  handlerGoToRegister() {
    this.route.navigate(['registrarse'])
  }

  handlerGoToLogin() {
    this.route.navigate(['ingresar'])
  }

  setMiPrice(item: any) {

    if (this.enableMaPrice) {
      this.enableMaPrice = false
      this.enableMiPrice = true

      if (item) {
        if (this.filtered_product_container == undefined) {
          this.products_container.sort((a: any, b: any) => {
            return a.unit_price - b.unit_price
          })
        } else {
          this.filtered_product_container.sort((a: any, b: any) => {
            return a.unit_price - b.unit_price
          })
        }
      } else {
        this.handlerGetAllProducts()
      }
    }

    this.enableMiPrice

    if (item) {
      if (this.filtered_product_container == undefined) {
        this.products_container.sort((a: any, b: any) => {
          return a.unit_price - b.unit_price
        })
      } else {
        this.filtered_product_container.sort((a: any, b: any) => {
          return a.unit_price - b.unit_price
        })
      }
    } else {
      this.handlerGetAllProducts()
    }

  }

  goToProductInfo(producto: any) {

    this._store.setProduct(producto)

    const url_data = {
      category: producto.category_id,
      title: producto.title,
      id: producto.id
    }

    const url = this.route.createUrlTree([`producto`], {
      queryParams: url_data
    })

    this.route.navigateByUrl(url.toString())
  }

  setMaPrice(item: any) {
    if (this.enableMiPrice) {
      this.enableMiPrice = false
      this.enableMaPrice = true
      if (item) {
        if (this.filtered_product_container == undefined) {
          this.products_container.sort((a: any, b: any) => {
            return b.unit_price - a.unit_price
          })
        } else {
          this.filtered_product_container.sort((a: any, b: any) => {
            return b.unit_price - a.unit_price
          })
        }
      } else {
        this.handlerGetAllProducts()
      }
    }

    this.enableMaPrice = true

    if (item) {
      if (this.filtered_product_container == undefined) {
        this.products_container.sort((a: any, b: any) => {
          return b.unit_price - a.unit_price
        })
      } else {
        this.filtered_product_container.sort((a: any, b: any) => {
          return b.unit_price - a.unit_price
        })
      }
    } else {
      this.handlerGetAllProducts()
    }
  }



  handlerOnGetUserData() {
    this.spinner = true;
    this._auth.GetCurrentDataUser().subscribe((data: any) => {

      this.user_data = data

      this.spinner = false

      if (data) {
        this.is_user = true;
      } else {
        this.is_not_user = true;
      }
    });
  }

  findByRefurbishedType(type: string) {
    if (this.filtered_product_container == undefined) {
      console.log("Entró")
      const finded = this.products_container.filter(product => product.refurbished_info.refurbished_type == type);
      this.filtered_product_container = finded
    } else {
      if (type == 'A' || 'B' || 'C') {
        console.log("No entró pero sigue buscando tipo")
        const finded = this.products_container.filter(product => product.refurbished_info.refurbished_type == type);
        this.filtered_product_container = finded
      } else {
        console.log("No entró")
        const finded = this.filtered_product_container.filter(product => product.refurbished_info.refurbished_type == type);
        this.filtered_product_container = finded
      }
    }
  }

  findByRefurbishedBrand(type: string) {
    console.log(this.filtered_product_container)

    if (this.filtered_product_container == undefined) {
      console.log("Entró")
      const finded = this.products_container.filter(product => product.laptop_info.brand == type);
      this.filtered_product_container = finded
    } else {
      if (type == 'Asus' || 'HP' || 'Apple') {
        console.log("No entró pero sigue buscando tipo", this.filtered_product_container)
        const finded = this.products_container.filter(product => product.refurbished_info.refurbished_type == type);
        this.filtered_product_container = finded
      } else {
        console.log("No entró a la segunda")

        if (type == 'Asus' || 'HP' || 'Apple') {
          console.log("Entró a la tercera")
          const finded = this.products_container.filter(product => product.laptop_info.brand == type);
          this.filtered_product_container = finded
        }
        const finded = this.filtered_product_container.filter(product => product.laptop_info.brand == type);
        this.filtered_product_container = finded
      }
    }
    // if(this.filteredProductContainer == undefined){
    //   console.log("Entró")
    //   const finded = this.productsContainer.filter(product => product.laptop_info.brand == type);
    //   this.filteredProductContainer = finded
    // }else{
    //   console.log("No entró")
    //   const finded = this.filteredProductContainer.filter(product => product.laptop_info.brand == type);
    //   this.filteredProductContainer = finded
    // }
  }

  deleteFilter() {
    this.filtered_product_container = undefined;

  }

  handlerGetAllProducts() {
    this._store.GetAllProducts().subscribe(res => {

      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      const setMSI = res.map((c: any) => ({ ...{ msi: currencyFormatter.format(c.unit_price / this.MSI) }, ...c }));

      this.products_container = setMSI.map((c: any) => ({ ...{ price_formatted: currencyFormatter.format(c.unit_price) }, ...c }))

      console.log(this.products_container)

    })
  }

  signOut() {
    localStorage.removeItem('expiration')
    window.location.reload()
  }

  setProductCart(product: Product) {
    try {
      this._auth.GetCurrentDataUser().subscribe((data: any) => {
        this.user_data = data
      })

      // Mostrar spinner
      const button = document.querySelector('.add-cart');
      if (button) {
        button.classList.add('loading');

        this._auth.UpdateUserCart(product, this.user_data.user_ID).subscribe(() => {
          // Ocultar spinner y mostrar símbolo de check después de 500ms
          setTimeout(() => {
            button.classList.remove('loading');
            button.classList.add('success');
            setTimeout(() => {
              // Restablecer botón después de otros 500ms
              button.classList.remove('success');
            }, 5000);
          }, 5000);

          this._snackBat.open('Producto agregado al carrito', 'Cerrar')
        })
      }

    } catch (error) {
      alert('ingresa para agregar al carrito')
    }
  }


  setCartQuantify() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data

      this._auth.getAllCartProducts(this.user_data?.user_ID).snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
        )
        )
      ).subscribe(data => {
        this.cart_contianer = data
      })
    })
  }

  ngOnInit(): void {
    this.handlerOnGetUserData();
    this.handlerGetAllProducts();
    this.setCartQuantify();
  }

}
