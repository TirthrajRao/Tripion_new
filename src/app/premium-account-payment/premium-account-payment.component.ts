import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-premium-account-payment',
  templateUrl: './premium-account-payment.component.html',
  styleUrls: ['./premium-account-payment.component.scss'],
})
export class PremiumAccountPaymentComponent implements OnInit {
  amount: any;
  type: any;
  submitted: Boolean = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  selectedFormCategory = JSON.parse(localStorage.getItem('selectedFormCategory'));
  isDisable: Boolean = false;
  loading: Boolean = false;
  noOfPlan: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public _tripService: TripService,
    public appComponent: AppComponent,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.amount = this.router.getCurrentNavigation().extras.state.amount;
        this.type = this.router.getCurrentNavigation().extras.state.type;
        this.noOfPlan = this.router.getCurrentNavigation().extras.state.noOfPlan;
        console.log("in payment page", this.amount, this.type)
      }
    });
  }

  ngOnInit() { }


  payNow() {
    console.log("pay now");
    const obj = {
      id: this.currentUser.id,
      email: this.currentUser.email,
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
      this.appComponent.sucessAlert("We got your money!!", "WoW")
      this.router.navigate(['/home']);
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      this.isDisable = false;
      this.loading = false;
      console.log(err);
      localStorage.removeItem('form_data');
      localStorage.removeItem('selectedFormCategory');
    })
  }

}
