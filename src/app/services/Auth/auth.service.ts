import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { User } from 'src/app/interfaces/User';
import * as CryptoJS from 'crypto-js';
import { Product } from 'src/app/interfaces/Products';
import { GoogleAuthProvider } from "firebase/auth";
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private UsersPath = 'Users';
  // private UsersCartPath = '';
  private messageEncrypt = "firebaseUserId"
  public tokenStatus: string | boolean = 'undefined';
  public userState: boolean = false;
  public userData!: User;
  public cartQuantifyContainer: any[] = [];

  usersRef: AngularFireList<User>
  usersCartRef!: AngularFireList<User>

  constructor(private _auth: AngularFireAuth, private _database: AngularFireDatabase, private http: HttpClient) {
    this.usersRef = _database.list(this.UsersPath);
  }

  async AuthLogin(provider: any) {
    return this._auth.signInWithPopup(provider);
  }

  RegisterWithGoogleAccount() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  RegisterWithEmailAndPassword(email: string, password: string) {
    return this._auth.createUserWithEmailAndPassword(email, password);
  }

  CreateUserInRealTimeDatabase(user: any, uid: any) {
    return this.usersRef.set(uid, user);
  }

  LoginWithEmailAndPassword(email: string, password: string) {
    return this._auth.signInWithEmailAndPassword(email, password);
  }

  IsUserLogged() {
    const uid: any = localStorage.getItem("uid")

    const objStr = JSON.parse(uid)

    const data = this._database.object(`${this.UsersPath}/${objStr.uid}`).valueChanges();
    data.subscribe(() => {
      return true
    })

  }

  GetCurrentDataUser() {
    const uid = this.DecryptUserId()
    return this._database.object(`${this.UsersPath}/${uid}`).valueChanges();
  }

  EncryptUserId(uid: string | undefined | null | any) {
    const encryptUser = CryptoJS.AES.encrypt(uid, this.messageEncrypt).toString();
    return encryptUser
  }

  GetAllAddressDirection(user_ID: string | null | undefined) {
    return this._database.list(`${this.UsersPath}/${user_ID}/address_direction`).valueChanges()
  }

  getAllCartProducts(user_ID: string | null | undefined): AngularFireList<User> {
    this.usersCartRef = this._database.list(`${this.UsersPath}/${user_ID}/cart_product`)
    return this.usersCartRef
  }

  DeleteOneProduct(key: string | undefined, user_ID: string | null | undefined) {
    this.usersCartRef = this._database.list(`${this.UsersPath}/${user_ID}/cart_product`)
    return this.usersCartRef.remove(key)
  }

  DecryptUserId() {

    if (localStorage.getItem('expiration')) {
      const uid: any = localStorage.getItem('expiration');
      const JSONData = JSON.parse(uid);

      if (new Date().getTime() - JSONData.expirationTime >= JSONData.expire) {
        return true
      } else {
        try {
          this.tokenStatus = CryptoJS.AES.decrypt(JSONData.uid, this.messageEncrypt).toString(CryptoJS.enc.Utf8);

        } catch (error) {
          return true;
        }

        return this.tokenStatus
      }
    }
    return true
  }

  CreateExpitarionToken(expire: any, uid: string) {

    const data = {
      expirationTime: new Date().getTime(),
      expire: expire,
      uid: uid
    }

    const objStr = JSON.stringify(data);
    localStorage.setItem("expiration", objStr)
  }

  VerifyIfTokenIsValid() {
    var timer = setInterval(function () {
      if (localStorage.getItem('expiration')) {
        const uid: any = localStorage.getItem('expiration');
        const JSONData = JSON.parse(uid);

        if (new Date().getTime() - JSONData.expirationTime >= JSONData.expire) {
          window.location.reload();

          localStorage.clear();
        } else {
          clearInterval(timer)
        }
      }
    }, 1000)
  }

  getAllUsers(){
    return this._database.list(this.UsersPath).snapshotChanges().pipe(
      map(users => {
        return users.map(user => {
          const data: any = user.payload.val();
          const id = user.payload.key;
          return {id, ...data}
        })
      })
    )
  }

  VerifyIfAccountGoogleExistInDatabase(emailFromGoogleAccount: string | undefined | null) {
    return this.getAllUsers().subscribe(res => {

      const email_array =  res.find(obj => obj.email === emailFromGoogleAccount)

      console.log(email_array)

      return email_array ? true : false;

    })

    // usersList.subscribe((res: any) => {
    //   for (let email of res) {
    //     if (email.email == emailFromGoogleAccount) {
    //       this.userState = true;
    //     }
    //   }
    // })

  }

  ResetPasswordWithEmail(email: string) {
    return this._auth.sendPasswordResetEmail(email);
  }

  UpdateUserCart(product: Product, user_ID: string | null | undefined) {

    const product_data = {
      product: product,
      user_ID: user_ID
    }

    return this.http.post("http://localhost:8080/set_cart_product", product_data)
  }

  GetCartQuantify() {
    const uid = this.DecryptUserId()
    return this._database.object(`${this.UsersPath}/${uid}/cart_product`).valueChanges();
  }

  hola() {
    this.GetCurrentDataUser().subscribe((res: any) => {
      this.userData = res;
      this._database.list(`${this.UsersPath}/${this.userData.user_ID}/cart_product`).remove()
    })
  }
}
