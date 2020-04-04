import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentData;
  totalAmount;
  isDisable: Boolean = false;
  loading: Boolean = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  tripId;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _tripService: TripService,
    public appComponant: AppComponent
  ) {


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.paymentData = JSON.parse(this.router.getCurrentNavigation().extras.state.data)
        this.totalAmount = this.router.getCurrentNavigation().extras.state.total
        this.tripId = this.router.getCurrentNavigation().extras.state.tripId
        console.log("in payment page", this.paymentData, this.tripId)
      }
    });
  }

  ngOnInit() { }

  /**
   * trip payment
   */
  payNow() {
    this.isDisable = true;
    this.loading = true;
    const obj = {
      inquiry_id: this.tripId,
      id: this.currentUser.id
    }
    this._tripService.tripPayment(obj).subscribe((res: any) => {
      console.log("res of payment", res);
      this.appComponant.sucessAlert("We got your money", "WooW");
      this.router.navigate(['/home/plan-option/'+this.tripId])
      this.loading = false;
      this.isDisable = false;
    }, err => {
      console.log("err in payment", err);
      this.loading = false;
      this.isDisable = false;
      this.appComponant.errorAlert(err.error.message);
    })
  }

}
