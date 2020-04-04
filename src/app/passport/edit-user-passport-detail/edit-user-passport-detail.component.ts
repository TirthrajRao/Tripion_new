import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { ToastService } from 'src/app/services/toast.service';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../../app.component';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-edit-user-passport-detail',
  templateUrl: './edit-user-passport-detail.component.html',
  styleUrls: ['./edit-user-passport-detail.component.scss'],
})
export class EditUserPassportDetailComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  passportDetail;
  editPassPortForm: FormGroup;
  submitted: Boolean = false;
  nextYear: any;
  curruntDate: string = new Date().toISOString();
  allImage: any = [];
  files: any;
  urls: any = [];
  documentId: any = [];
  documentUrl: any = [];
  imageId: any = [];
  selectedImages: any
  passportID: any;
  isDisable: Boolean = false;
  loading: Boolean = true;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public alertController: AlertController,
    public appComponent: AppComponent,
  ) {
    this.editPassPortForm = new FormGroup({
      name_in_passport: new FormControl('', [Validators.required]),
      doc_expiry_date: new FormControl('', [Validators.required]),
      passport_number: new FormControl('', [Validators.required])
    })

    this.route.params.subscribe((param) => {
      this.passportID = param.passportId;
      console.log("passportid", param.passportId)
    })
  }

  get f() { return this.editPassPortForm.controls }
  ngOnInit() {
    this.getPassportDetails(this.passportID);
    this.nextYearCount();
    this.getSelectedImages();
  }

  getSelectedImages() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedImages = this.router.getCurrentNavigation().extras.state.images;
        console.log("selectedImage", this.selectedImages);
        this.passportDetail.image_url.push(...this.selectedImages)
      }
    });
  }

  moveDocumentPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        url: 'edit-user-passport-detail',
        id: this.passportID
      }
    };
    this.router.navigate(['/home/upload-document'], navigationExtras);
  }

  // Count next 12 year for expiry date of passport
  nextYearCount() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +12;
  }

  /**
   * Get Passport Detail
   */
  getPassportDetails(passportId) {
    this.loading = true;
    const obj = {
      passport_id: passportId,
      id: this.currentUser.id
    }
    console.log(obj)
    this._uploadService.getSinglePassport(obj).subscribe((res: any) => {
      console.log(res);
      this.passportDetail = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
    console.log("passpiort detail", this.passportDetail);

  }
  /**
   * Remove Image in Edit Passport
   * @param {object} data 
   */
  async removeImage(data) {

    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            let index = this.passportDetail.image_url.indexOf(data);
            console.log("index", index);
            this.passportDetail.image_url.splice(index, 1);
            console.log(this.passportDetail.image_url);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Edit Passport Details
   * @param {object} data 
   */
  editPassportDetail(data) {

    this.submitted = true;
    if (this.editPassPortForm.invalid) {
      return
    }
    if (this.passportDetail.image_url.length) {
      _.forEach(this.passportDetail.image_url, (image) => {
        this.imageId.push(image.image_id)
      })
    }
    console.log("date", data.doc_expiry_date)
    if (data.doc_expiry_date.includes('T')) {
      data.doc_expiry_date = data.doc_expiry_date.split("T")[0];
    }

    this.isDisable = true;
    this.loading = true;
    data['id'] = this.currentUser.id;
    data['image_type'] = 'passport';
    data['folder_name'] = 'Passport';
    data['passport_id'] = this.passportDetail.id;
    data['attachment_id'] = this.imageId.toString();
    console.log("----", data, this.imageId, data.attachment_id);

    this._uploadService.editPassportDetail(data).subscribe((res: any) => {
      console.log(res);
      this.isDisable = false;
      this.editPassPortForm.reset();
      this.submitted = false;
      this.loading = false;
      this.router.navigate(['home/passports'], { queryParams: res.data });
    }, (err) => {
      console.log(err);
      this.isDisable = false;
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
  }

  /**
   * set fallback image on error
   * @param {Number} index 
   */
  onErrorImage(index) {
    console.log("index", index);
    this.passportDetail.image_url[index].image_url = 'assets/images/placeholder.png'
  }
}
