import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-transfer-inquiry',
  templateUrl: './transfer-inquiry.component.html',
  styleUrls: ['./transfer-inquiry.component.scss'],
})
export class TransferInquiryComponent implements OnInit {

  formUrl: any = [];
  transferForm: FormGroup;
  submitted: Boolean = false;
  airArray: any = [];
  nextYear;
  curruntDate: string = new Date().toISOString();
  // formData = JSON.parse(localStorage.getItem('form_data'));

  constructor(public route: Router, public _tripService: TripService) {

    this.getFormUrl()

    this.transferForm = new FormGroup({
      from_date: new FormControl('', [Validators.required]),
      to_date: new FormControl('', [Validators.required]),
      transferBasis: new FormControl('Private'),
      transfer_basis_special_request: new FormControl(''),
      meal: new FormControl(''),
      seat_preference: new FormControl(''),
      tyre: new FormControl(''),
      air: new FormControl(''),
      chauffer_car_type: new FormControl(''),
      selfdrive_car_type: new FormControl(''),
      suggest_rental: new FormControl(''),
      cabin_category: new FormControl(''),
      shore_excrusion: new FormControl(''),
      city_cards: new FormControl('No', [Validators.required])
    });

  }

  ngOnInit() {
    this.getNextYear()
  }

  get f() { return this.transferForm.controls; }

  /**
   * get Form url for next form
   */
  getFormUrl() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    // this.formUrl.splice(0, 1);
    // localStorage.setItem('formId', JSON.stringify(this.formUrl));
    // console.log(this.formUrl);
  }

  /**
   * Get next year for datepicker
   */
  getNextYear() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +2;
  }

  /**
   * open next form
   * @param {Object} data 
   */
  nextForm(data) {
    console.log(data)
    this.submitted = true;

    data.from_date = data.from_date.split("T")[0];
    // const fd = data.from_date[1].split('.')
    // data.from_date = data.from_date[0] + ' ' + fd[0];

    data.to_date = data.to_date.split("T")[0];
    // const fd1 = data.to_date[1].split('.')
    // data.to_date = data.to_date[0] + ' ' + fd1[0];

    if (this.transferForm.invalid) {
      return
    }
    this.checkLocalStorageData();
    this.storeFormData(data);
    console.log(data)
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  // Store form data
  storeFormData(data) {
    const obj = {
      "transfer": data
    }
    this._tripService.storeFormData(obj);
  }

  /**
   * Get Air Checkbox value
   * @param {Object} e 
   */
  selectAir(e) {
    if (!this.airArray.includes(e.detail.value)) {
      this.airArray.push(e.detail.value);
    } else {
      var index = this.airArray.indexOf(e.detail.value);
      this.airArray.splice(index, 1);
    }
    console.log(this.airArray);
    this.transferForm.controls.air.setValue(this.airArray);
  }


  /**
   * Check and store data in local storage
   */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'transfers') {
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
        if (o.transfer) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }
      console.log("index of transfer in localstorage", localStorageFormData);
      // if (localStorageFormData.length) {
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
      // }
    }
  }
}
