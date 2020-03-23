import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-frequent-flyer-detail',
  templateUrl: './frequent-flyer-detail.component.html',
  styleUrls: ['./frequent-flyer-detail.component.scss'],
})
export class FrequentFlyerDetailComponent implements OnInit {
details:any;
  constructor(public _tripService: TripService,public route:ActivatedRoute,public router:Router) {
   this.getDetails();
  }

  ngOnInit() { }

  /**
   * Get Details Of single Response
   */
  getDetails() {
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state;
        console.log("in ffp detail page", this.details)
      }
  }
}
