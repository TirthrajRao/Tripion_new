import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // @Input ('cname') componantName;
  @Input('cname') componantName: string;
  constructor() { }

  ngOnInit() {
    console.log(this.componantName)
  }

}
