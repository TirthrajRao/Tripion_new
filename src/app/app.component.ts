import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastService } from './services/toast.service';
import 'rxjs/add/observable/fromEvent';
import * as firebase from 'firebase';
declare const $: any;

//firebase configration
const config = {
  apiKey: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7c1GumIdO3yTH\n3wFXJsQPxoRNc1dS3eIZGy3rBmHE8f7guQOzGTrAIikQe10kCYp9hU+WqjfCg7qU\nhOkGikml9i5jD7BRboS6L066UROgsBpz6JZnA/jSXnHKNH88HdzL28xH5Jw472Ck\nQkq8pLgvVMnO2+GBRemJkP3di+DjtTVBtzgjLi8PNbc7w+O9SHHjekqDssCQixuL\nLv2j6TgR25lTLXSGu9mFRgcH+RJgk3UjiFShy4h2+SlYvNy5qL0adcSx5GlixzQc\nNfs+NdnEwyGqbff7iR736NGPMP8w5RsHzgMoDjkF+dRlot8Go0CfXreuLcri52H3\n8jHzvdsvAgMBAAECggEAGsyCVYVN9us1DXQm82hB6IV3ncELL3g0XmWB25N2f9sf\nFs6spjrJqPVZTJduefv5NjfMaJxeS2tczeXwkLRNkjIPcK8qBIJZ7GpeBYoY1cTH\ni2GpuwGY3a6N8xwtQpF8YxLB8ldPNF6YwPMPT0f3YyDqly3dYAd4O2gkuztHxBYB\nZjv0BJ17VEcQpou115MduBvSnPkAwig0koynNmr6eczPp4329/GbSqeIPdiS6r0m\nY8mFYW0xajR6Fye+l4oQZwAgbESOt2W6oC+Qquyyak/CU4tfa20nxMphakftlkFL\ntzkVK3YWOOBWGVCyR/ZCylz+68lkxPZBap+5sPWRcQKBgQD5Muk8s2cAEAVYZJx9\n5RWwlVcUyAH2j2NpdJmDUhgHUE6mwhXkNBxwIEod91u2xjLehJUCecd21pHvAEgY\nA3UpYctdT5M49c2g0fsjZFFy5nliHznPQvTvu4+nLYfERvYW+y70stJLhTwgavx1\nsX9Q45WXLYiuldeOTLIlJHgxXwKBgQDAkPzVbcwTa9Au0VoEJPnm9qKtiP16QkQa\n4KEKtFZrOBGPOaD7jZw/3tkaqK8mwJ0TybMDKvb40gKzG7VoOvVL6mDk68q1EKAs\nw40TJ8P84iLExIx0Dh/I1O2FrQV2JPexCt1QbWmsscief9OSv9yXCmmc2qMny04/\ntMgtQBSYMQKBgCB59xWXF9xVOi0b550sptf9jnzB2Cem5kDPFlab80+4spdfAfVc\nqTwfqSkgnI5EZErFopnQ/yLIsfog4kRm5vT+rr85aKlqt2K3GvCw2UCNMtKL2T/e\nrQc1PXJ/J4t36Ah0sdjoGSoIch6TctVvzXTgRBWQtJh0JMSB0FGw4A0nAoGAeBx3\nd/DKb/q5mdo/WYJu1d9UzQU7hfy7WkBucqzVkn8ghMOfZAiKQ1SO+o/o4DUYRPV0\nUS+FaOIliO5pkp/jzPxef6uLfrDmF8XJwv70wlGS+kTWjrUYoj4eAVlQpMaeMLHk\nJXx5g5xI1IRKxagiwZtfENVXG0U2g4oRqhfkQKECgYEAkIZrWYJtr/H9dtfq9Cpa\noA7tVlm91WIo7tD/3Y5EdczZ83hlitzeXULfBcmV8/fOi9lc1y8y6mvI4HvaxcFQ\nFt/5SdkUw25g289uIi+Tt4vu48g4GwifZCNEjLVB/FwliQkBpodfsLIdCZnZRHHG\nwWZhuso+M1XaY08tJ8id/hU=',
  authDomain: 'https://accounts.google.com/o/oauth2/auth',
  databaseURL: 'https://testing-33582.firebaseio.com/',
  projectId: 'testing-33582',
  storageBucket: '',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hide: Boolean = true;
  counries: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  message: any;
  title: any;
  errMessage: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public _userService: UserService,
    public router: Router,
    private fcm: FCM,
    private localNotifications: LocalNotifications,
    public _toastService: ToastService
  ) {

    if (this._userService.currentUserValue) {
      this.router.navigate(['/home']);
    }

    //Exit app
    this.platform.backButton.subscribe(() => {
      if (this.router.url === '/home/home-page' || this.router.url === '/login') {
        navigator['app'].exitApp();
      }
    })
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getNotification();
      this.statusBar.backgroundColorByHexString('#0575E6');
      this.splashScreen.hide();
      this.menuRadius(); // call menuRadius method
      this.getCountryList();
    });
    firebase.initializeApp(config);
  }
  menuRadius() {
    setTimeout(() => {
      document.querySelector('ion-menu').shadowRoot.querySelector('.menu-inner').setAttribute('style', 'border-radius:0px 30px 0px 0px; width: calc(100% - 45px);');
    }, 2500);
  }

  /**
   * Get Notification
   */
  getNotification() {
    this.getToken();
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("reresh token", token);
    });

    this.fcm.onNotification().subscribe(data => {
      console.log("notification data", data)
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
      this.getLocalNotification(data);
    });
  }

  /**
   * Get DeviceToken
   */
  getToken() {
    this.fcm.getToken().then(token => {
      console.log('token======>', token);
      localStorage.setItem('deviceToken', token);
      console.log("in local sstorage", localStorage.getItem('deviceToken'));
    });
  }

  /**
   * Get LOcal NOtification when app is in foreground
   */
  getLocalNotification(data) {
    console.log("daata", data);
    const obj = {
      id: this.currentUser.id
    }
    let output = this._userService.sendMessageToAmmendments(data);
    if (data.type != 'chat') {
      this._userService.getNotificationCount(obj).subscribe((res: any) => {
        console.log("res of notification count", res)
      }, (err) => {
        console.log("err in notification count", err)
      })
    }
    this.localNotifications.schedule({
      id: 1,
      title: 'Tripion',
      text: data.body,
      foreground: true,
    });

  }

  /**
   * Check Internet connectivity
   */
  // checkNetworkConectivity() {
  //   console.log("check connectivity")
  //   var offline = Observable.fromEvent(document, "offline");
  //   var online = Observable.fromEvent(document, "online");

  //   offline.subscribe(() => {
  //     console.log("offline====>");
  //     this._toastService.presentToast('No internet connection!', 'danger')
  //     this.hide = false;
  //   });

  //   online.subscribe(() => {
  //     console.log("online=====>");
  //     if (!this.hide)
  //       this._toastService.presentToast('Internet Connected!', 'success')
  //     this.hide = true;
  //   });

  // }




  /**
  * Get Country List
  */
  getCountryList() {
    this._userService.getCountryList().subscribe((res: any) => {
      //  console.log("country list", res);
      this.counries = res;
      localStorage.setItem('countries', JSON.stringify(this.counries))
    }, (err) => {
      console.log("err", err)
    })
  }

  /** 
   *Sucess Alert
   */
  sucessAlert(msg, otherMsg?) {
    this.message = msg;
    this.title = otherMsg
    console.log("in sucessAlert", msg)
    $('.success_alert_box').fadeIn().addClass('animate');
    $('.success_alert_box').click(function () {
      $(this).hide().removeClass('animate');
    });
    $('.success_alert_box .alert_box_content').click(function (event) {
      event.stopPropagation();
    });
  }

  /** 
   *Error Alert
   */
  errorAlert(message?) {
    console.log("in errorAlert", message);
    this.errMessage = message
    $('.error_alert_box').fadeIn().addClass('animate');
    $('.error_alert_box').click(function () {
      $(this).hide().removeClass('animate');
    });
    $(' .error_alert_box .alert_box_content').click(function (event) {
      event.stopPropagation();
    });
  }
}
