import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { citydata } from '../city';
import { IonInfiniteScroll } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
const cities = require('cities.json');
import * as _ from 'lodash'
;@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
})
export class SelectCityComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  type: any;
  // allCity = citydata.city
  allCity:any;
  cityList: any = [];
  searchedResult: any = [];
  searchedCityList: any = [];
  latitude: any;
  longitude: any;
  cityName: any;
  isVisible: Boolean = true;
  noResult: Boolean = false;
  constructor(
    public route: ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public router: Router
  ) {

    this.route.params.subscribe((param) => {
      this.type = param.type
    })

    this.getCurrentLatLong();
  }

  ngOnInit() {
    const data = _.uniq(cities, 'name');
    this.allCity = data;
    console.log("cities----------->", cities,"-----",data[0])
    console.log("type", this.type)
    console.log("all city", this.allCity);
    this.getCityList();

  }

  /**
   * Get current latt lng
   */
  getCurrentLatLong() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("respons of lat long", resp);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.getLocation(this.latitude, this.longitude)
      const obj = {
        name: "Rajkot",
        lat: this.latitude,
        lng: this.longitude,
        country: "hjh"
      }
      console.log(obj)
      this.allCity[0] = obj;
      console.log(this.allCity[0])
      this.getCityList();
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
          name: this.cityName,
          lat: this.latitude,
          lng: this.longitude,
          country: "a"
        }
        this.allCity[0] = obj;
        this.getCityList();
      })
      .catch((error: any) => {
        console.log("err get in cityname", error);
      });
  }

  /**
   * Get All City List
   */
  getCityList() {
    this.cityList = []
    console.log("call")
    for (let i = 0; i <= 70; i++) {
      this.cityList.push(this.allCity[i])
    }
  }

  /**
   * Load data in infinite scroll
   */
  loadData(event) {
    console.log("event", event)
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.appendItems(70);
      if (this.allCity.length < this.allCity.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  /**
   * Push City data
   * @param {number} number 
   */
  appendItems(number) {
    console.log('length is', number);
    console.log(this.cityList, this.allCity)
    const cityLength = this.cityList.length + 70
    for (let i = this.cityList.length; i <= cityLength; i++) {
      if (i < this.allCity.length) {
        this.cityList.push(this.allCity[i])
      }
    }
  }

  /**
   * Get searched result
   * @param {string} searchbar 
   */
  getItems(searchbar) {
    this.isVisible = false;
    console.log("value", searchbar.target.value)
    var q = searchbar.target.value;
    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      console.log("------");
      this.searchedResult = [];
      this.isVisible = true
      this.getCityList();
      return;
    }

    this.searchedResult = this.allCity.filter((v) => {
      if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
    if (!this.searchedResult.length) {
      this.noResult = true;
      // this.isVisible = true;
    } else {
      this.noResult = false;
    }
    // console.log("searched item", this.searchedResult);
    this.searchedCityList = [];
    for (let i = 0; i <= 20; i++) {
      if (i < this.searchedResult.length)
        this.searchedCityList.push(this.searchedResult[i])
    }
  }

  /**
   * Load serached result to infinite scroll
   */
  loadSearchResultData(event) {
    console.log("event in search result", event)
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.appendSearchItems(20);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.searchedResult.length < this.searchedResult.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  /**
   * Push search result data
   * @param {number} number 
   */
  appendSearchItems(number) {
    console.log('length is', number);
    console.log(this.searchedCityList, this.searchedResult)
    const cityLength = this.searchedCityList.length + 20
    for (let i = this.searchedCityList.length; i <= cityLength; i++) {
      if (i < this.searchedResult.length) {
        this.searchedCityList.push(this.searchedResult[i])
      }
    }
  }

  /**
   * Store Selected Data
   * @param {object} data 
   */
  storeSelectedData(data) {
    console.log("data and type", data, this.type);
    if (this.type == "temperature") {
      localStorage.setItem('tempratureData', JSON.stringify(data));
      this.router.navigate(['/home/home-page'])
    } else if (this.type == 'time') {
      localStorage.setItem('timeData', JSON.stringify(data));
      this.router.navigate(['/home/home-page'])
    }
  }
}
