import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-destination-other-detail',
  templateUrl: './destination-other-detail.component.html',
  styleUrls: ['./destination-other-detail.component.scss'],
})
export class DestinationOtherDetailComponent implements OnInit {
  otherDetailsForm: FormGroup;
  submitted: Boolean = false;
  paymentModeArray: any = [];
  communicationModeArray: any = [];
  destinationId: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute
  ) {

    this.otherDetailsForm = new FormGroup({
      communication_mode: new FormControl(''),
      budget_preference: new FormControl(''),
      budget_amount: new FormControl(''),
      payment_mode: new FormControl('')
    })

    this.route.params.subscribe((param) => {
      this.destinationId = param.id
    })
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('form_data'));
    if (data.length)
      localStorage.setItem('form_data', JSON.stringify(''));
  }

  get f() { return this.otherDetailsForm.controls }

  nextForm(data) {
    this.submitted = true;
    if (this.otherDetailsForm.invalid) {
      return
    }
    console.log("data", data);
    let navigationExtras: NavigationExtras = {
      state: {
        formData: JSON.stringify(data),
        destinationId:this.destinationId
      }
    };
    this.router.navigate(['/home/information-pack'], navigationExtras)
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
    this.otherDetailsForm.controls.payment_mode.setValue(this.paymentModeArray);
  }


  selectCommunicationMode(e) {
    if (!this.communicationModeArray.includes(e.detail.value)) {
      this.communicationModeArray.push(e.detail.value);
    } else {
      var index = this.communicationModeArray.indexOf(e.detail.value);
      this.communicationModeArray.splice(index, 1);
    }
    console.log(this.communicationModeArray);
    this.otherDetailsForm.controls.communication_mode.setValue(this.communicationModeArray);
  }
}
