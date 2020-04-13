import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from '../services/upload.service';
import { ToastService } from '../services/toast.service';
import { AppComponent } from '../app.component';
import { AlertController } from '@ionic/angular';
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
  imageIcon = ["assets/images/green.png", "assets/images/y1.png", "assets/images/sky.png"];
  files: any;
  urls: any = [];
  message: any = '';
  constructor(
    public _uploadService: UploadService,
    public _toastService: ToastService,
    public appComponent: AppComponent,
    public alertController: AlertController
  ) {
    this.createFolderForm = new FormGroup({
      folder_name: new FormControl('', [Validators.required, Validators.pattern("^([a-zA-Z0-9][^*/><?\|:]*)$")])
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

  // modal for create new folfer
  openCreateFolderModal() {
    $('#open-folder').click(function () {
      $('#folder-modal').fadeIn();
    });
    $('#folder-modal .modal_body').click(function (event) {
      event.stopPropagation();
    });
    $('#folder-modal').click(() => {
      $('#folder-modal').fadeOut();
      this.createFolderForm.reset();
      this.submitted = false;
      console.log("formdata", this.createFolderForm.value)
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
    console.log("data", data)
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
      this.createFolderForm.reset();
      this.submitted = false;
      $('#folder-modal').fadeOut();
      this.getFolderData();
    }, (err) => {
      console.log(err);
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
      this.appComponent.errorAlert(err.error.message);
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
   * Delete Folder
   * @param {string} data 
   */
  async removeFolder(data, index) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Are you sure you want to delete this folder?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            $('.folder-icon-' + index).css('opacity', 0)
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.loading = true
            const obj = {
              id: this.currentUser.id,
              folder_path: 'Other Docs/' + data
            }
            this._uploadService.deleteFolder(obj).subscribe((res: any) => {
              console.log("delete folder", res);
              this.folderList.splice(index, 1);
              this.loading = false;
            }, err => {
              console.log("err", err);
              this.appComponent.errorAlert(err.error.message);
              this.loading = false;
            })
          }
        }
      ]
    });

    await alert.present();
  }
}