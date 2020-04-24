import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-destination-detail',
  templateUrl: './destination-detail.component.html',
  styleUrls: ['./destination-detail.component.scss'],
})
export class DestinationDetailComponent implements OnInit {
  destinationId: any;
  loading: Boolean = false;
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  details:any
  constructor(
    public route: ActivatedRoute,
    public _tripService:TripService,
    public appComponent:AppComponent
  ) {
    this.route.params.subscribe((param) => {
      this.destinationId = param.id
    })
  }

  ngOnInit() { 
    this.getDestinationDetail();
  }
  
  getDestinationDetail(){
    this.loading = true;
    const obj = {
      id:this.curruntUser.id,
      destination_id:this.destinationId
    }
    console.log("obj",obj)
    this._tripService.getDestinationReqDetail(obj).subscribe((res:any)=>{
      console.log("res===>",res);
      this.details = res.data;
      this.loading = false;
    },err=>{
      console.log("err",err);
      this.loading = false;
      this.appComponent.errorAlert(err.error.message)
    })
  }
}
