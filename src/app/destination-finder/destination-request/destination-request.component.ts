import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AppComponent } from '../../app.component';
declare const $: any;
@Component({
  selector: 'app-destination-request',
  templateUrl: './destination-request.component.html',
  styleUrls: ['./destination-request.component.scss'],
})
export class DestinationRequestComponent implements OnInit {
  loading: Boolean = false;
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  destinationReq: any = []
  constructor(
    public router: Router,
    public _tripService: TripService,
    public appComponent: AppComponent,
  ) {
    this.getAllInquiry()
  }

  ngOnInit() { }

  getAllInquiry() {
    this.loading = true;
    const data = {
      id: this.curruntUser.id
    }
    this._tripService.allDestinationReq(data).subscribe((res: any) => {
      console.log("res", res);
      this.destinationReq = res.data;
      this.loading = false;

    }, err => {
      console.log("err", err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
    })
  }

  /**
   * Move to Details Page
   * @param {Object} data 
   */
  async getDetails(data) {
    console.log(data);
    if(data.status != "Pending"){
      $('.success_alert_box1').fadeIn().addClass('animate');
      $('.success_alert_box1').click(function () {
        $(this).hide().removeClass('animate');
      });
      $('.success_alert_box1 .alert_box_content').click(function (event) {
        event.stopPropagation();
      });
    }else{
      this.router.navigate(['/home/destination-detail/'+data.id])
    }
  

  }
}
