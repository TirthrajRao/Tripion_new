import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertController } from '@ionic/angular';
import { data} from '../../data';
import { AppComponent } from '../../app.component';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-user-passport-detail',
  templateUrl: './user-passport-detail.component.html',
  styleUrls: ['./user-passport-detail.component.scss'],
})
export class UserPassportDetailComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  curruntDate: string = new Date().toISOString();
  addVisaForm: FormGroup;
  files;
  urls: any = [];
  submitted: Boolean = false;
  nextYear: any;
  allPassport: any = [];
  passportDetail;
  visaList: any = [];
  loading: Boolean = false;
  isDisable: Boolean = false;
  previousUrl;
  counries = data.countries;
  constructor(
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public _userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    private photoViewer: PhotoViewer,
    public alertController: AlertController,
    public appComponent: AppComponent,
  ) {
    this.addVisaForm = new FormGroup({
      passport_id_for_visa: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      doc_expiry_date: new FormControl('', [Validators.required]),
      profile_image: new FormControl('', [Validators.required]),
      visa_number: new FormControl('', [Validators.required, Validators.pattern('^(?!^0+$)[a-zA-Z0-9]+$')])
    })
  }

  ngOnInit() {
    this.getPassportDetail();
    this.getPassportList();
    this.nextYearCount();
    this.openModal();
    this.getVisa();

    $(document).ready(function () {
      $('#myselection').select2({
        placeholder: "Country",
      });
    });
    $('#myselection').on('select2:select', (e) => {
      this.addVisaForm.controls.country.setValue(e.params.data.text);
      console.log("data",this.addVisaForm.value);
    });

  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.createSlider();
    }, 1)
    this.previousUrl = this._userService.getPreviousUrl;
    let visa;
    this.route.queryParams.subscribe((param) => {
    //  param.image_url =  JSON.parse(param.image_url);
      console.log("param=====", JSON.parse(param.data))

      visa = JSON.parse(param.data)
     
    })
    let index = this.visaList.findIndex(x => x.id == visa.id);
    this.visaList[index] = visa;
    console.log("index", index)
  }

  get f() { return this.addVisaForm.controls }

  // Count next 12 year for expiry date of passport
  nextYearCount() {
    this.nextYear = this.curruntDate.split("-")[0];
    this.nextYear = this.nextYear++;
    this.nextYear = this.nextYear + +5;
  }

  // open modal for add passport
  openModal() {
    $('#add-visa').click(function () {
      $('#add-visa-modal').fadeIn();
    });
    $('#add-visa-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#add-visa-modal').click( () =>{
      $('#add-visa-modal').fadeOut();
      this.addVisaForm.reset();
      this.files = '';
      this.urls = []
    });
  }

  /**
   * Get Passport Detail
   */
  getPassportDetail() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.passportDetail = this.router.getCurrentNavigation().extras.state;
        console.log("in  visa page", this.passportDetail)
      }
    })
  }

  /**
   * Get Visa
   */
  getVisa() {
    this.loading = true;
    const obj = {
      id: this.currentUser.id,
      passport_id: this.passportDetail.passportId
    }
    this._uploadService.getVisa(obj).subscribe((res: any) => {
      console.log("visa list", res);
      this.visaList = res.data;
      this.loading = false;
      if ($('.passport_slider').hasClass('slick-initialized'))
        $('.passport_slider').slick('unslick');
      setTimeout(() => {
        this.createSlider();
      }, 1)
      this.removePdfFromSlider();

    }, (err) => {
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Remove Pdf From Slider
   */
  removePdfFromSlider() {
    if (this.visaList.length) {
      _.forEach(this.visaList, async (visa) => {
        _.forEach(visa.image_url, async (img) => {
          if (img && img.image_extension != 'png' && img.image_extension != 'jpg' && img.image_extension != 'jpeg') {
            let index = visa.image_url.indexOf(img);
            await visa.image_url.splice(index, 1);
          }
        })
      })
    }
  }
  /**
   * Create Slider
   */
  createSlider() {
    $('.passport_slider').not('.slick-initialized').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      draggable: true,
      fade: false,
      prevArrow: '<button class="prevarrow" ><img src="../assets/images/left.png"></button>',
      nextArrow: '<button class="nextarrow"><img src="../assets/images/r1.png"></button>',
    });

  }
  /**
   * Pull to refresh
   * @param {object} event
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getPassportDetail();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Get Passport List
   */
  getPassportList() {
    const obj = {
      id: this.currentUser.id,
    }
    this._uploadService.getPassport(obj).subscribe((res: any) => {
      console.log("all passport", res);
      this.allPassport = res.data;
    }, (err) => {
      console.log(err);
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert();
    })
  }

  /**
  * Select file from device
  * @param {object} e
  */
  selectFile(e) {
    console.log("===", e.target.files);
    this.files =  Array.from(e.target.files)
    // var newFileList = Array.from(event.target.files);
    for (let i = 0; i < this.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const obj = {
          url: e.target.result,
          imageName: this.files[i].name,
        }
        if (this.files[i].type == 'image/png' || this.files[i].type == 'image/jpeg' || this.files[i].type == 'image/jpg') {
          obj['type'] = 'image'
        }
        this.urls.push(obj);
      }
      reader.readAsDataURL(this.files[i]);
    }
    console.log(this.urls);
  }

  /**
   * Add Visa
   * @param {object} data
   */
  addVisa(data) {
    this.submitted = true;
    console.log("data",data)
    if (this.addVisaForm.invalid) {
      return
    }
    data.doc_expiry_date = data.doc_expiry_date.split("T");
    const td = data.doc_expiry_date[1].split('.')
    data.doc_expiry_date = data.doc_expiry_date[0] + ' ' + td[0]
    this.isDisable = true;
    this.loading = true;
    console.log(data);
    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('profile_image[]', this.files[i]);
    }
    _.forOwn(data, (value, key) => {
      formData.append(key, value);
    });
    formData.append('folder_name', 'Passport');
    formData.append('image_type', 'visa');
    formData.append('id', this.currentUser.id);
    this._uploadService.addVisa(formData).subscribe((res: any) => {
      this.isDisable = false;
      console.log(res);
      $('#add-visa-modal').fadeOut();
      this.getVisa();
      this.addVisaForm.reset();
      this.submitted = false;
      this.loading = false;
      this.urls = [];
    }, (err) => {
      console.log(err);
      this.isDisable = false;
      this.submitted = false;
      this.loading = false;
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert();
    })
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
  * Remove Image in Edit Passport
  * @param {object} data 
  */
 async removeImage(data) {
console.log(data);
console.log("file===",this.files,"urllll",this.urls);
console.log("this.file",typeof this.files[0])
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
          console.log("index",index);
          this.urls.splice(index,1);
          // var files1 = [].slice.call( this.files );

          _.forEach(this.files,(file,i)=>{
            console.log("))",file.name)
            if(file.name==data.imageName){
              console.log("======",file,  '-----',this.files[i])
              delete this.files[i]
              // files1.splice( i, 1 );
            }
          })
          console.log("update file",this.files)
        }
      }
    ]
  });

  await alert.present();
}
}
