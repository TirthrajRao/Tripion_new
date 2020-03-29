import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPswForm: FormGroup;
  submitted: boolean = false;
  isDisable: Boolean = false;
  submmitedFPsw: boolean = false;
  loading: Boolean = false;
  constructor(
    public _userServices: UserService,
    public _toastServices: ToastService,
    private googlePlus: GooglePlus,
    public router: Router,
    private fb: Facebook,
    public http: HttpClient,
    public appComponent: AppComponent,
    ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.forgotPswForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
    if (this._userServices.currentUserValue) {
      this.router.navigate(['/home']);
    }

  }

  ngOnInit() {
    this.openModal()
  }

  get f() { return this.loginForm.controls; }
  get fpsw() { return this.forgotPswForm.controls; }

  /**
   * user Login
   * @param { Object}data
   */
   loginUser(data) {
     this.submitted = true;
     console.log("form data", this.isDisable);
     if (this.loginForm.invalid) {
       return;
     }
     this.isDisable = true;
     this.loading = true;
     this._userServices.loginUser(data).subscribe((res: any) => {
       console.log("login res", res);
       this.isDisable = false;
       this._userServices.sendDeviceToken().subscribe((response: any) => {
         console.log("res of devicedata in login", response);
       }, err => {
         console.log("errr", err);
         // this._toastServices.presentToast(err.error.message, 'danger')
       })
       this.loading = false;
       // this._toastServices.presentToast(res.message, 'success');
       this.appComponent.sucessAlert("Login Sucessfull","Welcome")
       this.router.navigate(['/home']);
       this.loginForm.reset();
       this.submitted = false;
     }, (err) => {
       console.log("err in login", err);
       this.appComponent.errorAlert(err.error.message);
       // this._toastServices.presentToast(err.error.message, 'danger');
       this.isDisable = false;
       this.loading = false;
     })
   }

  /**
   * Google Login
   */
   googleLogin() {
     this.loading = true;
     this.isDisable = true;
     this.googlePlus.login({})
     .then((res) => {
       console.log("google login res", res);
       const data = {
         social_login_id: res.userId,
         access_token: res.accessToken,
         social_login_type: 'google',
         username: res.givenName + ' ' + res.familyName,
         email: res.email
       }
       this._userServices.loginUser(data).subscribe((res: any) => {
         console.log("res of google login", res);
         this._userServices.sendDeviceToken().subscribe((response) => {
           console.log("token res", response);
         }, err => {
           console.log("errr", err)
         })
          this.appComponent.sucessAlert("Login Sucessfull","Welcome")
         // this._toastServices.presentToast(res.message, 'success');
         this.loading = false;
         this.isDisable = false;
         if(res.data.home_town){
          this.router.navigate(['/home']);
        }else{
          console.log("in else")
          this.router.navigate(['/home/profile'])
        }
        
       }, (err) => {
         // this._toastServices.presentToast(err.error.message, 'danger');
         this.appComponent.errorAlert(err.error.message);
         console.log("err in google login", err);
         this.loading = false;
         this.isDisable = false;
       })
     })
     .catch((err) => {
       // this._toastServices.presentToast("Error in Google Login", 'danger')
       this.appComponent.errorAlert("Error in Google Login");
       console.error("err", err);
       this.loading = false;
       this.isDisable = false
     });
   }

  /**
   * Facebook Login
   */
   facebookLogin() {
     this.loading = true;
     this.isDisable = true;
     let permissions = new Array<string>();
     //the permissions your facebook app needs from the user
     permissions = ["public_profile", "email"];
     this.fb.login(permissions)
     .then((response: FacebookLoginResponse) => {
       console.log('response=============>', response);
       this.fetchFacebookData(response.authResponse.accessToken).subscribe(async (res: any) => {
         console.log('facebook data============>', res);
         const userId = response.authResponse.userID
         const data = {
           social_login_id: userId,
           access_token: response.authResponse.accessToken,
           social_login_type: 'facebook',
           username: res.name
         }
         if (res.email) {
           data['email'] = res.email
         }
         await this._userServices.loginUser(data).subscribe((res: any) => {
           console.log("res of fb login", res);
           this._userServices.sendDeviceToken().subscribe((response) => {
             console.log("res===>", response);
           }, err => {
             console.log("errr===in fb login", err);
             this.loading = false;
             this.isDisable = false
           });
            this.appComponent.sucessAlert("Login Sucessfull","Welcome")
           // this._toastServices.presentToast(res.message, 'success');
           this.loading = false;
           this.isDisable = false;
           if(res.data.home_town){
             this.router.navigate(['/home']);
           }else{
             console.log("in else")
             this.router.navigate(['/home/profile'])
           }
         }, (err) => {
           // this._toastServices.presentToast(err.error.message, 'danger');
           this.appComponent.errorAlert(err.error.message);
           console.log("err in fb login", err);
           this.loading = false;
           this.isDisable = false;
         })
       })
     })
     .catch((err) => {
       console.error("err", err);
       this.loading = false;
       this.isDisable = false;
       // this._toastServices.presentToast("Error in facebook Login", 'danger')
       this.appComponent.errorAlert("Error in Facebook Login");
     });
   }
   fetchFacebookData(accessToken) {
     return this.http.get("https://graph.facebook.com/v5.0/me?access_token=" + accessToken + "&debug=all&fields=id,name,birthday,first_name,last_name,hometown,locale,gender,email&format=json&method=get&pretty=1&suppress_http_code=1")
   }
  /**
   * Forgot password
   * @param {Object} data
   */
   forgotPassword(data) {
     console.log(data);
     this.submmitedFPsw = true;
     if (this.forgotPswForm.invalid) {
       return
     }
     this.loading = true;
     this.isDisable = true;
     this._userServices.forgotPassword(data).subscribe((res: any) => {
       console.log("res of forgot psw", res);
       this.loading = false;
       this.isDisable = false;
       $("#forgot-password").fadeOut();
       this.appComponent.sucessAlert("Please Check your mail")
     }, (err) => {
       console.log("err in f psw", err);
       // this._toastServices.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert(err.error.message);
       this.loading = false;
       this.isDisable = false;
       $("#forgot-password").fadeOut();
     })
   }

   openModal() {
     $('#forgot-psw').click(function () {
       console.log("====")
       $('#forgot-password').fadeIn();
     });
     $('#forgot-password .modal_body').click(function (event) {
       event.stopPropagation();
     });
     $('#forgot-password').click(function () {
       $(this).fadeOut();
     });
   }

 }
