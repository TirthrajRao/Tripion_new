import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-information-pack',
  templateUrl: './information-pack.component.html',
  styleUrls: ['./information-pack.component.scss'],
})
export class InformationPackComponent implements OnInit {
  amount: any;
  totalPlan: any;
  formData: any;
  destinationId: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.formData = this.router.getCurrentNavigation().extras.state.formData;
        this.destinationId = this.router.getCurrentNavigation().extras.state.destinationId
        this.formData = JSON.parse(this.formData)
        console.log("in information page", this.formData)
      }
    });

  }

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
    console.log("data", data)
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
    } else {
      console.log("in else");
      this.formData['number_of_plans'] = this.totalPlan;
      this.formData['total_plan_payment'] = this.amount
    }
    let navigationExtras: NavigationExtras = {
      state: {
        type: 'Total no. of Plans',
        amount: this.amount,
        noOfPlan: this.totalPlan,
        formData: JSON.stringify(this.formData),
        destinationId: this.destinationId
      }
    };
    this.router.navigate(['/home/premium-account'], navigationExtras);
  }

}
