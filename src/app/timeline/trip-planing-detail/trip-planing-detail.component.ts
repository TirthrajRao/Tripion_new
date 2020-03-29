import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { AppComponent } from '../../app.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DatePipe } from '@angular/common';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as _ from 'lodash';
declare const $: any;

@Component({
  selector: 'app-trip-planing-detail',
  templateUrl: './trip-planing-detail.component.html',
  styleUrls: ['./trip-planing-detail.component.scss'],
})
export class TripPlaningDetailComponent implements OnInit {
  tripId;
  day;
  timelineDayDetail: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  images: any = [];
  loading: Boolean = false;
  curruntDate: string = new Date().toISOString();
  fileTransfer: FileTransferObject = this.transfer.create();
  tripImage;
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public _toastService: ToastService,
    private photoViewer: PhotoViewer,
    public datepipe: DatePipe,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public appComponent: AppComponent,
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.inquiryId;
      this.day = params.day
    })
  }

  ngOnInit() {
    console.log("trip id and day", this.tripId, this.day);
    this.getDayDetails();
    // this.curruntDate = this.datepipe.transform(this.curruntDate, 'dd MMM yyyy');
    console.log("currunt date", this.curruntDate);
  }

  // open modal for add passport
  openModal(data) {
    // this.images = data;
    // this.images = data.splice(0, 2);
    this.images = [];
    _.forEach(data, (img, index) => {
      if (index >= 2)
        this.images.push(img)
    })
    console.log(this.images)
    $('#view-img-modal').fadeIn();
    $('#view-img-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#view-img-modal').click(function () {
      $(this).fadeOut();
    });
  }

  /**
  * Go Back to previous Page
  */
  goBack() {
    console.log("back")
    window.history.back();
  }


  /**
   * Get Day Wise Details
   */
  getDayDetails() {
    this.loading = true;
    const data = {
      id: this.currentUser.id,
      day: this.day,
      inquiry_id: this.tripId
    }
    this._tripService.getDayDetail(data).subscribe((res: any) => {
      console.log("res of day details", res);
      this.loading = false;
      this.timelineDayDetail = res.data;
      this.tripImage = res.data.featured_image;
    }, (err) => {
      console.log(err);
      this.loading = false;
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert(err.error.message);
    })
  }


  /**
  * Doenload report
  */
  downloadPdf(url, name, mimeType,ext) {
    console.log("===enter====", name)
    const ROOT_DIRECTORY = 'file:///sdcard//';
    const downloadFolderName = 'Download/';
    // this.fileTransfer.onProgress((progressEvent) => {
    //   console.log("progressevent",progressEvent);
    //   var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
    //   this.progress = perc;
    //   console.log("progress in perc",this.progress)
    // });
    this.file.checkFile(ROOT_DIRECTORY + downloadFolderName,  name+'.'+ext).then((isExist) => {
      this.openFile(ROOT_DIRECTORY + downloadFolderName +  name+'.'+ext, mimeType);
    }).catch((notexist) => {
      console.log("nonexist")
      //create dir
      this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
        .then((entries) => {
          //Download file
          this._toastService.presentToast("Downloading.....", 'success')
          this.fileTransfer.download(url, ROOT_DIRECTORY + downloadFolderName + '/' + name+'.'+ext).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            this._toastService.presentToast("Download Completed", 'success');
            this.openFile(entry.nativeURL, mimeType);
          }, (error) => {
            console.log("error", error);
            this._toastService.presentToast('Error in dowloading', 'danger');
          })
        }).catch((error) => {
          console.log("erorr", error);
          this._toastService.presentToast('Error in dowloading', 'danger')
        });
    })
  }

  /**
   * Open File
   */
  openFile(url, mimeType) {
    console.log(url);
    this.fileOpener.showOpenWithDialog(url, mimeType)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));

  }


  /**
   * Image pop up
   * @param {URL} img 
   */
  previewImage(img) {
    console.log(img)
    this.photoViewer.show(img)
  }
}
