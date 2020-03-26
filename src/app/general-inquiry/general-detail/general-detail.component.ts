import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import {data} from '../../data';
import {AppComponent} from '../../app.component';
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
  formData = JSON.parse(localStorage.getItem('form_data'));
  isTripInquiry: any = JSON.parse(localStorage.getItem('isTripInquiry'))
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  selectedFormCategory = JSON.parse(localStorage.getItem('selectedFormCategory'));
  isDisable: Boolean = false;
  loading: Boolean = false;
  constructor(
    public route: Router,
    public _tripService: TripService,
     public appComponent:AppComponent,
    ) {
    // console.log("countries",this.counries)
    this.generalDetailsForm = new FormGroup({
      name_in_passport: new FormControl('', [Validators.required]),
      pssport_number: new FormControl('', [Validators.required, Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{8,20}$')]),
      dob: new FormControl('', Validators.required),
      place_of_birth: new FormControl('', [Validators.required]),
      address_in_passport: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      desination_country:new FormControl('',[Validators.required]),
      place_name:new FormControl(''),
      departure_date: new FormControl('', [Validators.required]),
      intende_date: new FormControl('', [Validators.required]),
      passport_valid_date: new FormControl('', [Validators.required]),
      duration_status: new FormControl('Flexible'),
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
      this.generalDetailsForm.controls.desination_country.setValue(e.params.data.id);
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

     data.departure_date = data.departure_date.split("T");
     const fd1 = data.departure_date[1].split('.')
     data.departure_date = data.departure_date[0] + ' ' + fd1[0];

     data.intende_date = data.intende_date.split("T");
     const fd2 = data.intende_date[1].split('.')
     data.intende_date = data.intende_date[0] + ' ' + fd2[0];

     data.passport_valid_date = data.passport_valid_date.split("T");
     const fd3 = data.passport_valid_date[1].split('.')
     data.passport_valid_date = data.passport_valid_date[0] + ' ' + fd3[0];

     console.log("data", data)
     if (this.formUrl.length) {
       console.log("this.formUrl",this.formUrl)
       this.storeFormData(data);
       this.route.navigate(['/home/' + this.formUrl[0]])
     } else{
       if (!this.currentUser.email) {
         alert('Please add your email in your Profile');
         return;
       } else{
         let formObject = [{"general-detail":data}]
         const obj = {
           id: this.currentUser.id,
           email: this.currentUser.email,
           form_category: this.selectedFormCategory.toString(),
           form_data: JSON.stringify(formObject)
         }
         console.log(obj);
         this.isDisable = true;
         this.loading = true;
         this._tripService.addInquiry(obj).subscribe((res: any) => {
           this.isDisable = false;
           this.loading = false;
           console.log("inquiry form res", res);
           localStorage.removeItem('form_data');
           localStorage.removeItem('selectedFormCategory');
           // this._toastService.presentToast(res.message, 'success');
           this.appComponent.sucessAlert("Your Inquiry has been Added Successfully");
           this.route.navigate(['/home']);
         }, (err) => {
           this.isDisable = false;
           this.loading = false;
           console.log(err);
           localStorage.removeItem('form_data');
           localStorage.removeItem('selectedFormCategory');
         })
       }
       
     }

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
