import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { AppComponent } from '../../app.component';
import { data } from '../../data';
declare const $: any;
@Component({
  selector: 'app-safe-to-travel',
  templateUrl: './safe-to-travel.component.html',
  styleUrls: ['./safe-to-travel.component.scss'],
})
export class SafeToTravelComponent implements OnInit {
  safeToTravelForm: FormGroup;
  submitted: boolean = false;
  nextYear;
  curruntDate: string = new Date().toISOString();
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  categoryList = JSON.parse(localStorage.getItem('categoryList'));
  isDisable: Boolean = false;
  formCategory: any;
  loading: Boolean = false;
  countries = data.countries;
  infantsPassengers: any = 0;
  childrenPassengers: any = 0;
  adultsPassengers: any = 0;
  seniorPassengers: any = 0;
  constructor(
    public _tripServive: TripService,
    public router: Router,
    public _toastService: ToastService,
    public route: ActivatedRoute,
    public appComponent: AppComponent,
  ) {

    this.safeToTravelForm = new FormGroup({
      countryName: new FormControl('', [Validators.required]),
      infantsPassengers: new FormControl('0', [Validators.required]),
      childrenPassengers: new FormControl('0', [Validators.required]),
      adultsPassengers: new FormControl('0', [Validators.required]),
      seniorPassengers: new FormControl('0', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),

    })




  }
  get f() { return this.safeToTravelForm.controls; }

  ngOnInit() {
    this.getNextYear();
    this.formCategory = this.categoryList.find(item => item.slug == 'safe-to-travel');
    setTimeout(() => {
      $(document).ready(function () {
        $('#myselection').select2({
          // placeholder: "Select Country",
        });
      });

      $('#myselection').on('select2:select', (e) => {
        this.safeToTravelForm.controls.countryName.setValue(e.params.data.id);
        console.log("data", this.safeToTravelForm.value);
      });
    }, 300)


    console.log("countriess", this.countries)
  }

  /**
   * Get Next Year value for datepicker
   */
  getNextYear() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +1;
  }
  /**
   * Add safe to travel request
   * @param {Object} data 
   */
  addSafeToTravelReq(data) {
    console.log(data)
    this.submitted = true;
   
    data.fromDate = data.fromDate.split("T")[0];
    // const fd = data.fromDate[1].split('.')
    // data.fromDate = data.fromDate[0] + ' ' + fd[0];

    data.toDate = data.toDate.split("T")[0];
    // const td = data.toDate[1].split('.')
    // data.toDate = data.toDate[0] + ' ' + td[0]
    if (this.safeToTravelForm.invalid) {
      return
    }
    const safeData = [{
      'safe_to_travel': data
    }]
    const obj = {
      id: this.curruntUser.id,
      email: this.curruntUser.email,
      form_category: this.formCategory.id,
      form_data: JSON.stringify(safeData),
      safe_to_travel: data.countryName
    }
    console.log(obj);
    this.isDisable = true;
    this.loading = true;

    this._tripServive.addSafeToTravelReq(obj).subscribe((res: any) => {
      console.log("res of safe to travel", res);
      this.isDisable = false;
      this.loading = false;
      // this._toastService.presentToast(res.message, 'success');
      this.appComponent.sucessAlert("Requested Sucessfully")
      let navigationExtras: NavigationExtras = {
        state: {
          safe_to_pdf: [],
          safe_to_response: '',
          safe_to_travel: data.countryName,
        }
      };
      console.log("navigation", navigationExtras)
      this.router.navigate(['/home/safe-travel'], navigationExtras);
    }, (err) => {
      console.log("err", err);
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert(err.error.message);
      this.isDisable = false;
      this.loading = false;
    })
  }

  decrement(type) {
    console.log("type in dec", type);
    if (type == "infants") {
      if (this.infantsPassengers)
        this.infantsPassengers--;
      this.safeToTravelForm.controls.infantsPassengers.setValue(this.infantsPassengers)
    } else if (type == "children") {
      if (this.childrenPassengers)
        this.childrenPassengers--;
      this.safeToTravelForm.controls.childrenPassengers.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      if (this.adultsPassengers)
        this.adultsPassengers--;
      this.safeToTravelForm.controls.adultsPassengers.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      if (this.seniorPassengers)
        this.seniorPassengers--;
      this.safeToTravelForm.controls.seniorPassenger.setValue(this.seniorPassengers)
    }
  }

  increment(type) {
    console.log("type in inc", type)
    if (type == "infants") {
      this.infantsPassengers++;
      this.safeToTravelForm.controls.infantsPassengers.setValue(this.infantsPassengers);
      
    } else if (type == "children") {
      this.childrenPassengers++;
      this.safeToTravelForm.controls.childrenPassengers.setValue(this.childrenPassengers)
    } else if (type == 'adults') {
      this.adultsPassengers++;
      this.safeToTravelForm.controls.adultsPassengers.setValue(this.adultsPassengers)
    } else if (type == 'senior') {
      this.seniorPassengers++;
      this.safeToTravelForm.controls.seniorPassengers.setValue(this.seniorPassengers)
    }
  }

}
