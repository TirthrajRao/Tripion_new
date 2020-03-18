import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-premium-account-payment',
  templateUrl: './premium-account-payment.component.html',
  styleUrls: ['./premium-account-payment.component.scss'],
})
export class PremiumAccountPaymentComponent implements OnInit {
  amount: any;
  type:any;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.amount = this.router.getCurrentNavigation().extras.state.amount;
        this.type = this.router.getCurrentNavigation().extras.state.type;
        console.log("in payment page",this.amount,this.type)
      }
    });
  }

  ngOnInit() { }

}
