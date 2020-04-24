import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
declare const $: any;
@Component({
  selector: 'app-popularity-of-destination',
  templateUrl: './popularity-of-destination.component.html',
  styleUrls: ['./popularity-of-destination.component.scss'],
})
export class PopularityOfDestinationComponent implements OnInit {
  selectPopularityIcon = 'far fa-heart';
  selectTravelIcon = 'far fa-heart';
  // selectIntrestIcon = 'far fa-heart';
  popularityOfDestination: any;
  additionalTravelExperience: any;
  // distance_from_you:any;
  formData: any;
  popularityOption = [
    {
      name: 'Trending Bucket List',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Explored',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Unexplored',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Off Beat',
      url: 'assets/images/download.jpeg'
    }
  ];
  travelOption = [
    {
      name: 'Eco-Friendly',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Singles Trip',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Couple Friendly',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'LGBTQ + Friendly',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Volunteerism',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Learning Experiences',
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
      this.createPopularitySlider();
      this.createTravelSlider();
      // this.createInterestSlider();
    }, 100)
  }


  createPopularitySlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectPopularityIcon = 'far fa-heart';
      this.popularityOfDestination = '';
      console.log("occian of the vacation", this.popularityOfDestination)
    });
  }

  createTravelSlider() {
    $('.center1').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectTravelIcon = 'far fa-heart';
      this.additionalTravelExperience = '';
      console.log("occian of the vacation", this.additionalTravelExperience)
    });
  }

  // createInterestSlider() {
  //   $('.center').not('.slick-initialized').slick({
  //     centerMode: true,
  //     centerPadding: '100px',
  //     slidesToShow: 1,
  //   }).on('beforeChange', () => {
  //     console.log("change");
  //     this.selectIntrestIcon = 'far fa-heart';
  //     this.interests = '';
  //     console.log("occian of the vacation", this.interests)
  //   });
  // }

  selectPopularityOption(data) {
    console.log("index in occian", data);
    this.selectPopularityIcon = this.selectPopularityIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.popularityOfDestination = this.selectPopularityIcon === 'fas fa-heart' ? data.name : '';
    console.log("popularityOfDestination ", this.popularityOfDestination);
  }

  selectTravelOption(data) {
    console.log("index in occian", data);
    this.selectTravelIcon = this.selectTravelIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.additionalTravelExperience = this.selectTravelIcon === 'fas fa-heart' ? data.name : '';
    console.log("additionalTravelExperience", this.additionalTravelExperience);
  }

  // selectInterestOption(data) {
  //   console.log("index in occian", data);
  //   this.selectIntrestIcon = this.selectIntrestIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
  //   this.interests = this.selectIntrestIcon === 'fas fa-heart' ? data.name : '';
  //   console.log("intrest of the vacation", this.interests);
  // }

  nextForm() {
    this.formData['popularity_of_destination'] = this.popularityOfDestination;
    this.formData['additional_travel_experience'] = this.additionalTravelExperience;
    // this.formData['interests'] = this.interests;
    let navigationExtras: NavigationExtras = {
      state: {
        data: JSON.stringify(this.formData)
      }
    }
    this.router.navigate(['/home/travelling-zone'], navigationExtras)
  }
}
