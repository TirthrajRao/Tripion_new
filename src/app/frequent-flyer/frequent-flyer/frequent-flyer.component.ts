import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { Router, NavigationExtras } from '@angular/router';
import {AppComponent} from '../../app.component';
declare var $: any;

@Component({
  selector: 'app-frequent-flyer',
  templateUrl: './frequent-flyer.component.html',
  styleUrls: ['./frequent-flyer.component.scss'],
})
export class FrequentFlyerComponent implements OnInit {
  addFfpReqForm: FormGroup;
  submitted: Boolean = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  FFPResponse: any = [];
  loading: Boolean = false;
  isDisable: Boolean = false;
  constructor(
    public _tripService: TripService,
    public _toastService: ToastService, 
    public router: Router,
    public appComponent:AppComponent,
    ) {


    this.addFfpReqForm = new FormGroup({
      flight_name: new FormControl('', [Validators.required]),
      user_name: new FormControl('', [Validators.required]),
      password:new FormControl('',[Validators.required]),
      points:new FormControl('')
    });

    this.getFfpResponse();
  }
  get f() { return this.addFfpReqForm.controls; }

  ngOnInit() {
    this.openModal();
  }

  /**
   * Open Add FFP request Modal
   */
   openModal() {
     $('#add_passport').click(function () {
       $('#add-passport-modal').fadeIn();
     });
     $('#add-passport-modal .modal_body').click(function (event) {
       event.stopPropagation();
     });
     $('#add-passport-modal').click(function () {
       $(this).fadeOut();
     });
   }

  /**
   * Pull to refresh
   * @param {object} event 
   */
   doRefresh(event) {
     console.log('Begin async operation');
     this.getFfpResponse();
     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }

  /**
  * Get FFP responses
  */
  getFfpResponse() {
    this.loading = true;
    const obj = {
      id: this.currentUser.id
    }
    this._tripService.getFfpResponse(obj).subscribe((res: any) => {
      console.log(res);
      this.FFPResponse = res.data;
      // this.FFPResponse.push({'flight_detail':'','flight_image':'','flight_points':'','frequent_flight':'','updated_date':''})
      this.loading = false;
    }, (err) => {
      this.appComponent.errorAlert();
      // this._toastService.presentToast(err.error.message, 'danger');
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Add FFP request
   * @param {Object} data 
   */
   addFfpRequest(data) {
     this.submitted = true;
     if (this, this.addFfpReqForm.invalid) {
       return
     }
     this.isDisable = true;
     this.loading = true;
     data['id'] = this.currentUser.id
     console.log(data);
     this._tripService.addFFPRequest(data).subscribe((res: any) => {
       console.log(res);
       // this._toastService.presentToast(res.message, 'success');
     this.FFPResponse = res.data;
      //  this.appComponent.sucessAlert("Added Successfully");
       this.isDisable = false;
       this.loading = false;
       $('#add-passport-modal').fadeOut();
       this.addFfpReqForm.reset();
       this.submitted = false;
     }, (err) => {
       this.appComponent.errorAlert();
       // this._toastService.presentToast(err.error.message, 'danger');
       console.log(err);
       this.loading = false;
       this.isDisable = false;
     })
   }

  /**
   * Get Details of FFp Response
   * @param {Object} data 
   */
   getDetails(data) {
     console.log(data);
     let navigationExtras: NavigationExtras = {
       state: data
     };

     this.router.navigate(['/home/frequent-flyer-detail'], navigationExtras);
   }
 }
