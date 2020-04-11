import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { Events } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  userData;
  editProfileForm: FormGroup;
  resetPswForm: FormGroup;
  submitted: boolean = true;
  submitted1: boolean = false;
  isDisable: Boolean = false;
  match = false;
  loading: Boolean = false;
  files: any;
  homeTownName: any


  constructor(
    public _userService: UserService,
    public _toastService: ToastService,
    public event: Events,
    public appComponent: AppComponent,
  ) {
    this.editProfileForm = new FormGroup({
      // user_name: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      // dob: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required]),
      phone_number: new FormControl('', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]),
      // home_town: new FormControl('', [Validators.required])
    });

    this.resetPswForm = new FormGroup({
      // old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      conform_password: new FormControl('', [Validators.required])
    })
    this.getUserProfile();
  }
  get f() { return this.editProfileForm.controls; }
  get f1() { return this.resetPswForm.controls; }

  ngOnInit() { }

  /**
   * Pull to refresh
   * @param {object} event
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getUserProfile();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * get user profile
   */
  getUserProfile() {
    this.loading = true;
    const data = {
      id: this.curruntUser.id
    }
    this._userService.getUserProfile(data).subscribe((res: any) => {
      console.log("user profile", res);

      this.userData = res.data;
      const obj = {
        profile_pic: res.data.profile_pic,
        user_name: res.data.user_name,
      }
      this.loading = false;
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      console.log("err", err);
      this.loading = false;
    })

  }


  /**
   * Edit user Profile
   * @param {object} data
   */
  editUserProfile(data) {
    console.log("data", data);
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }
    this.isDisable = true;
    this.loading = true;
    data['id'] = this.curruntUser.id;
    console.log("after valid", data);
    this._userService.editUserProfile(data).subscribe((res: any) => {
      console.log("res of edit profile", res);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
      this.userData = res.data;
      this.isDisable = false;
      this.loading = false;
      this.event.publish('userName', res.data);
      this.appComponent.sucessAlert("Update Successful");

    }, (err) => {
      console.log("err in edit profile", err);
      this.appComponent.errorAlert(err.error.message);
      this.isDisable = false;
      this.loading = false;
    })
  }

  /**
   * Open Reset password modal
   */
  openRedetPswModal() {
    $('#reset-password-modal').fadeIn();
    $('#reset-password-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#reset-password-modal').click(function () {
      $(this).fadeOut();
    });
  }

  /**
   * Compare password
   * @param form
   */
  comparePassword(form) {
    const message = document.getElementById('message');
    if (form.value.new_password === form.value.conform_password) {
      this.match = true;
      message.innerHTML = "Password matched!"
    } else {
      this.match = false;
      message.innerHTML = "Password not matched"
    }
  }

  /**
   * Reset Password
   * @param {Object} data
   */
  resetPassWord(data) {
    console.log(data);
    this.submitted1 = true;
    if (this.resetPswForm.invalid) {
      return
    }
    this.isDisable = true;
    this.loading = true;
    delete data.conform_password;
    data['id'] = this.curruntUser.id
    console.log(data);
    this._userService.resetPassWord(data).subscribe((res: any) => {
      console.log("res of reset psw", res);
      $('#reset-password-modal').fadeOut();
      this.isDisable = false;
      this.loading = false;
      this.resetPswForm.reset();
      this.submitted1 = false;
      this.appComponent.sucessAlert("Password Reset Successful")
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      console.log("err", err);
      this.isDisable = false;
      this.loading = false;
    })
  }


  uploadFile(e) {
    // this.loading = true;
    this.loading = true;
    console.log("eee", e.target.files);
    this.files = e.target.files;
    let data = new FormData();
    console.log("=========this.s", this.files)
    data.append('profile_pic', this.files[0]);
    data.append('id', this.curruntUser.id);
    console.log(data)
    this._userService.editUserProfile(data).subscribe((res: any) => {
      console.log("res", res);
      this.userData.profile_pic = res.data.profile_pic;
      localStorage.setItem('currentUser', JSON.stringify(res.data));
      this.event.publish('userName', res.data);
      this.loading = false;
      this.files = "";
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
  }

}
