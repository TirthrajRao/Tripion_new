import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Boolean } from 'aws-sdk/clients/apigateway';
import { AppComponent } from '../../app.component';
declare const $: any;

@Component({
  selector: 'app-frequent-flyer-detail',
  templateUrl: './frequent-flyer-detail.component.html',
  styleUrls: ['./frequent-flyer-detail.component.scss'],
})
export class FrequentFlyerDetailComponent implements OnInit {
  details: any;
  editFfpReqForm: FormGroup;
  submitted: Boolean = false;
  isDisable: Boolean = false;
  loading: Boolean = false;
  ffpIndex: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    public _tripService: TripService,
    public route: ActivatedRoute,
    public router: Router,
    public appComponent: AppComponent,
  ) {

    this.editFfpReqForm = new FormGroup({
      flight_name: new FormControl('', [Validators.required]),
      user_name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      points: new FormControl('')
    });


    this.getDetails();
  }
  get f() { return this.editFfpReqForm.controls }

  ngOnInit() {
  }

  /**
   * Get Details Of single Response
   */
  getDetails() {
    this.route.params.subscribe((param) => {
      this.ffpIndex = param.index
    })


    if (this.router.getCurrentNavigation().extras.state) {
      this.details = this.router.getCurrentNavigation().extras.state;
      console.log("in ffp detail page", this.details);
    }
  }


  /**
  * Open Add FFP request Modal
  */
  openModal() {
    $('#edit-passport-modal').fadeIn();
    $('#edit-passport-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#edit-passport-modal').click(() => {
      $('#edit-passport-modal').fadeOut();
      this.editFfpReqForm.reset();
      this.submitted = false;
    });
  }


  /**
  * Edit FFP request
  * @param {Object} data 
  */
  editFfpRequest(data) {
    this.submitted = true;
    if (this, this.editFfpReqForm.invalid) {
      return
    }
    this.isDisable = true;
    this.loading = true;
    data['id'] = this.currentUser.id;
    data['index_arr'] = this.ffpIndex;
    console.log(data);
    this._tripService.editFFPRequest(data).subscribe((res: any) => {
      console.log(res);
      // this._toastService.presentToast(res.message, 'success');
      this.details = res.data;
      console.log(this.details)
       this.appComponent.sucessAlert("Update Successfully");
      this.isDisable = false;
      this.loading = false;
      $('#edit-passport-modal').fadeOut();
      // this.editFfpReqForm.reset();
      this.submitted = false;
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      // this._toastService.presentToast(err.error.message, 'danger');
      console.log(err);
      this.loading = false;
      this.isDisable = false;
    })
  }

}
