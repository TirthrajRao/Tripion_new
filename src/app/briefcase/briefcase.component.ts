import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
// import { ToastService } from '../services/toast.service';
import { AppComponent } from '../app.component';
declare const $: any;
@Component({
  selector: 'app-briefcase',
  templateUrl: './briefcase.component.html',
  styleUrls: ['./briefcase.component.scss'],
})
export class BriefcaseComponent implements OnInit {
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  loading: Boolean = false;
  allFolder: any = [];
  lastImage;
  imageIcon = ["../../assets/images/green.png", "../../assets/images/y1.png", "../../assets/images/sky.png"];

  constructor(
    public _uploadService: UploadService,
    // public _toastService: ToastService,
    public appComponent: AppComponent,
  ) { }

  ngOnInit() {
    this.getAllFolders();
  }

  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getAllFolders();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  /**
   * Get All Folders Name
   */
  getAllFolders() {
    this.loading = true;
    const obj = {
      id: this.curruntUser.id
    }
    this._uploadService.getAllFolder(obj).subscribe((res: any) => {
      console.log("all folders", res);
      const remove = ["Other Docs", "Passport"]
      this.allFolder = res.data;
      this.allFolder = this.allFolder.filter(value => !remove.includes(value));
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.appComponent.errorAlert(err.error.message)
      // this._toastService.presentToast(err.error.message,'danger');
      this.loading = false;
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
