import { Component, OnInit } from '@angular/core';
import { UserAccountService } from "../user-account.service";
import { Account } from "../account";
import { report } from 'process';
import { Observable } from "rxjs";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  userCode: string;
  token: string ;
  consent: string;
  allAccounts: [];

  constructor(private userAccountService: UserAccountService) { }

  ngOnInit(): void {
    console.log(window.location.href);
    let codeHalf = window.location.href.split('#code=')[1];//.slice(0, string.indexOf("&"));
    console.log(codeHalf);

    if (codeHalf != undefined) {
      let code = codeHalf.split('&i')[0];
      console.log(code);
     
      this.getToken(code);
    }

  }

  getUserAccountList() {
    this.userAccountService.getUserAccountList().subscribe((response) => {
      console.log("res" + response);
      // console.log("res 2"+ response);
      window.location.href = '' + response;
    })
  }

  getToken(code: string) {
    this.userAccountService.getToken(code).subscribe((response) => {
      console.log("res" + response);
       console.log("res 2 "+ response.access_token);
      this.token = response.access_token;
      console.log("this.token " + this.token);
      this.getAispConsent(this.token);
    })
     
  }

  getAispConsent(token : string)
  {
    console.log("rgetAispConsent "+ this.token);
    this.userAccountService.getConsent(this.token).subscribe((response) => {
      console.log("getAispConsent" + response.Data.ConsentId);
       this.consent = response.Data.ConsentId
     
       this.getAuthorization( );
    })
  }

  getAuthorization()
  {
    this.userAccountService.getAuthorization(this.consent).subscribe((response) => {
     // console.log("getAuthorization" + response.status);
      this.getAccount();
    })
  }

  getAccount()
  {
    console.log("getAccount "+ this.consent);

    this.userAccountService.getAccount(this.token).subscribe((response) => {
      console.log("getAccount" + response.Data.Account);
      this.allAccounts = response.Data.Account;
      // console.log("getAuthorization 2"+ response.access_token);
      // window.location.href = '' + response;
    })
  }
}
