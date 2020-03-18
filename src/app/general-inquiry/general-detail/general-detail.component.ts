import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import {data} from '../../data';
declare const $:any;

@Component({
  selector: 'app-general-detail',
  templateUrl: './general-detail.component.html',
  styleUrls: ['./general-detail.component.scss'],
})
export class GeneralDetailComponent implements OnInit {

  generalDetailsForm: FormGroup;
  formUrl: any = [];
  counries =data.countries;
  curruntDate: string = new Date().toISOString();
  nextYear;
  submitted:Boolean = false;
  constructor(
    public route: Router,
    public _tripService: TripService
  ) {
console.log("countries",this.counries)
    this.generalDetailsForm = new FormGroup({
      pname: new FormControl('', [Validators.required]),
      pNumber: new FormControl('', [Validators.required, Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{8,20}$')]),
      dob: new FormControl('', Validators.required),
      placeOfBirth: new FormControl('', [Validators.required]),
      paddress: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      desinationCountry:new FormControl('',[Validators.required]),
      placeName:new FormControl(''),
      departureDate: new FormControl('', [Validators.required]),
      intendeDate: new FormControl('', [Validators.required]),
      pvalidDate: new FormControl('', [Validators.required]),
      durationStatus: new FormControl('Flexible'),
    })
  }

  ngOnInit() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1);
    localStorage.setItem('formId', JSON.stringify(this.formUrl));
    this.nextYearCount();;

    $(document).ready(function () {
      $('#myselection').select2({
        placeholder: "Destination Country",
      });
    });

    $('#myselection').on('select2:select', (e) => {
      this.generalDetailsForm.controls.desinationCountry.setValue(e.params.data.id);
      console.log("data", this.generalDetailsForm.value);
    });

  }
  get f() { return this.generalDetailsForm.controls; }


  // Count next 12 year for expiry date of passport
  nextYearCount() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +10;
  }
  /**
   * get next form
   * @param {Object} data 
   */
  nextForm(data) {
    console.log("data in next forrm", data)
    this.submitted = true;

    if (this.generalDetailsForm.invalid) {
      return
    }

    data.dob = data.dob.split("T");
    const fd = data.dob[1].split('.')
    data.dob = data.dob[0] + ' ' + fd[0];

    data.departureDate = data.departureDate.split("T");
    const fd1 = data.departureDate[1].split('.')
    data.departureDate = data.departureDate[0] + ' ' + fd1[0];

    data.intendeDate = data.intendeDate.split("T");
    const fd2 = data.intendeDate[1].split('.')
    data.intendeDate = data.intendeDate[0] + ' ' + fd2[0];

    data.pvalidDate = data.pvalidDate.split("T");
    const fd3 = data.pvalidDate[1].split('.')
    data.pvalidDate = data.pvalidDate[0] + ' ' + fd3[0];

    console.log("data", data)
    this.storeFormData(data);
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  // Store form data
  storeFormData(data) {
    console.log("data", data)
    const obj = {
      "general-detail": data
    }
    this._tripService.storeFormData(obj);
  }

}
