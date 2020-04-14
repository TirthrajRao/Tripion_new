import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { AppComponent } from '../../app.component';
import { DatePipe } from '@angular/common';
import { NavController } from '@ionic/angular';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-trip-planing',
  templateUrl: './trip-planing.component.html',
  styleUrls: ['./trip-planing.component.scss'],
})
export class TripPlaningComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  curruntDate: string = new Date().toISOString();

  tripId: any;
  tripTimeline: any = [];
  loading: Boolean = false;
  tripImage;
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public datepipe: DatePipe,
    public appComponent: AppComponent,
    public navCtrl:NavController
    ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.inquiryId;
    })
    console.log(this.curruntDate)
    this.curruntDate = this.curruntDate.split("T")[0];
    console.log("date", this.curruntDate)
  }

  ngOnInit() {
    console.log("trip id in trip-planning", this.tripId);
    this.getTripTimeline();
  }

  /**
  * Go Back to previous Page
  */
  goBack() {
    console.log("back")
    this.navCtrl.back();
    // window.history.back();
  }

  /**
   * Get Trip Timeleine
   */
   getTripTimeline() {
     this.loading = true;
     const data = {
       id: this.currentUser.id,
       inquiry_id: this.tripId
     }
     this._tripService.getTripTimeline(data).subscribe((res: any) => {
       this.tripTimeline = res.data.timeline;
       this.tripImage = res.data.featured_image;
      //  console.log("===",this.tripImage)
       this.loading = false;
       console.log("res of timeline", res);
     }, (err) => {
       console.log(err);
       this.appComponent.errorAlert(err.error.message);
       this.loading = false;
     })
   }
 }
