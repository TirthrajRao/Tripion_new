import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TripService } from "../../services/trip.service";
declare const $: any;

@Component({
  selector: 'app-air-tickets-inquiry',
  templateUrl: './air-tickets-inquiry.component.html',
  styleUrls: ['./air-tickets-inquiry.component.scss'],
})
export class AirTicketsInquiryComponent implements OnInit {
  formUrl: any = [];
  airTickitForm: FormGroup;
  submitted: boolean = false;
  isSelected: any;
  infantsPassengers: any = 0;
  childrenPassengers: any = 0;
  adultsPassengers: any = 0;
  seniorPassengers: any = 0;

  // formData = JSON.parse(localStorage.getItem('form_data'));

  constructor(public route: Router, public _tripService: TripService) {

    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1)
    localStorage.setItem('formId', JSON.stringify(this.formUrl));
    this.isSelected = localStorage.getItem('selectOnlyAirTickits');

    this.airTickitForm = new FormGroup({
      infantsPassenger: new FormControl('', [Validators.required]),
      childrenPassenger: new FormControl('', [Validators.required]),
      adultsPassenger: new FormControl('', [Validators.required]),
      seniorPassenger: new FormControl('', [Validators.required]),
      journeyType: new FormControl('Round Trip'),
      flightTirePreference: new FormControl('Economy'),
      flightSeatPreferences: new FormControl('Aisle', [Validators.required]),
      inFlightMeal: new FormControl('', [Validators.required]),
      airlinePreference: new FormControl('', [Validators.required]),
      seatBeltExtender: new FormControl('Yes'),
      wheelChairAssistance: new FormControl('Yes')
    })

  }
  ngOnInit() { }

  get f() { return this.airTickitForm.controls; }

  // open next form function
  nextForm(data) {
    this.submitted = true;
   
    console.log("data",data);
    if (this.airTickitForm.invalid) {
      return
    }
    const obj = {
      "air-tickit": data
    }
    this._tripService.storeFormData(obj);
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  changeInputValue(e) {
    console.log(e.target.value)
    this.airTickitForm.controls.flightSeatPreferences.setValue(e.target.value);
  }

  selectVisaType(e) {
    $('#other-input').val("");
    this.airTickitForm.controls.flightSeatPreferences.setValue(e.target.value);
  }

  decrement(type) {
    console.log("type in dec", type);
    if (type == "infants") {
      if (this.infantsPassengers)
        this.infantsPassengers--;
        this.airTickitForm.controls.infantsPassenger.setValue(this.infantsPassengers)
    } else if (type == "children") {
      if (this.childrenPassengers)
        this.childrenPassengers--;
        this.airTickitForm.controls.childrenPassenger.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      if (this.adultsPassengers)
        this.adultsPassengers--;
        this.airTickitForm.controls.adultsPassenger.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      if (this.seniorPassengers)
        this.seniorPassengers--;
        this.airTickitForm.controls.seniorPassenger.setValue(this.seniorPassengers)
    }
  }

  increment(type) {
    console.log("type in inc", type)
    if (type == "infants") {
      this.infantsPassengers++;
      this.airTickitForm.controls.infantsPassenger.setValue(this.infantsPassengers)
    } else if (type == "children") {
      this.childrenPassengers++;
      this.airTickitForm.controls.childrenPassenger.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      this.adultsPassengers++;
      this.airTickitForm.controls.adultsPassenger.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      this.seniorPassengers++;
      this.airTickitForm.controls.seniorPassenger.setValue(this.seniorPassengers)
    }
  }
}
