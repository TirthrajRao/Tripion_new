import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
declare const $: any;
@Component({
  selector: 'app-accomodation-inquiry',
  templateUrl: './accomodation-inquiry.component.html',
  styleUrls: ['./accomodation-inquiry.component.scss'],
})
export class AccomodationInquiryComponent implements OnInit {
  formUrl: any = [];
  accomodationForm: FormGroup;
  submitted: Boolean = false;
  roomsArray: any = [];
  room: any;


  // formData = JSON.parse(localStorage.getItem('form_data'));

  constructor(public route: Router, private fb: FormBuilder, public _tripService: TripService) {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
   
    this.accomodationForm = this.fb.group({
      // accomodation_type: new FormControl('', [Validators.required]),
      // room_category_preference: new FormControl('', [Validators.required]),
      // smoking_room: new FormControl('No'),
      // wheelchair_accessible: new FormControl('No'),
      // special_request: new FormControl(''),
      // meal_plan: new FormControl('CP ( Continental Plan ) - Only Breakfast'),
      // culinary_preferrence: new FormControl('Vegetarian'),
      // culinary_special_request: new FormControl(''),
      // rooms: this.fb.array([], [Validators.required]),


      accomodation_type: new FormControl(''),
      room_category_preference: new FormControl(''),
      smoking_room: new FormControl('No'),
      wheelchair_accessible: new FormControl('No'),
      special_request: new FormControl(''),
      meal_plan: new FormControl('CP ( Continental Plan ) - Only Breakfast'),
      culinary_preferrence: new FormControl('Vegetarian'),
      culinary_special_request: new FormControl(''),
      rooms: this.fb.array([]),
    })
    this.room = this.accomodationForm.controls.rooms as FormArray;
  }
  ngOnInit() { }
  get f() { return this.accomodationForm.controls; }

  // open next form function
  nextForm(data) {
    this.submitted = true;
    if (this.accomodationForm.invalid) {
      return
    }
    this.checkLocalStorageData();
    this.storeFormData(data);
    console.log(data);
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  // Store form data
  storeFormData(data) {
    console.log("accomodation data", data);
    const obj = {
      'accomodation': data
    }
    this._tripService.storeFormData(obj);
  }

  /**
   * Add Rooms
   */
  addRoom() {

    console.log("all rooms", this.accomodationForm.value.rooms)
    this.room.push(this.fb.group({
      infants: '0',
      children: '0',
      adults: '0'
    }));
  }

  /**
   * Delete eomm
   * @param {Number} index 
   */
  deleteRoom(index) {
    this.room.removeAt(index)
  }



  decrement(type, index) {
    if (type == "infants") {
      if (this.accomodationForm.value.rooms[index].infants > 0)
        this.accomodationForm.value.rooms[index].infants--;
    } else if (type == "children") {
      if (this.accomodationForm.value.rooms[index].children > 0)
        this.accomodationForm.value.rooms[index].children--;
    } else if (type == 'adults') {
      if (this.accomodationForm.value.rooms[index].adults > 0)
        this.accomodationForm.value.rooms[index].adults--;
    }
  }

  increment(type, index) {
    if (type == "infants") {
      this.accomodationForm.value.rooms[index].infants++
    } else if (type == "children") {
      this.accomodationForm.value.rooms[index].children++
    } else if (type == 'adults') {
      this.accomodationForm.value.rooms[index].adults++
    }
  }

  /**
   * Check and store data in local storage
   */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'accomodation') {
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
        if (o.accomodation) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }
      console.log("index of accomodation in localstorage", localStorageFormData);
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
    }
  }
}
