import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screens/Auth/login/login.component';
import { RegisterComponent } from './screens/Auth/register/register.component';
import { ProductsComponent } from './screens/Store/products/products.component';

const routes: Routes = [
  {path: 'registrarse', component: RegisterComponent},
  {path: 'productos', component: ProductsComponent},
  {path: 'ingresar', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
