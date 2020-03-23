import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-other-details-inquiry',
  templateUrl: './other-details-inquiry.component.html',
  styleUrls: ['./other-details-inquiry.component.scss'],
})
export class OtherDetailsInquiryComponent implements OnInit {
  formUrl: any = [];
  otherDetailsForm: FormGroup;
  submitted: Boolean = false;
  paymentModeArray: any = [];
  amount: any;
  formData = JSON.parse(localStorage.getItem('form_data'));
  isTripInquiry: any = JSON.parse(localStorage.getItem('isTripInquiry'))
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  selectedFormCategory = JSON.parse(localStorage.getItem('selectedFormCategory'));
  isDisable: Boolean = false;
  userData;
  loading: Boolean = false;
  constructor(
    public route: Router,
    public _tripService: TripService,
    public _toastService: ToastService,
    public _userService: UserService,
    public appComponent: AppComponent,
    ) {
    this.otherDetailsForm = new FormGroup({
      communicationMode: new FormControl(''),
      budgetPreference: new FormControl('', [Validators.required]),
      budgetAmount: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('')
    })
    this.getUserDetail();
  }

  ngOnInit() {
    this.getFormUrl();
    console.log(this.isTripInquiry)
  }
  get f() { return this.otherDetailsForm.controls; }

  // Get Form Url For next form
  getFormUrl() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1);
    localStorage.setItem('formId', JSON.stringify(this.formUrl));
  }
  /**
   * Get User Details
   */
   getUserDetail() {
     const data = {
       id: this.currentUser.id
     }
     this._userService.getUserProfile(data).subscribe((res: any) => {
       console.log("user profile", res);
       this.userData = res.data;
     }, (err) => {
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
       console.log("err", err);
     })
   }
   nextForm(data) {
     this.submitted = true;
     // if (this.otherDetailsForm.invalid) {
       //   return
       // }
       console.log(data);
       let navigationExtras: NavigationExtras = {
         state: {
           type: 'Upfront',
           amount: this.amount
         }
       };
       console.log(this.formData);
       localStorage.removeItem('form_data');
       this.route.navigate(['/home/premium-account'], navigationExtras)
       // this.route.navigate(['/home/payment'])
       // this.route.navigate(['/home/' + this.formUrl[0]])
     }

  /**
   * Submit General Inquires
   * @param {Object} data 
   */
   submitForm(data) {
     this.submitted = true;
     if (this.otherDetailsForm.invalid) {
       return;
     }
     if (!this.userData.email) {
       alert('Please add your email in your Profile');
       return;
     } else{
       console.log(this.formData);
       const object = {
         "other-detail": data
       }
       this._tripService.storeFormData(object);
       const obj = {
         id: this.currentUser.id,
         email: this.userData.email,
         form_category: this.selectedFormCategory.toString(),
         form_data: localStorage.getItem('form_data')
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
          this.appComponent.sucessAlert("Inquiry Added Sucessfully")
         // this._toastService.presentToast(res.message, 'success')
         this.route.navigate(['/home']);
       }, (err) => {
         this.appComponent.errorAlert();
         this.isDisable = false;
         this.loading = false;
         console.log(err);
         localStorage.removeItem('form_data');
         localStorage.removeItem('selectedFormCategory');
       })
     }
     

   }

  /**
   * get selected payment mode value
   * @param {Object} e 
   */
   selectPaymentMode(e) {
     if (!this.paymentModeArray.includes(e.detail.value)) {
       this.paymentModeArray.push(e.detail.value);
     } else {
       var index = this.paymentModeArray.indexOf(e.detail.value);
       this.paymentModeArray.splice(index, 1);
     }
     console.log(this.paymentModeArray);
     this.otherDetailsForm.controls.paymentMode.setValue(this.paymentModeArray);
   }

  /**
   * Count payment amount 
   * @param {Object} event 
   */
   numberOfPlan(event) {
     console.log(event.target.value);
     if (event.target.value) {
       this.amount = 1500 * event.target.value
       console.log(this.amount)
     } else {
       this.amount = 0;
     }
   }

 }
