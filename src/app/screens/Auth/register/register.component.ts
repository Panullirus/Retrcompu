import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    last_name: new FormControl('')
  })

  constructor(private _auth: AuthService, private route: Router) { }

  handlerOnRegister() {
    this._auth.RegisterWithEmailAndPassword(String(this.registerForm.value.email), String(this.registerForm.value.password))
      .then((res) => {

        const userData: Pick<User, "name" | "email" | "user_ID" | "saved_products" | "purchased_products" | "last_name"> = {
          name: String(this.registerForm.value.name),
          email: String(this.registerForm.value.email),
          last_name: String(this.registerForm.value.last_name),
          user_ID: res.user?.uid,
        }

        this._auth.CreateUserInRealTimeDatabase(userData, res.user?.uid)

        this.route.navigate([''])
      })
  }

  handlerOnLoginWithGoogle() {
    this._auth.RegisterWithGoogleAccount().then((res) => {

      const uid = this._auth.EncryptUserId(res.user?.uid)

      if (this._auth.VerifyIfAccountGoogleExistInDatabase(res.user?.uid)) {
        this._auth.CreateExpitarionToken(10800000, uid)
        this.route.navigate([''])
      } else {
        this._auth.CreateExpitarionToken(10800000, uid)

        const userData: Pick<User, "name" | "email" | "user_ID" | "saved_products"> = {
          name: String(res.user?.displayName),
          email: String(res.user?.email),
          user_ID: res.user?.uid,
        }

        this._auth.CreateUserInRealTimeDatabase(userData, res.user?.uid)

        this.route.navigate([''])
      }
    })
  }

}
