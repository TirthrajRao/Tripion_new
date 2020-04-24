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
  occasionOption = [
    {
      name: 'Marriage Proposal',
      url: 'assets/images/occian/1.jpeg'
    },
    {
      name: 'Bachelor/Bachelorette Party',
      url: 'assets/images/occian/2.jpeg'
    },
    {
      name: 'Honeymoon',
      url: 'assets/images/occian/3.jpeg'
    },
    {
      name: 'Family Reunion',
      url: 'assets/images/occian/4.jpeg'
    },
    {
      name: 'Aniversary',
      url: 'assets/images/occian/5.jpeg'
    },
    {
      name: 'Guys Getaway (mancation)',
      url: 'assets/images/occian/6.jpeg'
    },
    {
      name: 'Girlfriends Getaway',
      url: 'assets/images/occian/7.jpeg'
    },
    {
      name: 'Business Appraisal',
      url: 'assets/images/occian/8.jpeg'
    },
    {
      name: 'Babymoon',
      url: 'assets/images/occian/9.jpeg'
    },
    {
      name: 'Annual Holidays',
      url: 'assets/images/occian/10.jpeg'
    },
    {
      name: 'Festival Holidays',
      url: 'assets/images/occian/11.jpeg'
    },
    {
      name: 'School/College Friends Reunion',
      url: 'assets/images/occian/12.jpeg'
    },
    {
      name: 'Incentive Celebration',
      url: 'assets/images/occian/13.jpeg'
    }
  ];
  atmosphereOption = [
    {
      name: 'Relaxation',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Adventure/Lost To Do',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Romantic',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Cltural Immersion',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Historic Significance',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Leisure & Luxury',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Family Friendly',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Nightlife',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Nature Friendly',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Cozy & Lazy',
      url: 'assets/images/download.jpeg'
    },
  ]
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.createOccasionSlider();
      this.createAtmospereSlider();
    }, 100)
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

}
