import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-all-plan',
  templateUrl: './all-plan.component.html',
  styleUrls: ['./all-plan.component.scss'],
})
export class AllPlanComponent implements OnInit {
  inquiryId: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  allPlans: any = [];
  sendPlanForm: FormGroup;
  submitted: Boolean = false;
  planSlected;
  loading: Boolean = false;
  isDisable: Boolean = false;
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public _toastService: ToastService,
    public router: Router,
    public appComponent: AppComponent,
    ) {
    this.route.params.subscribe((params) => {
      this.inquiryId = params.inquiryId
    })
    this.sendPlanForm = new FormGroup({
      plan_id: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    console.log("inquiry id", this.inquiryId)
    this.getAllPlans();
  }
  get f() { return this.sendPlanForm.controls }

  /**
   * Pull to refresh
   * @param {object} event 
   */
   doRefresh(event) {
     console.log('Begin async operation');
     this.getAllPlans();
     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }

  /**
   * Get All Plan
   */
   getAllPlans() {
     this.loading = true;
     const data = {
       inquiry_id: this.inquiryId,
       id: this.currentUser.id
     }
     this._tripService.getAllPlans(data).subscribe((res: any) => {
       console.log(res);
       this.allPlans = res.data;

       this.loading = false;
       console.log("all palans", this.allPlans);
       if (this.allPlans.length == 1) {
         this.planSlected = this.allPlans[0].plan_selected;
       }
       console.log("plan selected", this.planSlected);
     }, err => {
       console.log(err);
       this.loading = false;
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
     })
   }

   sendPlan(data) {
     console.log(data)
     this.submitted = true;
     if (this.sendPlanForm.invalid) {
       return true
     }
     this.isDisable = true;
     this.loading = true;
     data['id'] = this.currentUser.id;
     data['inquiry_id'] = this.inquiryId
     console.log(data);
     this._tripService.sendPlan(data).subscribe((res: any) => {
       console.log(res);
       this.isDisable = false;
       this.loading = false;
       this.allPlans.map((plan) => {
         console.log(plan)
         if (plan.id != data.plan_id) {
           this.allPlans.splice(this.allPlans.indexOf(plan), 1)
         }
       })
       // this._toastService.presentToast(res.message,'success');
       this.appComponent.sucessAlert("Thanks for choosing plan!!","Hive Five!!")
       this.router.navigate(['home/plan-option/'+ this.inquiryId]);
     }, (err) => {
       console.log(err);
       this.isDisable = false;
       this.loading = false;
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
     })
   }
 }
