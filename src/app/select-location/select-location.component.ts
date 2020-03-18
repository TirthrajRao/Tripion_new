import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ChatService } from '../services/chat.service';
import { GoogleMaps, GoogleMap  } from '@ionic-native/google-maps';
import { HTTP } from '@ionic-native/http/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ToastService } from '../services/toast.service';
declare const $: any;

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
})
export class SelectLocationComponent implements OnInit {
  map: GoogleMap;
  elementMap: HTMLElement;
  lat: any;
  lng: any;
  markerLat: any;
  markerLng: any;
  cityName: any;
  isDisplay:Boolean = false;
  // @ViewChild('map', { static: false }) mapElement: ElementRef;
  // @ViewChild('pleaseConnect', { static: false }) pleaseConnect: ElementRef;

  location: any;
  height = 0;
  searchedLocation: any = [];
  constructor(
    public modlCtrl: ModalController,
    private geolocation: Geolocation,
    private googleMaps: GoogleMaps,
    public platform: Platform,
    public _chatService: ChatService,
    private http: HTTP,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    public _toastService:ToastService
  ) {
    this.getCurrentLocation();
    this.height = platform.height() - 56;

  }

  ngOnInit() {
    // this.createMap();

  }


  /**
   * Get Current Location
   */
  getCurrentLocation() {


    // console.log("==============currunt location===")
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   console.log("respons of lat long", resp);
    //   this.markerLat = resp.coords.latitude;
    //   this.markerLng = resp.coords.longitude;
      
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });



    console.log("get Current location")
    this.geolocation.getCurrentPosition().then((geo) => {
      console.log("geo=====>", geo)
      this.markerLat = geo.coords.latitude;
      this.markerLng = geo.coords.longitude;
      this.lat = geo.coords.latitude;
      this.lng = geo.coords.longitude;

    }).catch((error) => {
      console.log("err",error);
    });
  }


  markerDragEnd($event: MouseEvent) {
    console.log('dragEnd', $event);
  }

  /**
   * Search Location
   */
  searchLocation() {
    console.log("search location", $('#searchinput').val());
    $("agm-map").css({ height: this.height/2 })
    this.isDisplay  = false;
    const locationName = $('#searchinput').val()
    this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + locationName + '&key=AIzaSyAHyK08CHb5PEfGHwUc34x-Lnp86YsODGg&sessiontoken=1234567890', {}, {})
      .then(data => {
        console.log(data.status);
        console.log("dataa", data.data, JSON.parse(data.data).predictions); // data received by server
        this.searchedLocation = JSON.parse(data.data).predictions;
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }

  /**
   * Send Selected Location
   * @param {Object} data 
   */
  selectLocation(data) {
    console.log("data", data);
    this.router.navigate(['details', { locationData: data }]);
    let navigationExtras: NavigationExtras = {
      state: data
    };
    this.router.navigate(['/home/amendments'], { queryParams: data });
  }


  mapDragEnd($event: MouseEvent) {
    console.log("map drag", $event)
  }

  centerChange(e) {
    console.log("map change", e);
    this.markerLat = e.lat;
    this.markerLng = e.lng
    console.log("new lat lng", this.markerLat, this.markerLng);
    if (this.lat != this.markerLat && this.lng != this.markerLng) {
      this.isDisplay = true;
      $("agm-map").css({ height: this.height - 150 })
      this.getLocationName(this.markerLat, this.markerLng)
    }
  }


  getLocationName(lat, lng) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };
    this.nativeGeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log("location", result[0].locality);
        this.cityName = result[0].locality;
      })
      .catch((error: any) => {
        console.log(error);
        this._toastService.presentToast('Cannot Get Location', 'danger')
      });
  }

  sendSelectedLocation(){
    const data={
      lat:this.markerLat,
      lng:this.markerLng,
      name:this.cityName
    }
    this.router.navigate(['/home/amendments'], { queryParams: data});

  }

  sendCurrentLocation(){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };
    this.nativeGeocoder.reverseGeocode(this.lat, this.lng, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log("location", result[0].locality);
        this.cityName = result[0].locality;
        const data={
          lat:this.lat,
          lng:this.lng,
          name:this.cityName
        }
        this.router.navigate(['/home/amendments'], { queryParams: data});
      })
      .catch((error: any) => {
        console.log(error);
        this._toastService.presentToast('Cannot Get Location', 'danger')
      });
    
  }
}
