import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config '
import { map, filter, pairwise } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router, NavigationExtras, RoutesRecognized } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any>;
  public previousUrl: any;
  public currentUser: Observable<any>;
  public deviceData: any = {}
  public notificationCountSubject = new Subject();
  public messageSubject = new Subject();
  constructor(private http: HttpClient, public router: Router, public platform: Platform) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();


    this.getDeviceData();
  }

  getDeviceData() {
    if (this.platform.is('android')) {
      this.deviceData['device_type'] = 'android'
      console.log("platform", 'android')
    } else if (this.platform.is('ios')) {
      this.deviceData['device_type'] = 'ios'
      console.log("platform", 'ios')
    } else {
      this.deviceData['device_type'] = 'other'
    }
    console.log("deviceData", this.deviceData)
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  notiFicationCounts(): any {
    return this.notificationCountSubject.asObservable();
  }

  getMessagesToAmmendments(): any {
    return this.messageSubject.asObservable();
  }

sendMessageToAmmendments(data){
  this.messageSubject.next(data);
  return true
}

  public get getPreviousUrl(): any {
    this.router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.previousUrl = e[0].urlAfterRedirects;
        // console.log("previousurl",this.previousUrl)
      });
    return this.previousUrl
  }

  /**
   * User Login
   * @param {Object} userData
   */
  loginUser(userData) {
    return this.http.post(config.baseApiUrl + 'login', userData).
      pipe(map((user: any) => {
        console.log("login user=========>", user.data);
        // login successful if there's a jwt token in the response
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user.data));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }


  /**
   * Register user
   * @param {Object} userData
   */
  signUpUser(userData) {
    return this.http.post(config.baseApiUrl + 'register', userData).
    pipe(map((user: any) => {
      console.log("login user=========>", user.data);
      // login successful if there's a jwt token in the response
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user.data));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  /**
   * Log out user
   */
  logOut() {
    const data = {
      id: JSON.parse(localStorage.getItem('currentUser')).id
    }
    return this.http.post(config.baseApiUrl + 'off-notification', data).pipe(
      map(res => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem("temprature");
        localStorage.removeItem("time");
        localStorage.removeItem('tempratureData');
        localStorage.removeItem('timeData');
        this.router.navigate(['/login'], { clearHistory: true } as NavigationExtras);
        this.currentUserSubject.next(null);
        return res;
      }))
  }

  /**
   * Get user profile
   * @param {Object} userId
   */
  getUserProfile(userId) {
    return this.http.post(config.baseApiUrl + 'user-data', userId)
  }

  /**
   * Edit user profile
   * @param {Object} userData
   */
  editUserProfile(userData) {
    return this.http.post(config.baseApiUrl + 'edit-user', userData)
  }

  /**
   * Update user profile pic
   * @param {object} data
   */
  updateProfilePic(data) {
    return this.http.post(config.baseApiUrl + 'edit-user', data)
  }

  /**
   * Forgot Password
   * @param {Object} data
   */
  forgotPassword(data) {
    return this.http.post(config.baseApiUrl + 'forgot-password', data);
  }

  /**
   * Reset Password
   * @param {Onject} data
   */
  resetPassWord(data) {
    return this.http.post(config.baseApiUrl + 'change-password', data);
  }

  /**
   * Get Notifications
   * @param {object} data
   */
  getNotification(data) {
    return this.http.post(config.baseApiUrl + 'get-notifications', data);
  }

  /**
   * Send Device token and type
   */
  sendDeviceToken() {
    this.deviceData['device_token'] = localStorage.getItem('deviceToken');
    // this.deviceData['device_token'] ='devicetoken';
    if (JSON.parse(localStorage.getItem('currentUser')))
      this.deviceData['id'] = JSON.parse(localStorage.getItem('currentUser')).id;
    console.log("device data in api call", this.deviceData)
    return this.http.post(config.baseApiUrl + 'update-device-token', this.deviceData);
  }

  /**
    * Get Country List
    */
   getCountryList() {
     return this.http.get("https://restcountries.eu/rest/v2/all");
   }

  /**
   * Get Timezone List
   */
  getTimeZoneList(){
    return this.http.get("https://worldtimeapi.org/api/timezone");
  }

  /**
   * Get Hometown Time
   * @param {String} data
   */
  getHomeTownTime(data){
    // console.log("data",data)
    return this.http.get("https://worldtimeapi.org/api/timezone/"+data);
  }

  /**
   * Get Current weather
   * @param {number} lat
   * @param {number} long
   */
  getWeather(lat, long) {
    const data = {
      lat: lat,
      long: long
    }
    return this.http.post(config.baseApiUrl + 'weather', data)
  }

  /**
   * Get Notification Count
   * @param {object} data
   */
  getNotificationCount(data) {
    return this.http.post(config.baseApiUrl + 'unread-count', data).pipe(
      map((res: any) => {
        this.notificationCountSubject.next({ "notification": res.data });
        return res;
      }))
  }

  getTime(lat,lng){
    return this.http.get('https://api.timezonedb.com/v2.1/get-time-zone?key=S3GVRR1XTRO9&format=json&by=position&lat='+lat+'&lng='+lng);
  }

}
