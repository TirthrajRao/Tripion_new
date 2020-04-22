import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
declare const $: any;

@Component({
  selector: 'app-travelling-zones',
  templateUrl: './travelling-zones.component.html',
  styleUrls: ['./travelling-zones.component.scss'],
})
export class TravellingZonesComponent implements OnInit {
  continentsList: any = []
  constructor() { }

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
          this.continentsList.push(listItem[0].textContent);
          console.log(this.continentsList)
        }
      });
    }, 10)

  }
  nextForm() {
    this.continentsList = _.uniq(this.continentsList);
    console.log("contrnant list", this.continentsList)
  }
}
