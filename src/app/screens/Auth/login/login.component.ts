import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private _auth: AuthService, private route: Router) { }

  handlerOnLogin() {
    this._auth.LoginWithEmailAndPassword(String(this.loginForm.value.email), String(this.loginForm.value.password)).then((res: any) => {
      const uid = this._auth.EncryptUserId(res.user?.uid)
      this._auth.CreateExpitarionToken(10800000, uid)
      this.route.navigate(['productos'])

    })
  }

  handlerOnLoginWithGoogle() {
    this._auth.RegisterWithGoogleAccount().then((res) => {

      const uid = this._auth.EncryptUserId(res.user?.uid)

      if (this._auth.VerifyIfAccountGoogleExistInDatabase(res.user?.uid)) {
        console.log("Usuario ya existe => ", res)
        this._auth.CreateExpitarionToken(10800000, uid)
        this.route.navigate([''])
      } else {
        console.log("No existe usuario, creando...")
        this._auth.CreateExpitarionToken(10800000, uid)

        const userData: Pick<User, "name" | "email" | "user_ID" | "saved_products" | "purchased_products" | "image_profile"> = {
          name: String(res.user?.displayName),
          email: String(res.user?.email),
          user_ID: res.user?.uid,
          saved_products: 0,
          purchased_products: 0,
          image_profile: '',
        }

        this._auth.CreateUserInRealTimeDatabase(userData, res.user?.uid)

        this.route.navigate([''])
      }
    })
  }
}
