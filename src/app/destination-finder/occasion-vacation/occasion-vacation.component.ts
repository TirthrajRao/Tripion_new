import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {}

}
