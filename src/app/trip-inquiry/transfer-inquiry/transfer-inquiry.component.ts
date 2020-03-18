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
  airArray: any=[];
  nextYear;
  curruntDate: string = new Date().toISOString();
  // formData = JSON.parse(localStorage.getItem('form_data'));

  constructor(public route: Router,public _tripService:TripService) {

    this.getFormUrl()
    
    this.transferForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      transferBasis: new FormControl('Private'),
      TransferBasisSpecialReq: new FormControl(''),
      meal: new FormControl(''),
      seatPreference: new FormControl(''),
      tyre: new FormControl(''),
      air: new FormControl(''),
      chaufferCarType: new FormControl(''),
      selfDriveCarType: new FormControl(''),
      suggestRental: new FormControl(''),
      cabinCategory: new FormControl(''),
      shoreExcrusion: new FormControl(''),
      cityCards: new FormControl('No', [Validators.required])
    });

  }

  ngOnInit() { 
    this.getNextYear()
  }

  get f() { return this.transferForm.controls; }

  /**
   * get Form url for next form
   */
  getFormUrl(){
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1);
    localStorage.setItem('formId', JSON.stringify(this.formUrl));
    console.log(this.formUrl);
  }

  /**
   * Get next year for datepicker
   */
  getNextYear(){
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
    if (this.transferForm.invalid) {
      return
    }
    this.storeFormData(data);
    console.log(data)
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

   // Store form data
   storeFormData(data) {
    const obj={
      "transfer":data
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

}
