import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import {data} from '../data'
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


  constructor(public _userService: UserService, public _toastServices: ToastService, public router: Router) {
    this.signUpForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone_number: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      home_town: new FormControl('', [Validators.required])
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
      this._toastServices.presentToast(res.message, 'success')
      this.router.navigate(['/login']);
    }, (err) => {
      this.isDisable = false;
      this.loading = false;
      this._toastServices.presentToast(err.error.message, 'danger');
      console.log("err in register", err)
    })
  }

}
