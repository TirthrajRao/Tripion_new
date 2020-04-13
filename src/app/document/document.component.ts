import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FormGroup, FormControl } from '@angular/forms';
import { UploadService } from '../services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import * as _ from 'lodash';
declare const $: any
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  addDocumentForm: FormGroup;
  files: any;
  urls: any = [];
  maxFileSize: any;
  allImage: any = []
  isVisiblePassport: Boolean = false;
  documentId: any = [];
  previewImag: any = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  details: any;
  isDisable: Boolean = false;
  loading: Boolean = false;
  constructor(
    private transfer: FileTransfer,
    public _uploadService: UploadService,
    public route: ActivatedRoute,
    public router: Router,
    public appComponent: AppComponent,
  ) {
    this.addDocumentForm = new FormGroup({
      images: new FormControl('')
    })


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state;
        console.log("in payment page", this.details);
        if (this.details.documentList.includes("Passport")) {
          this.isVisiblePassport = true
        }
      }
    });

  }

  ngOnInit() {
    this.getAllImages();
    this.openModal();
  }

  /**
  * Pull to refresh
  * @param {object} event 
  */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getAllImages();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  // open modal of add new document or passport
  openModal() {
    $('#open-modal').click(function () {
      $('#folder-modal').fadeIn();
    });
    $('#folder-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#folder-modal').click(function () {
      $(this).fadeOut();
    });
    $('.make_folder button').click(function () {
      $('#folder-modal').fadeOut();
    });
  }

  /**
   * Get all image of logged in user
   */
  getAllImages() {
    this.loading = true;
    // const data = {
    //   id: this.currentUser.id
    // }
    // this._uploadService.getAllImages(data).subscribe((res: any) => {
    const obj = {
      id: this.currentUser.id,
      folder_name: this.details.planName
    }
    this._uploadService.getFolderData(obj).subscribe((res: any) => {
      console.log("res of image", res);
      this.allImage = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
      // this._toastService.presentToast(err.error.message, 'danger');
    })
  }

  /**
   * Select other document to add app gallery
   * @param {object} event 
   */
  selectOtherFile(event) {
    this.files = event.target.files;
    console.log(this.files)
    for (let i = 0; i < this.files.length; i++) {
      this.preview(this.files[i]);
    }
    console.log("urls", this.urls)
  }


  /**
   * Preview Selected Image in modal
   * @param {object} file 
   */
  preview(file) {
    console.log("fle", file)
    let reader = new FileReader();
    let image_name = file.name;

    reader.onload = (e: any) => {
      const obj = {
        url: e.target.result,
        imageName: image_name
      }
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
        obj['type'] = 'image'
      }
      this.urls.push(obj);
    }
    reader.readAsDataURL(file);
  }

  /**
   * Upload document to app gallery
   */
  uploadDocument() {
    this.isDisable = true;
    this.loading = true;
    const data = new FormData();
    if (this.files.length) {
      console.log("=========this.s", this.files)
      for (let i = 0; i < this.files.length; i++) {
        data.append('profile_image[]', this.files[i]);
      }
    }
    data.append('id', this.currentUser.id);
    data.append('folder_name', this.details.planName);
    data.append('image_type', 'other')
    console.log(data)
    this._uploadService.uploadDocuments(data).subscribe((res: any) => {
      console.log("res", res);
      $('#folder-modal').fadeOut();
      this.isDisable = false;
      this.loading = false;
      this.getAllImages();
      this.urls = []
    }, (err) => {
      console.log(err);
      this.isDisable = false;
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
  }

  /**
   * Select Document to uplaod
   * @param {object} data 
   */
  selectDocument(data) {
    $(".checkmark-icon-" + data.id).toggle();
    $(".image-" + data.id).css('opacity', '0.5')
    if (this.documentId.includes(data.id)) {
      $(".image-" + data.id).css('opacity', '1')
      let index = this.documentId.indexOf(data.id);
      console.log(index);
      this.previewImag.splice(index, 1)
      this.documentId.splice(index, 1)
    } else {
      if (data.image_extension == 'png' || data.image_extension == 'jpg' || data.image_extension == 'jpeg')
        this.previewImag.push(data)
      this.documentId.push(data.id);
    }
    console.log("selected image id", this.documentId, this.previewImag)
  }

  /**
   * send document to admin
   */
  sendDocument() {
    this.loading = true;
    const obj = {
      id: this.currentUser.id,
      document_id: this.documentId.toString(),
      inquiry_id: this.details.tripId
    }
    console.log("object", obj);
    this._uploadService.sendDocument(obj).subscribe((res: any) => {
      _.forEach(this.documentId, (id) => {
        $(".checkmark-icon-" + id).toggle();
        $(".image-" + id).css('opacity', '1')
      })
      this.documentId = [];
      this.previewImag = [];
      this.loading = false;
      console.log("res of send document", res);
      this.appComponent.sucessAlert("Files Successfully Uploaded")
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
  }

}
