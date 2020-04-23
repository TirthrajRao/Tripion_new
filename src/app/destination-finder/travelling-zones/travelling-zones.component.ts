import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
declare const $: any;

@Component({
  selector: 'app-travelling-zones',
  templateUrl: './travelling-zones.component.html',
  styleUrls: ['./travelling-zones.component.scss'],
})
export class TravellingZonesComponent implements OnInit {
  continentsList: any = [];
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
  slideOpts = {
    initialSlide: 2,
    slidesPerView: 3,
    speed: 400,
    loop: true
  };
  constructor() {
    setTimeout(() => {
      $('.center').slick({
        centerMode: true,
        centerPadding: '100px',
        slidesToShow: 1,
      });
      this.createSlider();
      // $('.passport_slider').slick({
      //   centerMode: true,
      //   slidesToShow: 3,
      //   // arrows: true,  
      //   swipe: true,
      //   swipeToSlide: true,
      //   slidesToScroll: 1,
      //   draggable: true,


      // });
    }, 100)

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

    }, 300)

  }
  createSlider() {
    // $('.passport_slider').not('.slick-initialized').slick({
    //   centerMode: true,
    //   slidesToShow: 1,
    //   // arrows: true,  
    //   swipe: true,
    //   swipeToSlide: true,
    //   slidesToScroll: 1,
    //   draggable: true,
    // })
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    });
  }


  nextForm() {
    this.continentsList = _.uniq(this.continentsList);
    const selectedContinent = []
    this.continentsList.map((continent) => {
      selectedContinent.push(continent.name)
    })
    console.log("contrnant list", selectedContinent)
  }
}
