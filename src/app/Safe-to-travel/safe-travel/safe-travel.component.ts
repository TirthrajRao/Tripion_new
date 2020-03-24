import { Component, OnInit } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { Router, NavigationExtras ,ActivatedRoute} from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../../app.component';
declare const $:any
@Component({
  selector: 'app-safe-travel',
  templateUrl: './safe-travel.component.html',
  styleUrls: ['./safe-travel.component.scss'],
})
export class SafeTravelComponent implements OnInit {
  curruntUser = JSON.parse(localStorage.getItem('currentUser'));
  safeToTravelRes: any = []
  loading: Boolean = false;
  details:any;
  constructor(
    public _tripServive: TripService, 
    public router: Router,
    public _toastService: ToastService,
    public route:ActivatedRoute,
    public alertController:AlertController,
    public appComponent: AppComponent,
    ) {
    this.getSafeToTravelResponse();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state;
        console.log("in safe to travel page page", this.details);
        this.safeToTravelRes.push(this.details)
      }
    });
  }

  ngOnInit() { 

  }
  ionViewWillEnter(){
    console.log("in enter")
  }

  /**
   * Pull to refresh
   * @param {object} event 
   */
   doRefresh(event) {
     console.log('Begin async operation');
     this.getSafeToTravelResponse();
     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }

  /**
   * Get safe to travel response
   */
   getSafeToTravelResponse() {
     this.loading = true;
     const obj = {
       id: this.curruntUser.id
     }
     this._tripServive.getSafeToTravelResponse(obj).subscribe((res: any) => {
       console.log("get all res", res);
       this.safeToTravelRes = res.data;
       this.loading = false;
     }, (err) => {
       console.log("err", err);
       // this._toastService.presentToast(err.error.message, 'danger');
       this.appComponent.errorAlert();
       this.loading = false;
     })
   }

  /**
   * Move to Details Page
   * @param {Object} data 
   */
   async getDetails(data) {
     console.log(data);
     if(data.safe_to_response){
       let navigationExtras: NavigationExtras = {
         state: {
           detail: data.safe_to_response,
           pdfUrl: data.safe_to_pdf,
           name: data.safe_to_travel,
         }
       };
       this.router.navigate(['/home/safe-travel-detail'], navigationExtras);
     }else{
       $('.success_alert_box1').fadeIn().addClass('animate');
       $('.success_alert_box1').click(function(){
        $(this).hide().removeClass('animate');
      });
      $('.success_alert_box1 .alert_box_content').click(function(event){
        event.stopPropagation();
      });
      //  setTimeout(()=>{
      //    $('.success_alert_box1').hide().removeClass('animate');
      //  },2500)
       
       }

     }
   }
