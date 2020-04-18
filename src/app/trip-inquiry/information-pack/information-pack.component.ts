import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-information-pack',
  templateUrl: './information-pack.component.html',
  styleUrls: ['./information-pack.component.scss'],
})
export class InformationPackComponent implements OnInit {
  amount: any;
  totalPlan: any;
  constructor(
    public router: Router
  ) { }

  ngOnInit() { }

  /**
   * Count payment amount 
   * @param {Object} event 
   */
  numberOfPlan(event) {
    console.log(event.target.value);
    this.totalPlan = event.target.value
    if (event.target.value) {
      this.amount = 1500 * event.target.value
      console.log(this.amount)
    } else {
      this.amount = 0;
    }
  }

  /**
   * Next Form
   */
  nextForm() {
    const data = JSON.parse(localStorage.getItem('form_data'));

    let index;
    if (data.length) {
      let result;
      data.some((o, i) => {
        if (o.other_detail) {
          result = true
          index = i;
        }
      })
      const OtherDetailsForm = data[index]
      console.log("result====>", result, index);
      if (result) {
        data.splice(index, 1)
      }

      OtherDetailsForm.other_detail['number_of_plans'] = this.totalPlan;
      OtherDetailsForm.other_detail['total_plan_payment'] = this.amount;
      data.push(OtherDetailsForm)
      localStorage.setItem('form_data', JSON.stringify(data));
    }
    let navigationExtras: NavigationExtras = {
      state: {
        type: 'Total no. of Plans',
        amount: this.amount,
        noOfPlan: this.totalPlan
      }
    };
    this.router.navigate(['/home/premium-account'], navigationExtras);
  }

}
