import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import Swiper from 'swiper';
declare const $: any;

@Component({
  selector: 'app-occasion-vacation',
  templateUrl: './occasion-vacation.component.html',
  styleUrls: ['./occasion-vacation.component.scss'],
})
export class OccasionVacationComponent implements OnInit {

  occasionOfTheVacation: any = "";
  atmosphereOfTheVacation: any = "";
  climate: any = "";
  terrain: any = "";
  interests: any = "";

  loading: Boolean = false;
  continentsList: any = [];

  occasionOption = [
    {
      name: 'Marriage Proposal',
      url: 'assets/images/occian/1.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Bachelor/Bachelorette Party',
      url: 'assets/images/occian/2.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Honeymoon',
      url: 'assets/images/occian/3.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Family Reunion',
      url: 'assets/images/occian/4.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Aniversary',
      url: 'assets/images/occian/5.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Guys Getaway (mancation)',
      url: 'assets/images/occian/6.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Girlfriends Getaway',
      url: 'assets/images/occian/7.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Business Appraisal',
      url: 'assets/images/occian/8.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Babymoon',
      url: 'assets/images/occian/9.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Annual Holidays',
      url: 'assets/images/occian/10.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Festival Holidays',
      url: 'assets/images/occian/11.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'School/College Friends Reunion',
      url: 'assets/images/occian/12.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Incentive Celebration',
      url: 'assets/images/occian/13.jpg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    }
  ];
  atmosphereOption = [
    {
      name: 'Relaxation',
      url: 'assets/images/atmosphere/1.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Adventure/Lost To Do',
      url: 'assets/images/atmosphere/2.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Romantic',
      url: 'assets/images/atmosphere/3.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Cltural Immersion',
      url: 'assets/images/atmosphere/4.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Historic Significance',
      url: 'assets/images/atmosphere/5.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Leisure & Luxury',
      url: 'assets/images/atmosphere/6.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Family Friendly',
      url: 'assets/images/atmosphere/7.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nightlife',
      url: 'assets/images/atmosphere/8.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nature Friendly',
      url: 'assets/images/atmosphere/9.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Cozy & Lazy',
      url: 'assets/images/atmosphere/10.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
  ];
  climateOption = [
    {
      name: 'Tropical',
      url: 'assets/images/climate/1.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Dry',
      url: 'assets/images/climate/2.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Temperate',
      url: 'assets/images/climate/3.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Polar',
      url: 'assets/images/climate/4.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Continental',
      url: 'assets/images/climate/5.png',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },

  ];
  terrainOption = [
    {
      name: 'Canyon',
      url: 'assets/images/terrain/1.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Desert',
      url: 'assets/images/terrain/2.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Forest',
      url: 'assets/images/terrain/3.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Glacier',
      url: 'assets/images/terrain/4.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Mountain',
      url: 'assets/images/terrain/5.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Valley',
      url: 'assets/images/terrain/6.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Open',
      url: 'assets/images/terrain/7.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'River',
      url: 'assets/images/terrain/8.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Ocean',
      url: 'assets/images/terrain/9.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },

  ];
  intrestOption = [
    {
      name: 'Food & Bevrages',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nightlife & Casino',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'History & Art',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Shopping',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Adventure',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Spa & Wellness',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Dance & Music',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Wildlife',
      url: 'assets/images/download.jpeg',
      isSelectIcon: false,
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },


  ];
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
    public router: Router
  ) { }

  ngOnInit() {
    setTimeout(()=>{
      var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop:true,
        speed :100,
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true,
        },
       
      });
    },1)
   


    setTimeout(() => {
      this.createOccasionSlider();
    }, 100)

    $('#bologna-list a').on('click', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    $('ul#bologna-list li a').click(() => {
      $('.center').slick('refresh');
    });
    $('ul.nav.nav-tabs li a').click(() => {
      setTimeout(() => {
        $('.center').slick('refresh');
      }, 1);
    });
    $('.map-tab').click(() => {
      console.log("click map tab");
      setTimeout(() => {
        this.createMap();
      }, 300);
      this.continentsList = [];
    })

  }

  createMap() {
    // CSSMap;
    $("#map-continents").CSSMap({
      "size": 1450,
      // "mobileSupport": true,
      'multipleClick': {
        'enable': true,
        'hideSearchLink': true,
        'clicksLimit': 2,
        'clicksLimitAlert': "You can select only %d region! || regions!"
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

        } else if (name == 'Oceania') {
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
          this.createMapSlider();
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
  }

  createMapSlider() {
    $('.gallery').flickity({
      // options
      // cellAlign: 'left',
      // contain: true
      "freeScroll": true,
      "wrapAround": true,
      contain: true,
      prevNextButtons: false,
      pageDots: false
    });
    // $('.map-slider').not('.slick-initialized').slick({
    //   centerMode: true,
    //   centerPadding: '100px',
    //   slidesToShow: 1,
    //   speed: 100,
    //   slidesToScroll: 4,
    // });
  }

  createOccasionSlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '35px',
      slidesToShow: 1,
      speed: 100,
      slidesToScroll: 4
    })
  }

