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
  items = [
    { title: 'Slide item1' },
    { title: 'Slide item2' },
    { title: 'Slide item3' },
    { title: 'Slide item4' },
    { title: 'Slide item5' },
    { title: 'Slide item6' }
  ];
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
    for (let i = 0; i < this.items.length; i++) {
      if (this.allNotifications[i].notification_id == data.notification_id) {
        this.allNotifications.splice(i, 1);
      }
    }
  }
}
