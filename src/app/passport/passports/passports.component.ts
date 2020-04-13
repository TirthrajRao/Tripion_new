import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { ToastService } from '../../services/toast.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AppComponent } from '../../app.component';
import * as _ from 'lodash';
import { AlertController } from '@ionic/angular';
declare var $: any;

@Component({
  selector: 'app-passports',
  templateUrl: './passports.component.html',
  styleUrls: ['./passports.component.scss'],
})
export class PassportsComponent implements OnInit {
  addPassportForm: FormGroup;
  nextYear;
  curruntDate: string = new Date().toISOString();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  files: any = [];
  urls: any = [];
  submitted: Boolean = false;
  allPassport: any = [];
  loading: Boolean = false;
  isDisable: Boolean = false;
  previousUrl;
  details;
  constructor(
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public _userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
    public appComponent: AppComponent,
    public alertController: AlertController
  ) {
    this.addPassportForm = new FormGroup({
      name_in_passport: new FormControl('', [Validators.required]),
      passport_number: new FormControl('', [Validators.required, Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{8,20}$')]),
      doc_expiry_date: new FormControl('', [Validators.required]),
      profile_image: new FormControl('', [Validators.required])
    })
  }

  get f() { return this.addPassportForm.controls }
  ngOnInit() {
    this.openModal();
    this.nextYearCount();
    this.getAllPassport();
  }

  ionViewWillEnter() {
    this.previousUrl = this._userService.getPreviousUrl;
    let passport;
    this.route.queryParams.subscribe((param) => {
      console.log("param", param)
      passport = param
    })
    if (this.previousUrl && this.previousUrl.includes('edit-user-passport-detail')) {
      this.editedPassport(passport)
    }
  }

  editedPassport(data) {
    let index = this.allPassport.findIndex(x => x.id == data.id);
    this.allPassport[index] = data;
    console.log("index", index)
  }
  // open modal for add passport
  openModal() {
    $('#add-password').click(function () {
      $('#add-passport-modal').fadeIn();
    });
    $('#add-passport-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#add-passport-modal').click(() => {
      $('#add-passport-modal').fadeOut();
      this.addPassportForm.reset();
      this.urls = [];
      this.files = '';
    });
  }
  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getAllPassport();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  // Count next 12 year for expiry date of passport
  nextYearCount() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +12;
  }

  /**
   * Select file for passport
   */
  selectFile(e) {
    console.log("===", e.target.files);
    if (this.files.length) {
      this.files.push(...Array.from(e.target.files))
    } else {
      this.files = Array.from(e.target.files)
    }
    console.log("files", this.files);
    this.urls = []
    for (let i = 0; i < this.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const obj = {
          imgUrl: e.target.result,
          name: this.files[i].name,
        }
        if (this.files[i].type == 'image/png' || this.files[i].type == 'image/jpeg' || this.files[i].type == 'image/jpg') {
          obj['type'] = 'img'
        }else {
          let type = this.files[i].name.split('.');
          obj['type'] = type[type.length - 1]
          console.log("type",type);
        }
        this.urls.push(obj);
      }
      reader.readAsDataURL(this.files[i]);
    }
    console.log(this.urls);
  }

  /**
   * Add passport
   * @param {object} formData 
   */
  addPassport(formData) {
    console.log(formData)
    formData.doc_expiry_date = formData.doc_expiry_date.split("T")[0];

    this.submitted = true;
    if (this.addPassportForm.invalid) {
      return
    }
    this.isDisable = true;
    this.loading = true;
    let data = new FormData();
    _.forOwn(formData, (value, key) => {
      data.append(key, value);
    });
    data.append('id', this.currentUser.id);
    data.append('folder_name', 'Passport');
    data.append('image_type', 'passport');
    for (let i = 0; i <= this.files.length; i++) {
      data.append('profile_image[]', this.files[i]);
    }
    this._uploadService.addPassport(data).subscribe((res: any) => {
      this.isDisable = false;
      console.log("add passport", res);
      $('#add-passport-modal').fadeOut();
      this.addPassportForm.reset();
      this.urls = [];
      this.files = '';
      this.addPassportForm.reset();
      this.submitted = false;
      this.loading = false;
      this.appComponent.sucessAlert("Upload Successful");
      this.allPassport.unshift(res.data);
    }, (err) => {
      console.log(err);
      this.appComponent.errorAlert(err.error.message);
      this.isDisable = false;
      this.loading = false;
    })
  }



  /**
   * Get all passport of logged in user
   */
  getAllPassport() {
    console.log("======")
    this.loading = true;
    const obj = {
      id: this.currentUser.id,
    }
    this._uploadService.getPassport(obj).subscribe((res: any) => {
      console.log("all passport", res);
      this.allPassport = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.appComponent.errorAlert(err.error.message);
      this.loading = false;
    })
  }



  /**
   * Send Data to get passport visa
   * @param {object} data 
   */
  movePassportDetailPage(data) {
    let navigationExtras: NavigationExtras = {
      state: {
        passportId: data.id,
        nameInPassport: data.name_in_passport
      }
    }
    this.router.navigate(['/home/user-passport-detail'], navigationExtras);
  }

  /**
* Remove Image in Edit Passport
* @param {object} data 
*/
  async removeImage(data) {
    console.log(data);
    console.log("file===", this.files, "urllll", this.urls);
    console.log("this.file", typeof this.files[0])
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
            let index = this.urls.indexOf(data);
            console.log("index", index);
            _.forEach(this.files, async (file, i) => {
              console.log("))", file)
              if (file && file.name == data.name) {
                console.log("======", file, '-----', this.files[i])
                await this.files.splice(i, 1);
              }
            })
            this.urls.splice(index, 1);
            console.log("update file", this.files)
          }
        }
      ]
    });

    await alert.present();
  }
}

