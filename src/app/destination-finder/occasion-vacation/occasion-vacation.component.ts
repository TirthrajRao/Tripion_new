import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-occasion-vacation',
  templateUrl: './occasion-vacation.component.html',
  styleUrls: ['./occasion-vacation.component.scss'],
})
export class OccasionVacationComponent implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  occasionOption = [
    {
      name: 'Marriage Proposal',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Bachelor/Bachelorette Party',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Honeymoon',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Aniversary',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Guys Getaway (mancation)',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Girlfriends Getaway',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Business Appraisal',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Babymoon',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Annual Holidays',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Festival Holidays',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'School/College Friends Reunion',
      url: 'assets/images/download.jpeg'
    },
    {
      name: 'Incentive Celebration',
      url: 'assets/images/download.jpeg'
    }
  ]
  constructor() { }

  ngOnInit() {
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

}
