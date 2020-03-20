import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
// import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppComponent } from '../../app.component';

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
  pathToPreview:any;
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
    })
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
       if (res.data.requested_docs.length)
         this.notApproveDoc = res.data.requested_docs.filter(function (obj) { return res.data.approved_docs.indexOf(obj) == -1; });
       console.log("not approved doc", this.notApproveDoc);
       this.pathToPreview = "https://docs.google.com/viewerng/viewer?url=" +this.tripDetail.passport_doc.image_url + "&embedded=true"
       // https://docs.google.com/viewerng/viewer?url=https://testing-platinum-rail-services.s3.ap-south-1.amazonaws.com/passport-1-1584351271687.xlsx
     }, (err) => {
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
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
         tripName: this.tripDetail.inquiry_name
       }
     };
     this.router.navigate(['/home/document'], navigationExtras);
   }

   // downloadFile(data){
     //   console.log("file=====>",data);

     //   // this.downloading = true;
     //   const ROOT_DIRECTORY = 'file:///sdcard//';
     //   const downloadFolderName = 'Download/';

     //   this.file.checkFile(ROOT_DIRECTORY + downloadFolderName, data.image_name).then((isExist) => {
       //     this.openFile(ROOT_DIRECTORY + downloadFolderName + data.image_name);
       //   }).catch((notexist) => {
         //     console.log("nonexist")
         //     //create dir
         //     this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
         //       .then((entries) => {
           //         //Download file
           //         this._toastService.presentToast("Downloading.....", 'success')
           //         this.fileTransfer.download(data.image_url, ROOT_DIRECTORY + downloadFolderName + '/' + data.image_name).then((entry) => {
             //           // this.downloading = false;
             //           console.log('download complete: ' + entry.toURL());
             //           this._toastService.presentToast("Download Completed", 'success');
             //           this.openFile(entry.nativeURL);
             //         }, (error) => {
               //           console.log("error", error);
               //           this._toastService.presentToast('Error in dowloading', 'danger');
               //         })
               //       }).catch((error) => {
                 //         console.log("erorr", error);
                 //         this._toastService.presentToast('Error in dowloading', 'danger')
                 //       });
                 //   })
                 // }

                 // /**
                 //  * Open File
                 //  */
                 // openFile(url) {
                   //   console.log(url);
                   //   this.fileOpener.showOpenWithDialog(url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                   //     .then(() => console.log('File is opened'))
                   //     .catch(e => console.log('Error opening file', e));

                   // }

                 }
