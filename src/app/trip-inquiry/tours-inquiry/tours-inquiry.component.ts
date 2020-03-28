import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { data } from '../../data'
@Component({
  selector: 'app-tours-inquiry',
  templateUrl: './tours-inquiry.component.html',
  styleUrls: ['./tours-inquiry.component.scss'],
})
export class ToursInquiryComponent implements OnInit {
  formUrl: any;
  tourForm: FormGroup;
  submitted: Boolean = false;
  status: any = 'Releaxed';
  path = 'assets/images/03-Gif.gif';
  languages = data.language;
  // formData = JSON.parse(localStorage.getItem('form_data'));

  constructor(public route: Router, public _tripService: TripService) {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    // this.formUrl.splice(0, 1);
    // localStorage.setItem('formId', JSON.stringify(this.formUrl));

    this.tourForm = new FormGroup({
      tour_basis: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      special_request: new FormControl(''),
      itinerary_pace: new FormControl('0')
    })
  }

  ngOnInit() {
    this.changeStatusBarColor()
  }
  get f() { return this.tourForm.controls; }
  /**
   * status bar color change
   */
  changeStatusBarColor() {
    const colorStopMap = {
      pink: 0,
      blue: 2,
      red: 4,
      green: 6
    };
    let gradientRange = document.querySelector(".gradient-range");
    gradientRange.classList.add(Object.entries(colorStopMap)[0][0]);
    gradientRange.addEventListener("input", () => {
      for (const colorStop of Object.entries(colorStopMap)) {
        let [colorClass, colorStopValue] = colorStop;
        if (Number((gradientRange as HTMLInputElement).value) >= colorStopValue) {
          gradientRange.classList.add(colorClass);
        } else {
          gradientRange.classList.remove(colorClass);
        }
      }
    });
  }

  /**
   * Open Next Form
   * @param {Object} data 
   */
  nextForm(data) {
    this.submitted = true;
    if (this.tourForm.invalid) {
      return
    }
    this.checkLocalStorageData();
    console.log(data);
    if (data.itinerary_pace >= 0 && data.itinerary_pace <= 4) {
      console.log("relaxed")
      data.itinerary_pace = 'Relaxed'
    } else if (data.itinerary_pace > 4 && data.itinerary_pace <= 7) {
      console.log("avarage")
      data.itinerary_pace = 'Avarage';
    } else if (data.itinerary_pace > 7) {
      console.log("busy");
      data.itinerary_pace = 'Busy';
    }
    this.storeFormData(data)
    this.route.navigate(['/home/' + this.formUrl[0]])
  }

  // Store form data
  storeFormData(data) {
    const obj = {
      "tours": data
    }
    this._tripService.storeFormData(obj);
  }

  /**
   * Change status and image of Itinerary
   * @param {object} e 
   */
  changeStatus(e) {
    console.log(e.target.value)
    if (e.target.value >= 0 && e.target.value <= 4) {
      this.status = "Releaxed"
      this.path = '../../../assets/images/03-Gif.gif';
    } else if (e.target.value > 4 && e.target.value <= 7) {
      this.status = "Average";
      this.path = '../../../assets/images/01-Gif.gif';
    } else if (e.target.value > 7) {
      this.status = "Busy"
      this.path = '../../../assets/images/02.gif'
    }
  }


  /**
   * Check and store data in local storage
   */
  checkLocalStorageData() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    if (this.formUrl[0] == 'tours') {
      this.formUrl.splice(0, 1);
      localStorage.setItem('formId', JSON.stringify(this.formUrl));
    }
    console.log("local storage form data", JSON.parse(localStorage.getItem('form_data')));
    const localStorageFormData = JSON.parse(localStorage.getItem('form_data'))
    let index;
    if (localStorageFormData.length) {
      let result;
      localStorageFormData.some((o, i) => {
        console.log(i, o);
        if (o.tours) {
          result = true
          index = i;
        }
      })
      console.log("result====>", result, index);
      if (result) {
        localStorageFormData.splice(index, 1)
      }
      console.log("index of tours in localstorage", localStorageFormData);
      // if (localStorageFormData.length) {
      localStorage.setItem('form_data', JSON.stringify(localStorageFormData))
      // }
    }
  }

}
