import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
declare const $: any;
@Component({
  selector: 'app-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.scss'],
})
export class ClimateComponent implements OnInit {
  selectClimateIcon = 'far fa-heart';
  selectTerrainIcon = 'far fa-heart';
  selectIntrestIcon = 'far fa-heart';
  climate: any;
  terrain: any;
  interests: any;
  formData: any;
  optionDescription:any;
  climateOption = [
    {
      name: 'Tropical',
      url: 'assets/images/climate/1.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Dry',
      url: 'assets/images/climate/2.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Temperate',
      url: 'assets/images/climate/3.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Polar',
      url: 'assets/images/climate/4.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Continental',
      url: 'assets/images/climate/5.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },

  ];
  terrainOption = [
    {
      name: 'Canyon',
      url: 'assets/images/terrain/1.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Desert',
      url: 'assets/images/terrain/2.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Forest',
      url: 'assets/images/terrain/3.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Glacier',
      url: 'assets/images/terrain/4.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Mountain',
      url: 'assets/images/terrain/5.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Valley',
      url: 'assets/images/terrain/6.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Open',
      url: 'assets/images/terrain/7.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'River',
      url: 'assets/images/terrain/8.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Ocean',
      url: 'assets/images/terrain/9.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },

  ];
  intrestOption = [
    {
      name: 'Food & Bevrages',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nightlife & Casino',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'History & Art',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Shopping',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Adventure',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Spa & Wellness',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Dance & Music',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Wildlife',
      url: 'assets/images/download.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },


  ];
  constructor(
    public router: Router,
    public route: ActivatedRoute
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
      this.createClimateSlider();
      this.createTerrainSlider();
      this.createInterestSlider();
    }, 10)
  }


  createClimateSlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
      speed: 100,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectClimateIcon = 'far fa-heart';
      this.climate = '';
      console.log("occian of the vacation", this.climate)
    });
  }

  createTerrainSlider() {
    $('.center1').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
      speed: 100,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectTerrainIcon = 'far fa-heart';
      this.terrain = '';
      console.log("occian of the vacation", this.terrain)
    });
  }

  createInterestSlider() {
    $('.center2').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
      speed: 100,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectIntrestIcon = 'far fa-heart';
      this.interests = '';
      console.log("occian of the vacation", this.interests)
    });
  }

  selectClimateOption(data) {
    console.log("index in occian", data);
    this.selectClimateIcon = this.selectClimateIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.climate = this.selectClimateIcon === 'fas fa-heart' ? data.name : '';
    console.log("climate of the vacation", this.climate);
  }

  selectTerrainOption(data) {
    console.log("index in occian", data);
    this.selectTerrainIcon = this.selectTerrainIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.terrain = this.selectTerrainIcon === 'fas fa-heart' ? data.name : '';
    console.log("terrain of the vacation", this.terrain);
  }

  selectInterestOption(data) {
    console.log("index in occian", data);
    this.selectIntrestIcon = this.selectIntrestIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.interests = this.selectIntrestIcon === 'fas fa-heart' ? data.name : '';
    console.log("intrest of the vacation", this.interests);
  }


  nextForm() {
    this.formData['climate'] = this.climate;
    this.formData['terrain'] = this.terrain;
    this.formData['interests'] = this.interests;
    let navigationExtras: NavigationExtras = {
      state: {
        data: JSON.stringify(this.formData)
      }
    }
    this.router.navigate(['/home/popularity-of-destination'], navigationExtras)
  }

  getDescription(data) {
    this.optionDescription = data;
    console.log("=========")
    $('.des_alert_box').fadeIn().addClass('animate');
    $('.des_alert_box').click(function () {
      $(this).hide().removeClass('animate');
    });
    $('.des_alert_box .alert_box_content').click(function (event) {
      event.stopPropagation();
    });
  }
}
