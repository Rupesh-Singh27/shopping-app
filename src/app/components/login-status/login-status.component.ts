import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  
  isAutenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage; //reference to web browser's session storage

  constructor(private oktaAuthService: OktaAuthStateService,
  @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    
    //subscribe to the authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAutenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if (this.isAutenticated) {
      // Fetch the logged in user details (user's claims)

      //user's full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;

          //retrive the user's email from authentication response
          const theEmail = res.email;

          //now store the email in browser storage
          this.storage.setItem("email", JSON.stringify(theEmail));
        }
      )
    }
  }

  logout() {
    //Terminates the session with okta and removes current tokens.
    this.oktaAuth.signOut();
  }
}
