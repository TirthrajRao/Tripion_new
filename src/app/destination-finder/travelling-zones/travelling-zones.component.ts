import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AppComponent } from '../../app.component';
declare const $: any;

@Component({
  selector: 'app-travelling-zones',
  templateUrl: './travelling-zones.component.html',
  styleUrls: ['./travelling-zones.component.scss'],
})
export class TravellingZonesComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  continentsList: any = [];
  formData: any;
  loading:Boolean = false;
  NorthAmerica = [
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    }
  ];
  Asia = [
    {
      url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      name: 'Cap Town'
    },
    {
      url: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },

  ];
  SouthAmerica = [
    {
      url: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },

  ];
  Africa = [

    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
  ];
  Australia = [
    {
      url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      name: 'Cap Town'
    },
    {
      url: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },
  ];
  Europe = [
    {
      url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      name: 'Cap Town'
    },
    {
      url: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/download.jpeg',
      name: 'Cap Town'
    },
    {
      url: 'assets/images/e.png',
      name: 'Cap Town'
    },
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _tripService: TripService,
    public appComponant: AppComponent
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.formData = this.router.getCurrentNavigation().extras.state.data;
        console.log("form data", this.formData)
        this.formData = JSON.parse(this.formData)
        console.log("form data", this.formData)
      }
    });

  }

  ngOnInit() {
    setTimeout(() => {
      // CSSMap;
      $("#map-continents").CSSMap({
        "size": 320,
        "mobileSupport": true,
        'multipleClick': {
          'enable': true,
          'hideSearchLink': true
        },
        onClick: (listItem) => {
          const name = listItem[0].textContent
          if (name == 'North America') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.NorthAmerica
            });

          } else if (name == 'South America') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.SouthAmerica
            });

          } else if (name == 'Asia') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.Asia
            });

          } else if (name == 'Africa') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.Africa
            });

          } else if (name == 'Australia') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.Australia
            });

          } else if (name == 'Europe') {
            this.continentsList.push({
              name: listItem[0].textContent,
              images: this.Europe
            });

          }
          setTimeout(() => {
            this.createSlider();
          }, 1)
          console.log(this.continentsList)
        },
        onSecondClick: (listItem) => {
          console.log(listItem[0].textContent);
          this.continentsList = this.continentsList.filter(function (el) { return el.name != listItem[0].textContent; });
          // this.continentsList.splice(this.continentsList.indexOf(listItem[0].textContent), 1);
          console.log(this.continentsList)
        }
      });
    }, 10)
    setTimeout(() => {
      this.createSlider();
    }, 100)
  }

  createSlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    });
  }


  nextForm() {
    const selectedContinent = []
    this.continentsList.map((continent) => {
      selectedContinent.push(continent.name)
    })
    console.log("contrnant list", selectedContinent);
    this.formData['map'] = selectedContinent.toString();
    this.formData['id'] = this.currentUser.id;
    console.log("final form dtaa",this.formData);
    this.loading = true;
    this._tripService.addDestinationReq(this.formData).subscribe((res:any)=>{
      console.log("res",res);
      this.router.navigate(['/home/destination-finder'])
      this.loading = false;
    },err=>{
      console.log("err",err);
      this.loading = false;
      this.appComponant.errorAlert(err.error.message)
    })
  }
}
