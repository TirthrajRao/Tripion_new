import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
declare const $: any
@Component({
  selector: 'app-visa-inquiry',
  templateUrl: './visa-inquiry.component.html',
  styleUrls: ['./visa-inquiry.component.scss'],
})
export class VisaInquiryComponent implements OnInit {
  formUrl: any = [];
  visaForm: FormGroup;
  submitted: boolean = false;
  isChecked: Boolean = true;
  inputValue: any;
  sponsor = 'Yes';
  previous_rejections = 'Yes';
  international_travel = 'Yes';
  curruntDate: string = new Date().toISOString();
  // formData = JSON.parse(localStorage.getItem('form_data'));
  nextYear;

  constructor(public route: Router, public _tripService: TripService) {
    this.visaForm = new FormGroup({
      purpose_of_travel: new FormControl('Business'),
      visa_type: new FormControl('Business', [Validators.required]),
      previous_rejections: new FormControl('Yes'),
      previous_rejections_details: new FormControl('', [Validators.required]),
      international_travel: new FormControl('Yes'),
      international_travel_details: new FormControl('', [Validators.required]),
      sponsor: new FormControl('Yes'),
      sponsor_detail: new FormControl('', [Validators.required]),
      applicants: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    // this.formUrl.splice(0, 1);
    // localStorage.setItem('formId', JSON.stringify(this.formUrl));
    this.nextYearCount()
  }
  get f() { return this.visaForm.controls; }

  /**
   * get next form
   * @param {Object} data 
   */
  nextForm(data) {
    console.log("data in next forrm", data)
    if (data.previous_rejections == 'No')
    this.visaForm.controls.previous_rejections_details.setValue('No');
    if (data.international_travel == 'No')
    this.visaForm.controls.international_travel_details.setValue('No');
    if (data.sponsor == 'No')
    this.visaForm.controls.sponsor_detail.setValue('No');
    console.log(data)
    this.submitted = true;
    if (this.visaForm.invalid) {
      return
    }
    this.checkLocalStorageData();
    console.log("data", data)
    this.storeFormData(data);
    this.visaForm.controls.previous_rejections_details.setValue('');
    this.visaForm.controls.international_travel_details.setValue('');
    this.visaForm.controls.sponsor_detail.setValue('');
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  // Store form data
  storeFormData(data) {
    console.log("data", data)
    const obj = {
      "visa": data
    }
    this._tripService.storeFormData(obj);
  }

  changeInputValue(e) {
    this.visaForm.controls.visa_type.setValue(e.target.value);
  }

  selectVisaType(e) {
    $('#other-input').val("");
    this.visaForm.controls.visa_type.setValue(e.target.value);
  }

  nextYearCount() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +11;
  }


  /**
  * Check and store data in local storage
  */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'visa') {
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
        if (o.visa) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }
      console.log("index of visa in localstorage", localStorageFormData);
      // if (localStorageFormData.length) {
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
      // }
    }
  }
}
