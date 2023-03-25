import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screens/Auth/login/login.component';
import { RegisterComponent } from './screens/Auth/register/register.component';
import { PurchasedProductsComponent } from './screens/Profile/purchased-products/purchased-products.component';
import { Purchased2ProductsComponent } from './screens/Profile/purchased2-products/purchased2-products.component';
import { CartComponent } from './screens/Store/cart/cart.component';
import { ProductInfoComponent } from './screens/Store/product-info/product-info.component';
import { ProductsComponent } from './screens/Store/products/products.component';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'registrarse', component: RegisterComponent},
  {path: 'ingresar', component: LoginComponent},
  {path: 'carrito', component: CartComponent},
  {path: 'producto', component: ProductInfoComponent},
  {path: 'compras', component: PurchasedProductsComponent},
  {path: 'compras/status', component: Purchased2ProductsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
