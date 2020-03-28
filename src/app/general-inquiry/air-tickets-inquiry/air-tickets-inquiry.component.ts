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
    // this.formUrl.splice(0, 1)
    // localStorage.setItem('formId', JSON.stringify(this.formUrl));
    this.isSelected = localStorage.getItem('selectOnlyAirTickits');

    this.airTickitForm = new FormGroup({
      infants_passenger: new FormControl('0', [Validators.required]),
      children_passenger: new FormControl('0', [Validators.required]),
      adults_passenger: new FormControl('0', [Validators.required]),
      senior_passenger: new FormControl('0', [Validators.required]),
      journey_type: new FormControl('Round Trip'),
      flightTire_preference: new FormControl('Economy'),
      flightSeat_preferences: new FormControl('Aisle', [Validators.required]),
      in_flight_meal: new FormControl('', [Validators.required]),
      airline_preference: new FormControl('', [Validators.required]),
      seat_belt_extender: new FormControl('Yes'),
      wheelChair_assistance: new FormControl('Yes')
    })

  }
  ngOnInit() { }

  get f() { return this.airTickitForm.controls; }

  // open next form function
  nextForm(data) {
    this.submitted = true;
    this.checkLocalStorageData();
    console.log("data", data);
    if (this.airTickitForm.invalid) {
      return
    }
    const obj = {
      "air_tickit": data
    }
    this._tripService.storeFormData(obj);
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  changeInputValue(e) {
    console.log(e.target.value)
    this.airTickitForm.controls.flightSeat_preferences.setValue(e.target.value);
  }

  selectVisaType(e) {
    $('#other-input').val("");
    this.airTickitForm.controls.flightSeat_preferences.setValue(e.target.value);
  }

  decrement(type) {
    console.log("type in dec", type);
    if (type == "infants") {
      if (this.infantsPassengers)
        this.infantsPassengers--;
      this.airTickitForm.controls.infants_passenger.setValue(this.infantsPassengers)
    } else if (type == "children") {
      if (this.childrenPassengers)
        this.childrenPassengers--;
      this.airTickitForm.controls.children_passenger.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      if (this.adultsPassengers)
        this.adultsPassengers--;
      this.airTickitForm.controls.adults_passenger.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      if (this.seniorPassengers)
        this.seniorPassengers--;
      this.airTickitForm.controls.senior_passenger.setValue(this.seniorPassengers)
    }
  }

  increment(type) {
    console.log("type in inc", type)
    if (type == "infants") {
      this.infantsPassengers++;
      this.airTickitForm.controls.infants_passenger.setValue(this.infantsPassengers)
    } else if (type == "children") {
      this.childrenPassengers++;
      this.airTickitForm.controls.children_passenger.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      this.adultsPassengers++;
      this.airTickitForm.controls.adults_passenger.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      this.seniorPassengers++;
      this.airTickitForm.controls.senior_passenger.setValue(this.seniorPassengers)
    }
  }


  /**
  * Check and store data in local storage
  */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'air-tickets') {
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
        if (o.air_tickit) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }
      console.log("index of air-tickit in localstorage", localStorageFormData);
      // if (localStorageFormData.length) {
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
      // }
    }
  }
}
