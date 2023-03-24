import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { User } from 'src/app/interfaces/User';
import { AuthService } from '../Auth/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  public userData: any = '';

  private UserPath = 'Users'

  private CP_URI = "https://apis.forcsec.com/api/codigos-postales"

  usersRef: AngularFireList<User>

  constructor(private _database: AngularFireDatabase, private _auth: AuthService, private http: HttpClient) {
    this.usersRef = _database.list(this.UserPath);
  }

  setNewAddress(address: any, user_ID: string | null | undefined) {
    return this.http.post("http://localhost:8080/save_address", { ...address, user_ID: user_ID })
  }

  searchCP(zipCode: number) {
    return this.http.get(`${this.CP_URI}/${environment.zipCodeService}/${zipCode}`)
  }

}
