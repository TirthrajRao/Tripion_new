import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { TripService } from '../services/trip.service';
import { ToastService } from '../services/toast.service';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { data } from '../data';
import { FilePath } from '@ionic-native/file-path/ngx';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  latitude: any;
  longitude: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  allTrips: any = [];
  currentTime;
  refreshIntervalId;
  cityName: any;
  temperature;
  temperatureIcon: any;
  loading: Boolean = false;
  previousUrl;
  upCommingTrip: any;
  timeZone: any;
  offSet: any;
  curruetDate: string = new Date().toISOString();
  diffDays: any = [];
  notificationCount: any;
  timeZoneList = data.timeZone;
  homeTownData: any;
  constructor(
    private geolocation: Geolocation,
    public http: HttpClient,
    public router: Router,
    public _tripService: TripService,
    public _toastService: ToastService,
    public _userService: UserService,
    public event: Events,
    private filePath: FilePath
  ) {

    this.curruetDate = this.curruetDate.split('T')[0];
    console.log("currentdate", this.curruetDate);

    this._userService.notiFicationCounts().subscribe(response => {
      this.notificationCount = response.notification.count;
      console.log("response of notification count in home page =====>", response, this.notificationCount);

    })
    router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        console.log("eeee", e);
        if (e[1].urlAfterRedirects == '/home/home-page') {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          // console.log("urllllll", e[0].urlAfterRedirects);
          this.previousUrl = e[0].urlAfterRedirects;
          if (this.previousUrl.includes('other-details') || this.previousUrl.includes('login')) {
            console.log("in if");
            this.allTrips = []
            this.getAllTrips();
          }
        }
      });
   
   

      this.getAllTrips();

  }

  ngOnInit() {

    this.filePath.resolveNativePath('file:///storage/emulated/0/record1822020173636.mp3')
  .then(filePath => console.log("filepath",filePath))
  .catch(err => console.log("errr in filepath",err));
  }

  ionViewWillEnter() {
    console.log("in enter");
    // this.notificationCount = this._userService.notiFicationCounts;
    // console.log("notification count=======>",this.notificationCount)
    this.refreshIntervalId = setInterval(() => {
      this.getCurrentTime();
    }, 10000);
    this.getCurrentLatLong();
    this.getCurrentTime();
    this.getNotificationCount();
  }

  ionViewDidLeave() {
    clearInterval(this.refreshIntervalId);
  }

  getNotificationCount() {
    const data = {
      id: this.currentUser.id
    }
    this._userService.getNotificationCount(data).subscribe((res: any) => {
      console.log("======notification api response", res);
      this.notificationCount = res.data.count;
    }, err => {
      console.log("errrrr", err)
    })
  }

  /**
   * display upcoming trip title
   */
  upCommingTripData() {
    _.forEach(this.allTrips, (trip, index) => {
      if (trip.timeline_date) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate: any = new Date(this.curruetDate);
        const secondDate: any = new Date(trip.timeline_date);
        const diff = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        if (diff != 0)
          this.diffDays.push({ diff: diff, 'name': trip.inquiry_name })
        this.diffDays.sort((a, b) => (a.diff > b.diff) ? 1 : -1);
        if (this.diffDays[0].diff <= 30) {
          this.upCommingTrip = this.diffDays[0].name
        } else {
          this.upCommingTrip = 'Welcome'
        }
      }
    })
  }

  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.ionViewWillEnter();
    this.getAllTrips();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  /**
   * Get Current Time
   */
  getCurrentTime() {
    this.homeTownData = this.currentUser.home_town;
    let timeZone = this.timeZoneList[Number(this.homeTownData)]
    // getDateWithUTCOffset(inputTzOffset){
    var now = new Date(); // get the current time

    var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
    var deltaTzOffset = timeZone.offset - currentTzOffset; // timezone diff

    var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch 
    var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
    var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.
    this.currentTime = moment(outputDate).format('hh:mm')
    console.log("time", this.currentTime)


    // this._userService.getHomeTownTime(this.currentUser.home_town).subscribe((res: any) => {
    //   // console.log("datetime",res,res.datetime)
    //   this.currentTime = res.datetime;
    //   // this.currentTime = this.currentTime.split("T")[1];
    //   // this.currentTime = this.currentTime.split(':');
    //   // this.currentTime = this.currentTime[0] + ':' + this.currentTime[1]
    // }, err => {
    //   console.log("errr", err)
    // })

  }


  /**
   * Get current Location Lat Long
   */
  getCurrentLatLong() {
    console.log("==============currunt location===")
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("respons of lat long", resp);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.getLocation(this.latitude, this.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  /**
   * Get Location Name using lat,long and temprature
   * @param {number} lat 
   * @param {number} long 
   */
  getLocation(lat, long) {
    console.log("lat long", lat, long);
    this._userService.getWeather(lat, long).subscribe((res: any) => {
      console.log("===weather res===", res);
      this.temperature = ((5 / 9) * (res.data.temperature - 32)).toFixed(0);
      console.log("temprature===>", this.temperature)
    }, (err) => {
      console.log(err)
    })
  }



  /**
   * Get All Trips
   */
  getAllTrips() {
    const data = {
      id: this.currentUser.id
    }
    this.loading = true;
    this._tripService.getAllTrips(data).subscribe((res: any) => {
      this.allTrips = res.data;
      console.log(this.allTrips);
      // this.upCommingTripData();
      this.loading = false;
    }, (err) => {
      this._toastService.presentToast(err.error.message, 'danger');
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Move to plan option page
   * @param {Number} inquiryId 
   */
  getPlanOption(data) {
    console.log("inquiryid", data);
    if (data.list_of_inquiry.includes('Safe to travel')) {
      this.router.navigate(['/home/safe-travel']);
    } else {
      if (!data.is_direct) {
        if (data.plan_selected == 0) {
          this.router.navigate(['/home/all-plan/' + data.inquiry_id]);
        } else {
          this.router.navigate(['/home/plan-option/' + data.inquiry_id]);
        }
      } else {
        this.router.navigate(['/home/plan-option/' + data.inquiry_id]);
      }


    }
  }


}
