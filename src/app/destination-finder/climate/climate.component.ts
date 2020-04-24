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
  formData: any
  climateOption = [
    {
      name: 'Tropical',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Dry',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Temperate',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Polar',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Continental',
      url: 'assets/images/download.jpeg'
    },

  ];
  terrainOption = [
    {
      name: 'Canyon',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Desert',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Forest',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Glacier',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Mountain',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Valley',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Open',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'River',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Ocean',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Urban',
      url: 'assets/images/download.jpeg'
    },

  ];
  intrestOption = [
    {
      name: 'Food & Bevrages',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Nightlife & Casino',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'History & Art',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Shopping',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Adventure',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Spa & Wellness',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Dance & Music',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Wildlife',
      url: 'assets/images/download.jpeg'
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
    }, 100)
  }


  createClimateSlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
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
}
