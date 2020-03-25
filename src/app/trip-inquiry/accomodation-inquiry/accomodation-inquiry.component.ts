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
    this.formUrl.splice(0, 1)
    localStorage.setItem('formId', JSON.stringify(this.formUrl));

    this.accomodationForm = this.fb.group({
      accomodationType: new FormControl('', [Validators.required]),
      roomCategoryPreference: new FormControl('', [Validators.required]),
      smokingRoom: new FormControl('No'),
      wheelchairAccessible: new FormControl('No'),
      specialRequest: new FormControl(''),
      mealPlan: new FormControl('CP ( Continental Plan ) - Only Breakfast'),
      culinaryPreferrence: new FormControl('Vegetarian'),
      culinarySpecialRequest: new FormControl(''),
      rooms: this.fb.array([], [Validators.required]),
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
}
