import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../../services/upload.service';
// import { ToastService } from '../../services/toast.service';
import {AppComponent} from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
})
export class PicturesComponent implements OnInit {
  folderName: any;
  files: any;
  urls: any = [];
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  message;
  loading: Boolean = false;
  allImages: any = [];
  isDisable: Boolean = false;
  submitted:Boolean = false;
  createFolderForm:FormGroup;
  folderList:any = [];
  imageIcon = ["../../assets/images/green.png", "../../assets/images/y1.png", "../../assets/images/sky.png"];
  lastImage;
  constructor(
    public route: ActivatedRoute,
    public _uploadService: UploadService,
    // public _toastService: ToastService,
    public appComponent:AppComponent,
    ) {

      this.createFolderForm = new FormGroup({
        // folder_name: new FormControl('', [Validators.required,Validators.pattern(`^(?!.*[!@#$%^&*()\-_+={}[\]|\\;:'",<.>\/?]{2}).+$`)])
        folder_name:new FormControl('',[Validators.required,Validators.pattern("^([a-zA-Z0-9][^*/><?\|:]*)$")])
      })

    this.route.params.subscribe((params) => {
      this.folderName = params.foldername;
    });



  }

  ngOnInit() {
    console.log("folder name", this.folderName)
    this.openModal();
    this.getAllImages();
    this.getFolderData();
  }
  get f() { return this.createFolderForm.controls }
  // modal for upload new pictures 
  openModal() {
    $('#upload-pictures').click(function () {
      console.log("----")
      $('#add-pictures').fadeIn();
      // $('#new-modal').fadeIn();
    });
    $('#add-pictures .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#add-pictures').click( ()=> {
      $('#add-pictures').fadeOut();
    });


    $('#upload-documents').click(function () {
      console.log("----")
      $('#add-picturess').fadeIn();
      $('#add-pictures').fadeOut();
    });
    $('#add-picturess .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#add-picturess').click( ()=> {
      $('#add-picturess').fadeOut();
      this.message = ""
    });

    $('#open-folderr').click(function () {
      console.log("----")
      $('#add-Pictures').fadeIn();
      $('#add-pictures').fadeOut();
      // $('#new-modal').fadeIn();
    });
    $('#add-Pictures .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#add-Pictures').click( ()=> {
      $('#add-Pictures').fadeOut();
      this.createFolderForm.reset();
      this.submitted = false;
      console.log("formdata",this.createFolderForm.value)
    });

  }

  
  /**
   * Select file from device
   * @param {object} e 
   */
   selectFile(e) {
     console.log("===", e.target.files);

     this.files = e.target.files
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
     this.message = ''
     console.log(this.urls)
   }

  /**
   * Upload Document to briefcase
   */
   uploadImage() {
     console.log("=====================",this.files)
     if (!this.files) {
       this.message = 'Please select Images'
       return
     }
     this.isDisable = true;
     this.loading = true;
     let data = new FormData();
     for (let i = 0; i < this.files.length; i++) {
       data.append('profile_image[]', this.files[i])
     }
     data.append('id', this.currentUser.id);
     data.append('folder_name', 'Other Docs/' + this.folderName);
     data.append('image_type', 'other')
     this._uploadService.uploadDocuments(data).subscribe((res: any) => {
       console.log("res", res);
       $('#add-picturess').fadeOut();
       this.files = "";
       this.getAllImages();
       this.isDisable = false;
       this.loading = false;
       this.urls = [];
        // this.appComponent.sucessAlert("File Successfully Uploaded");
     }, (err) => {
       console.log(err);
       this.isDisable = false;
       this.loading = false;
        this.appComponent.errorAlert(err.error.message);
       // this._toastService.presentToast(err.error.message, 'danger')
     })
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
   * Get Folder Images
   */
   getAllImages() {
     this.loading = true;
     const obj = {
       id: this.currentUser.id,
       folder_name: 'Other Docs/' + this.folderName
     }
     this._uploadService.getFolderData(obj).subscribe((res: any) => {
       console.log("all image in folder", res);
       this.allImages = res.data;
       this.loading = false;
     }, (err) => {
       console.log(err);
        this.appComponent.errorAlert(err.error.message);
       // this._toastService.presentToast(err.error.message, 'danger');
       this.loading = false;
     })
   }

   /**
   * Create Folder
   * @param {object} data
   */
  createFolder(data) {
    console.log("data",data)
    this.submitted = true;
    if (this.createFolderForm.invalid) {
      return
    }
    this.isDisable = true;
    this.loading = true;
    console.log(data);
    const obj = {
      id: this.currentUser.id,
      folder_name: 'Other Docs/'+ this.folderName + '/'+ data.folder_name
    }
    this._uploadService.createFolder(obj).subscribe((res: any) => {
      console.log(res);
      this.isDisable = false;
      this.loading = false;
      this.createFolderForm.reset();
      this.submitted = false;
      $('#add-Pictures').fadeOut();
      this.getFolderData();
    }, (err) => {
      console.log(err);
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert(err.error.message);
      this.isDisable = false;
      this.loading = false;
    })
  }


   /**
   * Get Folder Data
   */
  getFolderData() {
    const obj = {
      id: this.currentUser.id,
      folder_name: 'Other Docs/'+this.folderName
    }
    // this.loading = true;
    this._uploadService.getAllFolder(obj).subscribe((res: any) => {
      console.log("folders",res);
      this.folderList = res.data;
      // this.loading = false;
    }, (err) => {
      console.log(err);
      // this.loading = false;
      this.appComponent.errorAlert(err.error.message);
      // this._toastService.presentToast(err.error.message, 'danger')
    })
  }

  /**
   * Get random folder icon
   * @param {Number} i
   */
  getRandomImgeIcon(i) {
    var rand = Math.floor(Math.random() * this.imageIcon.length);
    rand = i % this.imageIcon.length;
    this.lastImage = rand;
    return this.imageIcon[rand];
  }
 }
