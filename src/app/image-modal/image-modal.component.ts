import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { S3Service } from '../services/s3.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AmendmentsComponent } from '../amendments/amendments.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { ToastService } from '../services/toast.service';
import {AppComponent} from '../app.component';
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  // providers: [NavParams]
})
export class ImageModalComponent implements OnInit {
  @Input() image: string;
  @Input() fileObject: any;
  @Input() type: any;

  imagePath: any;
  fileObjectData: any
  itemPicturesStoreURL: any;
  fileType: any;
  loading: Boolean = false;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    public _s3Service: S3Service,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private document: DocumentViewer,
    public _toastService: ToastService,
     public appComponent:AppComponent
    ) {

    this.imagePath = navParams.get('image');
    this.fileObjectData = navParams.get('fileObject');
    this.fileType = navParams.get('type');

    this.platform.backButton.subscribe(() => {
      console.log("this.router", this.router)
      // if (this.router.url === '/home/home-page' || this.router.url === '/login') {
        //   navigator['app'].exitApp();
        // }
      })
    console.log("file object data", this.fileObjectData, this.fileType)
  }

  ngOnInit() { }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  /**
   * Upload Image
   */
   uploadImage() {
     this.loading = true;
     let imageName;
     imageName = this.fileObjectData[0].name;
     this._s3Service.uploadImage(this.imagePath, imageName, this.fileType, this.fileObjectData[0]).then((res) => {
       console.log("Response", res);
       this.loading = false;
       this.modalCtrl.dismiss({
         'dismissed': true,
         'data': res
       });
       this.itemPicturesStoreURL = res;
     }).catch((err) => {
       console.log("Error is", err);
       this.loading = false;
        this.appComponent.errorAlert(err.error.message);
       // this._toastService.presentToast('Internal server error', 'danger')
     })
   }


   viewDocument() {
     const options: DocumentViewerOptions = {
       title: 'My PDF'
     }
     console.log("option", options)
     this.document.viewDocument(this.imagePath, 'application/pdf', options)
   }
 }
