import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  allNotifications: any = [];
  loading: Boolean = false;
  previousUrl: any;
  isDisable:Boolean = false;
  constructor(
    public _userService: UserService,
    public _toastService: ToastService,
    public appComponent: AppComponent,
  ) { }

  ngOnInit() {
    this.getNotifications();
  }


  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getNotifications();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Go Back to previous Page
   */
  goBack() {
    console.log("back")
    window.history.back();
  }

  /**
   * Get Notifications
   */
  getNotifications() {
    this.loading = true;
    const obj = {
      id: this.currentUser.id
    }
    this._userService.getNotification(obj).subscribe((res: any) => {
      console.log(res);
      this.allNotifications = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.appComponent.errorAlert(err.error.message);
      this.loading = false;
    })
  }

  /**
   * Delete Notification
   * @param {object} data 
   */
  removeItem(data) {
    console.log("data", data);
    this.isDisable = true;
    const obj = {
      id:this.currentUser.id,
      notification_id:data.notification_id
    }
    this._userService.deleteNotification(obj).subscribe((res:any)=>{
      console.log("res of delete noti.",res);
      this.allNotifications = res.data
      this.isDisable = false;
    },err=>{
      console.log("err",err);
      this.isDisable = false;
      this.appComponent.errorAlert();
    })
  }
}
