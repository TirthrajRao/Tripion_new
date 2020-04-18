import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-other-details-inquiry',
  templateUrl: './other-details-inquiry.component.html',
  styleUrls: ['./other-details-inquiry.component.scss'],
})
export class OtherDetailsInquiryComponent implements OnInit {
  formUrl: any = [];
  otherDetailsForm: FormGroup;
  submitted: Boolean = false;
  paymentModeArray: any = [];
  communicationModeArray: any = [];
  formData = JSON.parse(localStorage.getItem('form_data'));
  isTripInquiry: any = JSON.parse(localStorage.getItem('isTripInquiry'))
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  selectedFormCategory = JSON.parse(localStorage.getItem('selectedFormCategory'));
  isDisable: Boolean = false;
  userData;
  loading: Boolean = false;
  constructor(
    public route: Router,
    public _tripService: TripService,
    public _toastService: ToastService,
    public _userService: UserService,
    public appComponent: AppComponent,
  ) {
    this.otherDetailsForm = new FormGroup({
      // communication_mode: new FormControl(''),
      // budget_preference: new FormControl('', [Validators.required]),
      // budget_amount: new FormControl('', [Validators.required]),
      // payment_mode: new FormControl(''),
      // number_of_plans: new FormControl('')


      communication_mode: new FormControl(''),
      budget_preference: new FormControl(''),
      budget_amount: new FormControl(''),
      payment_mode: new FormControl(''),
      // number_of_plans: new FormControl('')
    })
    // this.getUserDetail();
  }

  ngOnInit() {
    this.getFormUrl();
    console.log(this.isTripInquiry)
  }
  get f() { return this.otherDetailsForm.controls; }

  // Get Form Url For next form
  getFormUrl() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
  }

  /**
   * Get User Details
   */
  getUserDetail() {
    const data = {
      id: this.currentUser.id
    }
    this._userService.getUserProfile(data).subscribe((res: any) => {
      console.log("user profile", res);
      this.userData = res.data;
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      console.log("err", err);
    })
  }


  nextForm(data) {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'other-details') {
      this.formUrl.splice(0, 1);
      localStorage.setItem('formId', JSON.stringify(this.formUrl));
    }
    this.submitted = true;
    console.log(data);
    this.submitted = true;
    if (this.otherDetailsForm.invalid) {
      return;
    }
    this.checkLocalStorageData();
    if (!this.currentUser.email) {
      alert('Please add your email in your Profile');
      return;
    } else {
      console.log(this.formData);
      // data['total_plan_payment'] = this.amount
      const object = {
        "other_detail": data
      }
      this._tripService.storeFormData(object)
      let formData = JSON.parse(localStorage.getItem('form_data'))
      console.log("form data", JSON.parse(localStorage.getItem('form_data')));
      console.log("selected form", JSON.parse(localStorage.getItem('selectedForm')))
      let formObject = {};
      _.forEach(JSON.parse(localStorage.getItem('selectedForm')), (form, index) => {
        formObject[index + 1] = form
      })
      const selectedForms = {
        "selected_forms": formObject
      }
      console.log("formobject", formObject, selectedForms);
      let localStorageFormData = JSON.parse(localStorage.getItem('form_data'))
      let result, index;
      localStorageFormData.some((o, i) => {
        console.log(i, o);
        if (o.selected_forms) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (!result) {
        console.log("not result")
        formData.unshift(selectedForms);
      }
      localStorage.setItem('form_data', JSON.stringify(formData));
      console.log(this.formData);
      // this.route.navigate(['/home/premium-account'], navigationExtras);
      this.route.navigate(['/home/information-pack'])

    }
  }

  /**
   * get selected payment mode value
   * @param {Object} e 
   */
  selectPaymentMode(e) {
    if (!this.paymentModeArray.includes(e.detail.value)) {
      this.paymentModeArray.push(e.detail.value);
    } else {
      var index = this.paymentModeArray.indexOf(e.detail.value);
      this.paymentModeArray.splice(index, 1);
    }
    console.log(this.paymentModeArray);
    this.otherDetailsForm.controls.payment_mode.setValue(this.paymentModeArray);
  }


  selectCommunicationMode(e) {
    if (!this.communicationModeArray.includes(e.detail.value)) {
      this.communicationModeArray.push(e.detail.value);
    } else {
      var index = this.communicationModeArray.indexOf(e.detail.value);
      this.communicationModeArray.splice(index, 1);
    }
    console.log(this.communicationModeArray);
    this.otherDetailsForm.controls.communication_mode.setValue(this.communicationModeArray);
  }



  /**
   * Check and store data in local storage
   */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'other-details') {
      this.formUrl.splice(0, 1);
      localStorage.setItem('formId', JSON.stringify(this.formUrl));
    }
    console.log("local storage form data", JSON.parse(localStorage.getItem('form_data')));
    const localStorageFormData = JSON.parse(localStorage.getItem('form_data'))
    let index;
    if (localStorageFormData.length) {
      let result;
      localStorageFormData.some((o, i) => {
        console.log(i, o);
        if (o.other_detail) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }

      console.log("index of other_detail in localstorage", localStorageFormData);
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
    }
  }

}
