import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationExtras } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-occasion-vacation',
  templateUrl: './occasion-vacation.component.html',
  styleUrls: ['./occasion-vacation.component.scss'],
})
export class OccasionVacationComponent implements OnInit {
  selectIcon = 'far fa-heart';
  selectAtmosphereIcon = 'far fa-heart';
  occasionOfTheVacation: any;
  atmosphereOfTheVacation: any;
  optionDescription:any;
  occasionOption = [
    {
      name: 'Marriage Proposal',
      url: 'assets/images/occian/1.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Bachelor/Bachelorette Party',
      url: 'assets/images/occian/2.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Honeymoon',
      url: 'assets/images/occian/3.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Family Reunion',
      url: 'assets/images/occian/4.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Aniversary',
      url: 'assets/images/occian/5.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Guys Getaway (mancation)',
      url: 'assets/images/occian/6.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Girlfriends Getaway',
      url: 'assets/images/occian/7.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Business Appraisal',
      url: 'assets/images/occian/8.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Babymoon',
      url: 'assets/images/occian/9.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Annual Holidays',
      url: 'assets/images/occian/10.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Festival Holidays',
      url: 'assets/images/occian/11.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'School/College Friends Reunion',
      url: 'assets/images/occian/12.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Incentive Celebration',
      url: 'assets/images/occian/13.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    }
  ];
  atmosphereOption = [
    {
      name: 'Relaxation',
      url: 'assets/images/atmosphere/1.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Adventure/Lost To Do',
      url: 'assets/images/atmosphere/2.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Romantic',
      url: 'assets/images/atmosphere/3.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Cltural Immersion',
      url: 'assets/images/atmosphere/4.jpeg',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Historic Significance',
      url: 'assets/images/atmosphere/5.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Leisure & Luxury',
      url: 'assets/images/atmosphere/6.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Family Friendly',
      url: 'assets/images/atmosphere/7.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nightlife',
      url: 'assets/images/atmosphere/8.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Nature Friendly',
      url: 'assets/images/atmosphere/9.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      name: 'Cozy & Lazy',
      url: 'assets/images/atmosphere/10.png',
      des: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
  ]
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.createOccasionSlider();
      this.createAtmospereSlider();
    }, 1)
  }

  createOccasionSlider() {
    $('.center').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    }).on('beforeChange', () => {
      console.log("change");
      this.selectIcon = 'far fa-heart';
      this.occasionOfTheVacation = '';
      console.log("occian of the vacation", this.occasionOfTheVacation)
    });
  }

  createAtmospereSlider() {
    $('.center1').not('.slick-initialized').slick({
      centerMode: true,
      centerPadding: '100px',
      slidesToShow: 1,
    }).on('beforeChange', () => {
      console.log("change----");
      this.selectAtmosphereIcon = 'far fa-heart';
      this.atmosphereOfTheVacation = '';
      console.log("occian of the vacation", this.occasionOfTheVacation)
    });
  }

  selectOccianOption(data) {
    console.log("index in occian", data);
    this.selectIcon = this.selectIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.occasionOfTheVacation = this.selectIcon === 'fas fa-heart' ? data.name : '';
    console.log("occian of the vacation", this.occasionOfTheVacation);
  }

  selectAtmospereOption(data) {
    console.log("index in occian", data);
    this.selectAtmosphereIcon = this.selectAtmosphereIcon === 'far fa-heart' ? 'fas fa-heart' : 'far fa-heart';
    this.atmosphereOfTheVacation = this.selectAtmosphereIcon === 'fas fa-heart' ? data.name : '';
    console.log("atomospere of the vacation", this.atmosphereOfTheVacation);
  }

  nextForm() {
    const obj = {
      occasion_of_the_vacation: this.occasionOfTheVacation,
      atmosphere_of_the_vacation: this.atmosphereOfTheVacation
    }
    let navigationExtras: NavigationExtras = {
      state: {
        data:JSON.stringify(obj)
      }
    }
    this.router.navigate(['/home/climate'], navigationExtras)
  }

  /**
   * Display Image Description
   * @param {String} data 
   */
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
