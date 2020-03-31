import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, RoutesRecognized } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
// import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppComponent } from '../../app.component';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-plan-option',
  templateUrl: './plan-option.component.html',
  styleUrls: ['./plan-option.component.scss'],
})
export class PlanOptionComponent implements OnInit {
  tripId;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  fileTransfer: FileTransferObject = this.transfer.create();
  tripDetail;
  documentList: any = [];
  loading: Boolean = false;
  notApproveDoc: any = [];
  pathToPreview: any;
  pathToPreview1: any;
  previousUrl;
  passportFiles: any = [];
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public _toastService: ToastService,
    public router: Router,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public appComponent: AppComponent,
    // public domsanitizer:DomSanitizer
  ) {
    this.route.params.subscribe((param) => {
      console.log("==", param.tripId);
      this.tripId = param.tripId;
    });

    router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        console.log("eeee", e);
        if (e[1].urlAfterRedirects.includes('plan-option')) {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          // console.log("urllllll", e[0].urlAfterRedirects);
          this.previousUrl = e[0].urlAfterRedirects;
          if (this.previousUrl.includes('payment')
          ) {
            console.log("in if");
            this.getSingleTripDetail(this.tripId);
          }
        }
      });

  }

  ngOnInit() {
    this.getSingleTripDetail(this.tripId);

  }

  /**
 * Pull to refresh
 * @param {object} event 
 */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getSingleTripDetail(this.tripId);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Get Single Trip Details
   * @param {Number} id 
   */
  getSingleTripDetail(id) {
    this.loading = true;
    console.log(id)
    const data = {
      id: this.currentUser.id,
      inquiry_id: id
    }
    console.log(data)
    this._tripService.getSingleTripDetail(data).subscribe((res: any) => {
      this.tripDetail = res.data;
      this.loading = false;
      console.log(this.tripDetail);
      // this.tripDetail.payment.payment_request = []
      if (res.data.requested_docs.length)
        this.notApproveDoc = res.data.requested_docs.filter(function (obj) { return res.data.approved_docs.indexOf(obj) == -1; });
      console.log("not approved doc", this.notApproveDoc);
      this.pathToPreview = "https://docs.google.com/viewerng/viewer?url=" + this.tripDetail.passport_doc.image_url + "&embedded=true";
      if (this.tripDetail.is_passport == 1)
        this.getDocumentRequest(this.tripDetail.inquiry_id);
      // https://docs.google.com/viewerng/viewer?url=https://testing-platinum-rail-services.s3.ap-south-1.amazonaws.com/passport-1-1584351271687.xlsx
    }, (err) => {
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert(err.error.message);
      console.log(err);
      this.loading = false;
    })
  }


  /**
   * Move to Select Document page
   */
  selectDocument() {

    let navigationExtras: NavigationExtras = {
      state: {
        documentList: this.tripDetail.requested_docs,
        tripId: this.tripId,
        tripName: this.tripDetail.inquiry_name,
        planName: this.tripDetail.plans.length ? this.tripDetail.plans[0].plan_name : 'passport_forms'
      }
    };
    console.log("navigation", navigationExtras)
    this.router.navigate(['/home/document'], navigationExtras);
  }


  /**
   * Redirect to payment page
   */
  payNow() {
    let navigationExtras: NavigationExtras = {
      state: {
        data: JSON.stringify(this.tripDetail.payment.payment_request),
        total: this.tripDetail.payment.total_amount,
        tripId: this.tripDetail.inquiry_id
      }
    };
    console.log("navigation", navigationExtras)
    this.router.navigate(['/home/payment'], navigationExtras);
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
      this.loading = false;
      console.log("res of doc req", res);
      this.passportFiles = res.data;
      if (this.passportFiles.length) {
        this.pathToPreview1 = "https://docs.google.com/viewerng/viewer?url=" + res.data[res.data.length - 1].image_url + "&embedded=true";
      }
    }, (err) => {
      console.log(err);
      this.appComponent.errorAlert(err.error.message);
      // this._toastService.presentToast(err.error.message, 'danger');
      this.loading = false;
    })
  }

}
