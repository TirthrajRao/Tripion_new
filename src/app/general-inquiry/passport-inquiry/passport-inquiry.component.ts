import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-passport-inquiry',
  templateUrl: './passport-inquiry.component.html',
  styleUrls: ['./passport-inquiry.component.scss'],
})
export class PassportInquiryComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  categoryList = JSON.parse(localStorage.getItem('categoryList'));
  passportInquiryForm: FormGroup;
  submitted: Boolean = false;
  formUrl: any = [];
  loading: Boolean = false;
  selectedFormCategory;
  constructor(
    public _tripService: TripService,
    public route: Router,
    public _toastService: ToastService,
    public appComponent: AppComponent,
  ) {
    this.passportInquiryForm = new FormGroup({
      passport_inquiry_type: new FormControl('New Passport'),
      // firstName: new FormControl('', [Validators.required]),
      // lastName: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
      // address: new FormControl('', [Validators.required]),
      // city: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1);
    console.log("form url", this.formUrl);

    localStorage.setItem('formId', JSON.stringify(this.formUrl));

    console.log("caegory list", this.categoryList);
    _.forEach(this.categoryList, (category) => {

      if (category.slug == 'passport') {
        this.selectedFormCategory = category.id
      }

    })

  }

  get f() { return this.passportInquiryForm.controls }

  /**
  * get next form
  * @param {Object} data 
  */
  nextForm(data) {
    console.log("data in next forrm", data)
    this.submitted = true;

    if (this.passportInquiryForm.invalid) {
      return
    }
    this.loading = true;
    let formObject = [{ "passport": data }]
    const obj = {
      email: this.currentUser.email,
      id: this.currentUser.id,
      form_data: JSON.stringify(formObject),
      form_category: this.selectedFormCategory.toString(),
    }
    console.log("object", obj)
    this._tripService.addPassportForm(obj).subscribe((res: any) => {
      console.log("passport res", res);
      this.loading = false;
      // this._toastService.presentToast(res.message, 'success')
      this.appComponent.sucessAlert("Inquiry Submitted!! We have sent you the mail");
      if (this.formUrl.length) {
        this.route.navigate(['/home/' + this.formUrl[0]])
      } else {
        this.route.navigate(['/home']);
      }
    }, err => {
      console.log("err", err);
      this.loading = false;
      // this._toastService.presentToast(err.error.message, 'danger')
      this.appComponent.errorAlert(err.error.message);
    })
    // this.storeFormData(data);

  }

  // Store form data
  storeFormData(data) {
    console.log("data", data)
    const obj = {
      "passport-inquiry": data
    }
    this._tripService.storeFormData(obj);
  }
}
