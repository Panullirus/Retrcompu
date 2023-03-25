import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './screens/Auth/login/login.component';
import { RegisterComponent } from './screens/Auth/register/register.component';
import { CartComponent } from './screens/Store/cart/cart.component';
import { PurchaseStatusComponent } from './screens/Store/purchase-status/purchase-status.component';
import { PurchasesComponent } from './screens/Store/purchases/purchases.component';
import { ProductsComponent } from './screens/Store/products/products.component';
import { MercadoPagoComponent } from './screens/Store/mercado-pago/mercado-pago.component';
import { ProductInfoComponent } from './screens/Store/product-info/product-info.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//ANGULAR MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardModule } from '@angular/cdk/clipboard';


//ANGULAR FIREBASE
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { PurchasedProductsComponent } from './screens/Profile/purchased-products/purchased-products.component';
import { Purchased2ProductsComponent } from './screens/Profile/purchased2-products/purchased2-products.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    RegisterComponent,
    CartComponent,
    PurchaseStatusComponent,
    PurchasesComponent,
    ProductsComponent,
    MercadoPagoComponent,
    ProductInfoComponent,
    NavigationComponent,
    PurchasedProductsComponent,
    Purchased2ProductsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    //ANGULAR MATERIAL
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatExpansionModule,
    ClipboardModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatIconModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }
