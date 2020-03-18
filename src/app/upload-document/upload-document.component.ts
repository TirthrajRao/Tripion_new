import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UploadService } from '../services/upload.service';
import { ToastService } from '../services/toast.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  allImage: any = [];
  files: any;
  urls = [];
  documentId: any = [];
  selectedImages: any = [];
  path;
  isDisable: Boolean = false;
  loading: Boolean = false;
  constructor(
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.path = this.router.getCurrentNavigation().extras.state;
        console.log("in payment page", this.path)
      }
    });
  }

  ngOnInit() {
    this.getAllImages();
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

  /**
   * Get All Images
   */
  getAllImages() {
    this.loading = true;
    const data = {
      id: this.currentUser.id
    }
    this._uploadService.getAllImages(data).subscribe((res: any) => {
      console.log("res of image", res);
      this.allImage = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this._toastService.presentToast(err.error.message, 'danger');
      this.loading = false;
    })
  }

  /**
   * Select file for passport
   */
  selectOtherFile(e) {
    console.log(e.target.files);
    this.files = e.target.files;
    for (let i = 0; i < this.files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(this.files[i]);
      reader.onload = (_event) => {
        let obj = {
          imgUrl: reader.result,
          type: "img"
        }
        if (this.files[i].type != "image/png" && this.files[i].type != "image/jpeg" && this.files[i].type != "image/png") {
          obj.type = 'pdf';
          obj['name'] = this.files[i].name
        }
        this.urls.push(obj);
      }
    }
    console.log("urls", this.urls);
  }

  /**
   * Added to your app gallery
   */
  addToGallery() {
    const data = new FormData();
    this.isDisable = true;
    if (this.files.length > 0) {
      console.log("=========this.s", this.files)
      for (let i = 0; i < this.files.length; i++) {
        data.append('profile_image[]', this.files[i]);
      }
    }
    this.loading = true;
    data.append('id', this.currentUser.id);
    data.append('folder_name', 'Passport');
    data.append('image_type', 'passport')
    console.log(data)
    this._uploadService.uploadDocuments(data).subscribe((res: any) => {
      console.log("res", res);
      this.getAllImages();
      this.isDisable = false;
      this.loading = false;
      this.urls = []
    }, (err) => {
      console.log(err);
      this.isDisable = false;
      this.loading = false;
      this._toastService.presentToast(err.error.message, 'danger')
    })
  }

  /**
   * Select Document to uplaod
   * @param {object} data 
   */
  selectDocument(id, url, ext, name) {
    console.log(id, url, ext)
    $(".checkmark-icon-" + id).toggle();
    $(".image-" + id).css('opacity', '0.5')
    if (this.documentId.some(document => document.image_id == id)) {
      $(".image-" + id).css('opacity', '1')
      let index = this.documentId.indexOf(document);
      console.log(index);
      this.documentId.splice(index, 1)
    } else {
      const obj = {
        image_id: id,
        image_url: url,
        image_extension: ext,
        image_name: name
      }
      this.documentId.push(obj);
    }
    console.log("selected image id", this.documentId)
  }

  closeModal() {
    this.selectedImages = this.documentId;
    _.forEach(this.documentId, (id) => {
      $(".checkmark-icon-" + id.image_id).toggle();
      $(".image-" + id.image_id).css('opacity', '1')
    });
    this.documentId = [];
    console.log("selected images", this.selectedImages);
    let navigationExtras: NavigationExtras = {
      state: {
        images: this.selectedImages,
      }
    };
    this.router.navigate(['/home/' + this.path.url + '/' + this.path.id], navigationExtras);
  }

}
