import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/Auth/auth.service';
import { User } from '../interfaces/User';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private _breakpoint_observer: BreakpointObserver, private _auth: AuthService) { }

  public cart_container: number[] = [];
  public user_data!: User;
  public is_logged: boolean = true;

  is_handser: Observable<boolean> = this._breakpoint_observer.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches), shareReplay()
    );

  getCurrentUser() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data
      if (data == null) {
        this.is_logged = false;
        console.log("no hay")
      } else {
        console.log("si hay")
        this.is_logged = true;

      }
    })
  }

  setCartQuantify() {
    this._auth.GetCurrentDataUser().subscribe((data: any) => {
      this.user_data = data

      this._auth.getAllCartProducts(this.user_data?.user_ID).snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
        )
        )
      ).subscribe((data: any) => {
        this.cart_container = data
        console.log(this.cart_container)
      })
    })
  }

  signOut() {
    localStorage.removeItem('expiration')
    window.location.reload()
    this.is_logged = true
  }

  ngOnInit(): void {
    this.getCurrentUser()
    this.setCartQuantify()
  }

}
