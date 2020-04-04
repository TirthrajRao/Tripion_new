import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { TripService } from '../services/trip.service';
import { ToastService } from '../services/toast.service';
import { Router, RoutesRecognized, NavigationExtras } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { data } from '../data';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AppComponent } from '../app.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { citydata } from '../city';
declare const $: any;

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
  // allCites = citydata.city;
  tempratureIndex = localStorage.getItem('temprature');
  timeIndex = localStorage.getItem('time')
  tempratureCity: any;
  cityRefreshInterval: any;
  searchedResult: any = [];
  tempratureData: any;
  timeData: any;
  timeCity: any;
  constructor(
    private geolocation: Geolocation,
    public http: HttpClient,
    public router: Router,
    public _tripService: TripService,
    public _toastService: ToastService,
    public _userService: UserService,
    public event: Events,
    private filePath: FilePath,
    public appComponent: AppComponent,
    private nativeGeocoder: NativeGeocoder,
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
          if (this.previousUrl.includes('other-details') || this.previousUrl.includes('login') || this.previousUrl.includes('general-detail') || this.previousUrl.includes('signup') || this.previousUrl.includes('premium-account') || this.previousUrl.includes('passport') || this.previousUrl.includes('all-plan')
          ) {
            console.log("in if");
            this.allTrips = []
            this.getAllTrips();
          }
        }
      });
    this.getAllTrips();

  }


  ngOnInit() {

    const cityList = citydata.city;
    // _.forEach(cityList, (city, index) => {
    //   if (index <= 1500) {
    //     this.allCites.push(city)
    //   } else {
    //     return false
    //   }
    // });

    // setTimeout(() => {

    //   this.cityRefreshInterval = setInterval(() => {
    //     const cityLength = this.allCites.length + 1500
    //     for (let i = this.allCites.length - 1; i < cityLength; i++) {
    //       if (i < cityList.length
    //       ) {
    //         this.allCites.push(cityList[i]);
    //       } else {
    //         console.log("in else", this.allCites, i);
    //         clearInterval(this.cityRefreshInterval);
    //       }
    //     }
    //     console.log("all  city after push", this.allCites)
    //   }, 1800)
    // }, 1500)

    // $(document).ready(function () {

    //   $('#myselection1').select2({
    //   });
    // });

    // $('#myselection1').on('select2:select', (e) => {
    //   console.log(this.allCites[e.params.data.id]);
    //   localStorage.setItem("temprature", e.params.data.id)
    //   const data = this.allCites[e.params.data.id];
    //   localStorage.setItem("tempratureData", JSON.stringify(data));
    //   this.getWeather(data.lat, data.lng)
    // });

    // $(document).ready(function () {
    //   $('#myselection2').select2({
    //   });
    // });
    // $('#myselection2').on('select2:select', (e) => {
    //   console.log(this.allCites[e.params.data.id]);
    //   this.getTime(this.allCites[e.params.data.id].lat, this.allCites[e.params.data.id].lng);
    //   const data = this.allCites[e.params.data.id];
    //   localStorage.setItem("time", e.params.data.id)
    //   localStorage.setItem("timeData", JSON.stringify(data));
    //   this.getTime(data.lat, data.lng)
    // });
  }




  ionViewWillEnter() {
    console.log("in enter", this.tempratureIndex);
    this.tempratureData = JSON.parse(localStorage.getItem('tempratureData'));
    this.timeData = JSON.parse(localStorage.getItem('timeData'))
    console.log("this.temprature data", this.tempratureData, this.timeData);

    //Get Temprature
    if (this.tempratureData) {
      this.tempratureIndex = localStorage.getItem('temprature');
      this.tempratureCity = this.tempratureData.city;
      this.getWeather(this.tempratureData.lat, this.tempratureData.lng)
    }

    //Get Time
    if (this.timeData) {
      this.timeCity = this.timeData.city;
      this.getTime(this.timeData.lat, this.timeData.lng)
    }


    //Get Temprature
    // if (this.tempratureIndex && this.tempratureIndex != '0') {
    //   if (this.allCites[this.tempratureIndex]) {
    //     console.log("---------", this.allCites[this.tempratureIndex])
    //     this.getWeather(this.allCites[this.tempratureIndex].lat, this.allCites[this.tempratureIndex].lng)
    //   } else {
    //     console.log("in else", JSON.parse(localStorage.getItem('tempratureData')));
    //     const data = JSON.parse(localStorage.getItem('tempratureData'))
    //     this.getWeather(data.lat, data.lng)
    //   }
    // }

    //Get Time
    // if (this.timeIndex && this.timeIndex != '0') {
    //   if (this.allCites[this.timeIndex]) {
    //     this.getTime(this.allCites[this.timeIndex].lat, this.allCites[this.timeIndex].lng)
    //   } else {
    //     console.log("in else", JSON.parse(localStorage.getItem('timeData')));
    //     const data = JSON.parse(localStorage.getItem('timeData'))
    //     this.getTime(data.lat, data.lng)
    //   }
    // }

    this.refreshIntervalId = setInterval(() => {
      this.timeIndex = localStorage.getItem('time');
      this.timeData = JSON.parse(localStorage.getItem('timeData'))
      this.timeCity = this.timeData.city;
      this.getTime(this.timeData.lat, this.timeData.lng)
      // this.getTime(this.allCites[this.timeIndex].lat, this.allCites[this.timeIndex].lng)
    }, 10000);

    this.getNotificationCount();
    this.getCurrentLatLong();
    // this.getCurrentTime();
  }

  ionViewDidLeave() {
    console.log("view did leave")
    clearInterval(this.refreshIntervalId);
  }

  checkUserProfile() {
    if (!this.currentUser.email) {
      $('.success_alert_box2').fadeIn().addClass('animate');
    }
  }

  /**
   * navigate to complete their profile
   */
  completeProfile() {
    this.router.navigate(['/home/profile']);
    $('.success_alert_box2').hide().removeClass('animate');
  }

  getTime(lat, lng) {
    this._userService.getTime(lat, lng).subscribe((res: any) => {
      this.currentTime = res.formatted;
      this.currentTime = moment(this.currentTime).format('hh:mm')
    }, err => {
      console.log("errrrrrr", err)
    })
  }

  /**
   * Get notification count
   */
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

    this.currentTime = new Date().toISOString();
    this.currentTime = moment.utc(this.currentTime).local().format();
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
      const obj = {
        city: "Rajkot",
        lat: this.latitude,
        lng: this.longitude,
        country: "hjh"
      }
      // this.allCites[0] = obj;
      // if (this.tempratureIndex == '0') {
      //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
      // } else if (!this.tempratureIndex) {
      //   localStorage.setItem("temprature", '0');
      //   this.tempratureIndex = localStorage.getItem('temprature')
      //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
      // }

      if (!this.tempratureData) {
        this.tempratureCity = obj.city
        this.getWeather(obj.lat, obj.lng)
      }
      if (!this.timeData) {
        this.timeCity = obj.city
        this.getTime(obj.lat, obj.lng)
      }

      // if (this.timeIndex == '0') {
      //   this.getTime(this.allCites[0].lat, this.allCites[0].lng)
      // } else if (!this.timeIndex) {
      //   console.log("in else")
      //   localStorage.setItem("time", '0');
      //   this.timeIndex = localStorage.getItem('time')
      //   this.getTime(this.allCites[0].lat, this.allCites[0].lng)
      // }
      // console.log("this.alllllllcity", this.allCites);

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
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };
    this.nativeGeocoder.reverseGeocode(lat, long, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log("location", result[0].locality);
        this.cityName = result[0].locality;
        console.log("cityname", this.cityName);
        const obj = {
          city: this.cityName,
          lat: this.latitude,
          lng: this.longitude,
          country: "hjh"
        }

        if (!this.tempratureData) {
          this.tempratureCity = obj.city
          this.getWeather(obj.lat, obj.lng)
        }
        if (!this.timeData) {
          this.timeCity = obj.city
          this.getTime(obj.lat, obj.lng)
        }
        // this.allCites[0] = obj;
        // if (this.tempratureIndex == '0') {
        //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
        // } else if (!this.tempratureIndex) {
        //   localStorage.setItem("temprature", '0');
        //   this.tempratureIndex = localStorage.getItem('temprature')
        //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
        // }
        // if (this.timeIndex == '0') {
        //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
        // } else if (!this.timeIndex) {
        //   localStorage.setItem("time", '0');
        //   this.timeIndex = localStorage.getItem('time')
        //   this.getWeather(this.allCites[0].lat, this.allCites[0].lng)
        // }
      })
      .catch((error: any) => {
        console.log("err get in cityname", error);
      });
    if (!this.tempratureIndex)
      this.getWeather(lat, long)

  }

  getWeather(lat, long) {
    console.log("weather la long", lat, long)
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
      this.checkUserProfile();
      this.loading = false;
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Move to plan option page
   * @param {Number} inquiryId 
   */
  getPlanOption(data) {
    console.log("inquiryid", data, data.form_id);
    if (data.list_of_inquiry.includes('Safe to travel')) {
      this.router.navigate(['/home/safe-travel']);
    } else {
      if (!data.is_direct) {
        if (data.plan_selected == 0) {
          this.router.navigate(['/home/all-plan/' + data.inquiry_id], { queryParams: { formId: data.form_id } });
        } else {
          console.log("in elseeeeeeee")
          if (data.status[0] == "Ongoing" && data.timeline_date) {
            console.log("ingoing trip", data.status[0]);
            this.router.navigate(['home/trip-planing/' + data.inquiry_id])
          } else {
            console.log("in else")
            this.router.navigate(['/home/plan-option/' + data.inquiry_id]);
          }
        }
      } else {
        this.router.navigate(['/home/plan-option/' + data.inquiry_id]);
      }
    }
  }


  /**
   * Redirect to selecct city
   * @param {string} type 
   */
  selectCity(type) {
    console.log("type", type);
    this.router.navigate(['/home/select-city/' + type])

  }
}