  selectOccianOption(data, index) {

    _.forEach(this.occasionOption, (option, i) => {
      if ($('.active-' + i).hasClass('animate-icon')) {
        console.log("has class")
        $('.active-' + i).removeClass('animate-icon');
      }
      if (option.name == data.name) {
        option.isSelectIcon = !option.isSelectIcon;
        if (option.isSelectIcon) {
          console.log("in if")
          this.occasionOfTheVacation = data.name;
          $('.active-' + index).removeClass('unselect-icon');
          $('.active-' + index).addClass('animate-icon');
        } else {
          $('.like-icon').removeClass('select-option');
          $('.active-' + index).removeClass('animate-icon');
          $('.active-' + index).addClass('unselect-icon');
          this.occasionOfTheVacation = "";
        }
      } else {
        option.isSelectIcon = false;
      }
    })
    console.log("occian of the vacation", this.occasionOfTheVacation);
  }

  selectAtmospereOption(data, index) {
    _.forEach(this.atmosphereOption, (option, i) => {
      if ($('.active-atm-' + i).hasClass('animate-icon')) {
        console.log("has class")
        $('.active-atm-' + i).removeClass('animate-icon');
      }
      if (option.name == data.name) {
        option.isSelectIcon = !option.isSelectIcon;
        if (option.isSelectIcon) {
          this.atmosphereOfTheVacation = data.name;
          $('.active-atm-' + index).removeClass('unselect-icon');
          $('.active-atm-' + index).addClass('animate-icon');
        } else {
          $('.active-atm-' + index).removeClass('animate-icon');
          $('.active-atm-' + index).addClass('unselect-icon');
          this.atmosphereOfTheVacation = "";
        }
      } else {
        option.isSelectIcon = false;
      }
    })
    console.log("atomospere of the vacation", this.atmosphereOfTheVacation);
  }

  selectClimateOption(data, index) {
    _.forEach(this.climateOption, (option, i) => {
      if ($('.active-cli-' + i).hasClass('animate-icon')) {
        console.log("has class")
        $('.active-cli-' + i).removeClass('animate-icon');
      }
      if (option.name == data.name) {
        option.isSelectIcon = !option.isSelectIcon;
        if (option.isSelectIcon) {
          this.climate = data.name;
          $('.active-cli-' + index).removeClass('unselect-icon');
          $('.active-cli-' + index).addClass('animate-icon');
        } else {
          $('.active-cli-' + index).removeClass('animate-icon');
          $('.active-cli-' + index).addClass('unselect-icon');
          this.climate = "";
        }
      } else {
        option.isSelectIcon = false;
      }
    })
    console.log("climate", this.climate);
  }

  selectTerrainOption(data, index) {
    _.forEach(this.terrainOption, (option, i) => {
      if ($('.active-ter-' + i).hasClass('animate-icon')) {
        console.log("has class")
        $('.active-ter-' + i).removeClass('animate-icon');
      }
      if (option.name == data.name) {
        option.isSelectIcon = !option.isSelectIcon;
        if (option.isSelectIcon) {
          this.terrain = data.name;
          $('.active-ter-' + index).removeClass('unselect-icon');
          $('.active-ter-' + index).addClass('animate-icon');
        } else {
          $('.active-ter-' + index).removeClass('animate-icon');
          $('.active-ter-' + index).addClass('unselect-icon');
          this.terrain = "";
        }
      } else {
        option.isSelectIcon = false;
      }
    })
    console.log("terrain", this.terrain);
  }

  selectInterestOption(data, index) {
    _.forEach(this.intrestOption, (option, i) => {
      if ($('.active-int-' + i).hasClass('animate-icon')) {
        console.log("has class")
        $('.active-int-' + i).removeClass('animate-icon');
      }
      if (option.name == data.name) {
        option.isSelectIcon = !option.isSelectIcon;
        if (option.isSelectIcon) {
          this.interests = data.name;
          $('.active-int-' + index).removeClass('unselect-icon');
          $('.active-int-' + index).addClass('animate-icon');
        } else {
          $('.active-int-' + index).removeClass('animate-icon');
          $('.active-int-' + index).addClass('unselect-icon');
          this.interests = "";
        }
      } else {
        option.isSelectIcon = false;
      }
    })
    console.log("interest", this.interests);
  }


  nextForm() {

    const obj = {
      occasion_of_the_vacation: this.occasionOfTheVacation,
      atmosphere_of_the_vacation: this.atmosphereOfTheVacation,
      climate: this.climate,
      terrain: this.terrain,
      interests: this.interests
    }
    console.log("object", obj)
    let navigationExtras: NavigationExtras = {
      state: {
        data: JSON.stringify(obj)
      }
    }
    this.router.navigate(['/home/climate'], navigationExtras)
  }

}
