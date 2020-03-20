import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from '../services/upload.service';
import { ToastService } from '../services/toast.service';
import { AppComponent } from '../app.component';
declare var $: any;

@Component({
  selector: 'app-other-docs',
  templateUrl: './other-docs.component.html',
  styleUrls: ['./other-docs.component.scss'],
})
export class OtherDocsComponent implements OnInit {
  createFolderForm: FormGroup;
  submitted: Boolean = false;
  isDisable: Boolean = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  folderList: any = [];
  loading: Boolean = false;
  lastImage;
  imageIcon = ["../../assets/images/green.png", "../../assets/images/y1.png", "../../assets/images/sky.png"];
  files: any;
  urls: any = [];
  message: any = '';
  constructor(
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public appComponent: AppComponent,
    ) {
    this.createFolderForm = new FormGroup({
      // folder_name: new FormControl('', [Validators.required,Validators.pattern(`^(?!.*[!@#$%^&*()\-_+={}[\]|\\;:'",<.>\/?]{2}).+$`)])
      folder_name:new FormControl('',[Validators.required,Validators.pattern("^([a-zA-Z0-9][^*/><?\|:]*)$")])
    })
  }

  get f() { return this.createFolderForm.controls }
  ngOnInit() {
    this.openCreateFolderModal();
    this.openNewDocumentModal();
    this.getFolderData();
    $('.single_folder').click(function () {
      $('#new-modal').fadeOut();
    });
  }

  openModal() {
    $('#new-modal').fadeIn();
    $('#new-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#new-modal').click( () =>{
      $('#new-modal').fadeOut();
    });
  }

  // modal for create new folfer
  openCreateFolderModal() {
    $('#open-folder').click(function () {
      $('#folder-modal').fadeIn();
    });
    $('#folder-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#folder-modal').click( ()=> {
      $('#folder-modal').fadeOut();
      this.createFolderForm.reset();
      this.submitted = false;
      console.log("formdata",this.createFolderForm.value)
    });
  }

  // modal for upload new documents
  openNewDocumentModal() {
    $('#upload-documents').click(function () {
      $('#add-documents').fadeIn();
    });
    $('#add-documents .modal_body').click(function (event) {
      event.stopPropagation();
    });

  }

  /**
   * Pull to refresh
   * @param {object} event
   */
   doRefresh(event) {
     console.log('Begin async operation');
     this.getFolderData();
     setTimeout(() => {
       event.target.complete();
     }, 2000);
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
       folder_name: 'Other Docs/' + data.folder_name
     }
     this._uploadService.createFolder(obj).subscribe((res: any) => {
       console.log(res);
       this.isDisable = false;
       this.loading = false;
       $('#folder-modal').fadeOut();
       this.createFolderForm.reset();
       this.getFolderData();
     }, (err) => {
       console.log(err);
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
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
       folder_name: 'Other Docs'
     }
     this.loading = true;
     this._uploadService.getAllFolder(obj).subscribe((res: any) => {
       console.log(res);
       this.folderList = res.data;
       this.loading = false;
     }, (err) => {
       console.log(err);
       this.loading = false;
       this.appComponent.errorAlert();
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



  /**
   * Select file for passport
   */
   // selectFile(e) {
     //   console.log("===", e.target.files);
     //   this.files = e.target.files
     //   for (let i = 0; i < this.files.length; i++) {
       //     let reader = new FileReader();
       //     reader.onload = (e: any) => {
         //       const obj = {
           //         imgUrl: e.target.result,
           //         name: this.files[i].name,
           //       }
           //       if (this.files[i].type == 'image/png' || this.files[i].type == 'image/jpeg' || this.files[i].type == 'image/jpg') {
             //         obj['type'] = 'img'
             //       }
             //       this.urls.push(obj);
             //     }
             //     reader.readAsDataURL(this.files[i]);
             //   }
             //   this.message = ''
             //   console.log(this.urls);
             // }

  /**
   * Upload new Document
   */
   // uploadDocument() {
     //   if (!this.files) {
       //     this.message = 'Please select Images'
       //     return
       //   }
       //   this.isDisable = true;
       //   const data = new FormData();
       //   if (this.files.length) {
         //     for (let i = 0; i < this.files.length; i++) {
           //       data.append('profile_image[]', this.files[i]);
           //     }
           //   }
           //   data.append('id', this.currentUser.id);
           //   data.append('folder_name', 'Other Docs');
           //   data.append('image_type','other')
           //   console.log(data)
           //   this._uploadService.uploadDocuments(data).subscribe((res: any) => {
             //     console.log("res", res);
             //     $('#add-documents').fadeOut();
             //     this.isDisable = false;
             //     this.urls = []
             //   }, (err) => {
               //     console.log(err);
               //     this.isDisable = false;
               //     this._toastService.presentToast(err.error.message,'danger')
               //   })
               // }
 }
