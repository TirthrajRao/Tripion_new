import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../../services/upload.service';
// import { ToastService } from '../../services/toast.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.scss'],
})
export class FolderDetailComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  folderName: any;
  loading: Boolean = false;
  allDocument: any = [];

  constructor(
    public route: ActivatedRoute,
    public _uploadService: UploadService,
    // public _toastService: ToastService,
    public appComponent:AppComponent,
    ) {
    this.route.params.subscribe((params) => {
      this.folderName = params.foldername
    })
  }

  ngOnInit() {
    console.log(this.folderName);
    this.getFolderData();
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
   * Get Folder Data
   */
   getFolderData() {
     this.loading = true;
     const obj = {
       id: this.currentUser.id,
       folder_name: this.folderName
     }
     this._uploadService.getFolderData(obj).subscribe((res: any) => {
       console.log("folder img", res);
       this.allDocument = res.data;
       this.loading = false;
        this.appComponent.errorAlert();
     }, (err) => {
       console.log(err);
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
       this.loading = false;
     })
   }

 }
