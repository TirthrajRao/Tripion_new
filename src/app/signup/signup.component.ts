import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import {data} from '../data';
import { AppComponent } from '../app.component';
declare const $: any;
class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  ports: Port[];
  port: Port;
  signUpForm: FormGroup;
  submitted: boolean = false;
  isDisable: Boolean = false;
  loading: Boolean = false;
  counries: any = [];
  selectedCountry: any;
  timeZoneList: any = data.timeZone


  constructor(
    public _userService: UserService, 
    // public _toastServices: ToastService,
    public router: Router,
    public appComponent: AppComponent,
    ) {
    this.signUpForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone_number: new FormControl('', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
      // home_town: new FormControl('', [Validators.required])
    });

    console.log("timezones",this.timeZoneList)
  }

  ngOnInit() {
    $(document).ready(function () {
      $('#myselection').select2({
        placeholder: "Select Timezone",
      });
    });

    $('#myselection').on('select2:select', (e) => {
      console.log(e.params.data.id)
      this.signUpForm.controls.home_town.setValue(e.params.data.id);
      console.log("data", this.signUpForm.value);
    });
  }

  get f() { return this.signUpForm.controls; }



  /**
   * Register User
   * @param {Object} data 
   */
   signUpUser(data) {
     this.submitted = true;
    //  data.dob = data.dob.split("T");
    //  const td = data.dob[1].split('.')
    //  data.dob = data.dob[0] + ' ' + td[0];
       
     console.log(data);
     if (this.signUpForm.invalid) {
       return;
     }

     console.log("data", data)
     this.isDisable = true;
     this.loading = true;
     this._userService.signUpUser(data).subscribe((res: any) => {
       console.log("register user", res);
       this.isDisable = false;
       this.loading = false;
       this._userService.sendDeviceToken().subscribe((response: any) => {
         console.log("res of devicedata in login", response);
       }, err => {
         console.log("errr", err);
         // this._toastServices.presentToast(err.error.message, 'danger')
       })
       // this._toastServices.presentToast(res.message, 'success')
       this.appComponent.sucessAlert("Registered Sucessfully")
       this.router.navigate(['/home']);
     }, (err) => {
       this.isDisable = false;
       this.loading = false;
       // this._toastServices.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert(err.error.message);
       console.log("err in register", err)
     })
   }

 }
