import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { TripService } from '../services/trip.service';
import { UserService } from '../services/user.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-past-trips',
  templateUrl: './past-trips.component.html',
  styleUrls: ['./past-trips.component.scss'],
})
export class PastTripsComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  pastTrips: any = [];
  loading: Boolean = false;
  previousUrl: any;
  constructor(
    public _toastService: ToastService,
    public _tripService: TripService,
    public _userService: UserService,
    public appComponent: AppComponent,
  ) { }

  ngOnInit() {
    this.getPastTrips()
  }

  /**
   * Go back to previous page
   */
  goBack() {
    console.log("back")
    window.history.back();
  }
  /**
   * Get Past Trips
   */
  getPastTrips() {
    this.loading = true;
    const obj = {
      id: this.currentUser.id
    }
    this._tripService.getPastTrip(obj).subscribe((res: any) => {
      console.log("past trips", res)
      this.pastTrips = res.data;
      this.loading = false;
    }, (err) => {
      console.log(err);
      // this._toastService.presentToast(err.error.message, 'danger');
      this.appComponent.errorAlert();
      this.loading = false;
    })
  }
}
