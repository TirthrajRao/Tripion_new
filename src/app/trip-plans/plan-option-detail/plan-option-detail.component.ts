import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from 'src/app/services/toast.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
declare var $: any;

@Component({
  selector: 'app-plan-option-detail',
  templateUrl: './plan-option-detail.component.html',
  styleUrls: ['./plan-option-detail.component.scss'],
})
export class PlanOptionDetailComponent implements OnInit {
  planId;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  fileTransfer: FileTransferObject = this.transfer.create();
  loading:Boolean= false;
  planDetail;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public _toastService: ToastService,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
  ) {
    this.route.params.subscribe((params) => {
      this.planId = params.id;
    });
  }

  ngOnInit() {
    console.log("plan id", this.planId);
    this.getPlanDetail(this.planId);
  }

  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getPlanDetail(this.planId);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Get Single Plan Detail
   * @param {Number} id 
   */
  getPlanDetail(id) {
    this.loading = true;
    const data = {
      plan_id: id,
      id: this.currentUser.id
    }
    this._tripService.getPlanDetail(data).subscribe((res: any) => {
      console.log("plan detail", res);
      this.planDetail = res.data;
      this.loading = false;
      if ($('.plan_images').hasClass('slick-initialized'))
        $('.plan_images').slick('unslick');
      setTimeout(() => {
        this.createSlider();
      }, 1)
    }, (err) => {
      this._toastService.presentToast(err.error.message, 'danger');
      console.log(err);
      this.loading = false;
    })
  }
  createSlider() {
    $('.plan_images').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true
    });

  }

  /**
 * Doenload report
 */
  downloadPdf(name, mimeType) {
    console.log("===enter====", name)
    // this.downloading = true;
    const ROOT_DIRECTORY = 'file:///sdcard//';
    const downloadFolderName = 'Download/';

    this.file.checkFile(ROOT_DIRECTORY + downloadFolderName, name).then((isExist) => {
      this.openFile(ROOT_DIRECTORY + downloadFolderName + name, mimeType);
    }).catch((notexist) => {
      console.log("nonexist")
      //create dir
      this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
        .then((entries) => {
          let url;
          //Download file
          this._toastService.presentToast("Downloading.....", 'success')
          this.fileTransfer.download(url, ROOT_DIRECTORY + downloadFolderName + '/' + name).then((entry) => {
            // this.downloading = false;
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
}
