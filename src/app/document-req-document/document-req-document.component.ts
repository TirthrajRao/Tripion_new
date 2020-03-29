import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { ToastService } from '../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-document-req-document',
  templateUrl: './document-req-document.component.html',
  styleUrls: ['./document-req-document.component.scss'],
})
export class DocumentReqDocumentComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  tripId;
  documentList: any = [];
  loading: Boolean = true;
  constructor(
    public _tripService: TripService,
    // public _toastService: ToastService,
    public route: ActivatedRoute,
    public appComponent:AppComponent,
    ) {
    this.route.params.subscribe((param) => {
      this.tripId = param.tripId
    })
  }

  ngOnInit() {
    console.log("tripid", this.tripId)
    this.getDocumentRequest(this.tripId)
  }

  /**
  * Pull to refresh
  * @param {object} event 
  */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getDocumentRequest(this.tripId);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Get document request of trip
   * @param {Number} tripId 
   */
   getDocumentRequest(tripId) {
     this.loading = true;
     const data = {
       id: this.currentUser.id,
       inquiry_id: tripId
     }
     this._tripService.getDocumentReq(data).subscribe((res: any) => {
       console.log("res of doc req", res);
       this.documentList = res.data;
       this.loading = false;
     }, (err) => {
       console.log(err);
       this.appComponent.errorAlert(err.error.message);
       // this._toastService.presentToast(err.error.message, 'danger');
       this.loading = false;
     })
   }
 }
