import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ToastService } from '../../services/toast.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
@Component({
  selector: 'app-safe-travel-detail',
  templateUrl: './safe-travel-detail.component.html',
  styleUrls: ['./safe-travel-detail.component.scss'],
})
export class SafeTravelDetailComponent implements OnInit {
  details: any;
  fileTransfer: FileTransferObject = this.transfer.create();
  public progress: any;
  downloading: Boolean = false;
  pathToPreview: any;
  imgLoading:Boolean = true;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private transfer: FileTransfer,
    private file: File,
    public _toastService: ToastService,
    private fileOpener: FileOpener,
    private photoViewer: PhotoViewer
  ) {
    this.getDetails();
  }

  ngOnInit() {
    console.log("img")
  }

  /**
   * Get Details Of single Response
   */
  getDetails() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state;
        this.pathToPreview = "https://docs.google.com/viewerng/viewer?url=" + this.details.pdfUrl.image_url + "&embedded=true"
        console.log("in payment page", this.details)
      }
    });
  }
  func() {
    console.log("calll")
  }

  /**
   * Doenload report
   */
  downloadPdf(name, mimeType) {
    console.log("===enter====", name)
    this.downloading = true;
    const ROOT_DIRECTORY = 'file:///sdcard//';
    const downloadFolderName = 'Download/';

    this.file.checkFile(ROOT_DIRECTORY + downloadFolderName, name).then((isExist) => {
      this.openFile(ROOT_DIRECTORY + downloadFolderName + name, mimeType);
    }).catch((notexist) => {
      console.log("nonexist")
      //create dir
      this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
        .then((entries) => {
          //Download file
          this._toastService.presentToast("Downloading.....", 'success')
          this.fileTransfer.download(this.details.pdfUrl.image_url, ROOT_DIRECTORY + downloadFolderName + '/' + name).then((entry) => {
            this.downloading = false;
            console.log('download complete: ' + entry.toURL());
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

   /**
   * set fallback image on error
   * @param {Number} index 
   */
  onErrorImage(index) {
    console.log("index", index);
    this.details.pdfUrl.image_url = 'assets/images/placeholder.png'
  }

  ionImgWillLoad(){
    console.log("image loading");
    this.imgLoading = false;
  }
  ionImgDidLoad(){
    console.log("image loaded");
    this.imgLoading = true;
  }
}
