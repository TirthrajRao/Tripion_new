import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-service-inquiry',
  templateUrl: './service-inquiry.component.html',
  styleUrls: ['./service-inquiry.component.scss'],
})
export class ServiceInquiryComponent implements OnInit {
  checkBoxValue: any = [];
  tripServices: any = [];
  generalServices: any = [];
  categoryList = JSON.parse(localStorage.getItem('categoryList'));
  selectedFormCategory: any = [];
  otherServices: any = [];
  selectedForm: any;
  constructor(
    public route: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    console.log("category List", this.categoryList);
  }

  ionViewWillEnter() {
    console.log("enter in service list");
    localStorage.setItem('form_data', JSON.stringify(''));
    localStorage.setItem('selectedFormCategory', JSON.stringify(''));
  }

  /**
   *  open next form function
   */
  nextForm() {
    this.selectForm();
    this.checkSelectedForm();
  }

  // select id from checkbox 
  async selectForm() {
    let services = []
    services.push(...this.tripServices, ...this.otherServices)
    console.log("this.tripService", services, this.tripServices)
    if (services.length)
      if (services.length < 3) {
        const alert = await this.alertController.create({
          subHeader: 'Trip Inquiry',
          message: 'you have to select atleast three service',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }




    this.checkBoxValue = this.generalServices.concat(this.tripServices);
    this.selectedForm = services.concat(this.generalServices);
    console.log("selected form---------------------------------", this.selectedForm)
    // this.checkBoxValue = this.checkBoxValue.concat(this.otherServices);
    this.storeSelectedFormCategory();
    if (this.checkBoxValue.length > 1) {
      // this.checkBoxValue.unshift('general-detail');
      this.checkBoxValue.push('other-details');
      this.selectedForm.unshift('general-detail')
      this.selectedForm.push('other-details')
      if (this.checkBoxValue.includes('passport')) {
        console.log("passport selected");
        let index = this.checkBoxValue.indexOf('passport')
        console.log("index", index)
        let cutOut = this.checkBoxValue.splice(index, 1)[0];
        console.log("cutout", cutOut)// cut the element at index 'from'
        this.checkBoxValue.splice(0, 0, cutOut);
      }
      console.log("this ==>", this.checkBoxValue, this.generalServices, this.selectedFormCategory);
      localStorage.setItem('formId', JSON.stringify(this.checkBoxValue));
      localStorage.setItem('selectedForm', JSON.stringify(this.selectedForm))
      localStorage.setItem('selectedFormCategory', JSON.stringify(this.selectedFormCategory))
      console.log("--------------")
      const formRoute = this.checkBoxValue[0];
      if (this.checkBoxValue.length) {
        console.log("---i if", this.tripServices, this.generalServices)
        this.route.navigate(['/home/' + formRoute])
      }
    } else if (this.checkBoxValue.length == 1) {
      console.log("one");
      let formRoute;
      if (!this.checkBoxValue.includes('passport')) {
        console.log("not passport");
        // this.checkBoxValue.unshift('general-detail');
        this.checkBoxValue.push('other-details');
        this.selectedForm.unshift('general-detail')
        this.selectedForm.push('other-details')
        formRoute = this.checkBoxValue[0];
        localStorage.setItem('formId', JSON.stringify(this.checkBoxValue));
        localStorage.setItem('selectedForm', JSON.stringify(this.selectedForm));
        localStorage.setItem('selectedFormCategory', JSON.stringify(this.selectedFormCategory))
        this.route.navigate(['/home/' + formRoute])
      } else {
        formRoute = this.checkBoxValue[0]
        localStorage.setItem('formId', JSON.stringify(this.checkBoxValue));
        localStorage.setItem('selectedForm', JSON.stringify(this.selectedForm))
        localStorage.setItem('selectedFormCategory', JSON.stringify(this.selectedFormCategory))
        this.route.navigate(['/home/' + formRoute])
      }
    } else if (this.otherServices.length) {
      console.log("in othet", this.otherServices.length)
      let formRoute;
      // this.checkBoxValue = this.checkBoxValue.concat(this.otherServices);
      // this.checkBoxValue.unshift('general-detail');
      // formRoute = this.checkBoxValue[0]
      // localStorage.setItem('formId', JSON.stringify(this.checkBoxValue));
      localStorage.setItem('selectedFormCategory', JSON.stringify(this.selectedFormCategory));
      localStorage.setItem('selectedForm', JSON.stringify(this.selectedForm));
      this.route.navigate(['/home/general-detail'])
    } else {
      alert('Please select services')
    }


  }

  /**
   * store selected form category
   */
  storeSelectedFormCategory() {
    this.selectedFormCategory = []
    console.log("===================", this.generalServices, this.otherServices)
    _.forEach(this.categoryList, (category) => {
      _.forEach(this.generalServices, (service) => {
        if (service == category.slug) {
          this.selectedFormCategory.push(category.id)
        }
      })
    })
    _.forEach(this.categoryList, (category) => {
      _.forEach(this.otherServices, (service) => {
        if (service == category.slug) {
          this.selectedFormCategory.push(category.id)
        }
      })
    })
    if (this.tripServices.length) {
      localStorage.setItem('isTripInquiry', 'true');
      _.forEach(this.categoryList, (category) => {
        _.forEach(this.tripServices, (service) => {
          if (service == category.slug) {
            this.selectedFormCategory.push(category.id);
          }
        })
      })
    } else {
      localStorage.setItem('isTripInquiry', 'false')
    }
    console.log(this.selectedFormCategory)
  }

  /**
   * Select Trip Services
   * @param {object} data 
   */
  selectTripServices(data) {
    console.log("data==>", data);
    if (!this.tripServices.includes(data)) {
      this.tripServices.push(data)
    } else {
      var index = this.tripServices.indexOf(data);
      console.log("index", index);
      this.tripServices.splice(index, 1);
    }
    console.log("tripServices", this.tripServices);
  }

  /**
   * Select General Service
   * @param {object} data 
   */
  selectGeneralService(data) {
    console.log("data==>", data);
    if (!this.generalServices.includes(data)) {
      this.generalServices.push(data)
    } else {
      var index = this.generalServices.indexOf(data);
      console.log("index", index);
      this.generalServices.splice(index, 1);
    }
    console.log("generalServices", this.generalServices);
  }

  /**
   * Select other Service
   * @param {object} data 
   */
  selectOtherServices(data) {
    console.log("data==>", data);
    if (!this.otherServices.includes(data)) {
      this.otherServices.push(data)
    } else {
      var index = this.otherServices.indexOf(data);
      console.log("index", index);
      this.otherServices.splice(index, 1);
    }
    console.log("otherServices", this.otherServices);
  }

  /**
   * Check only air tickit form selected
   */
  checkSelectedForm() {
    const formValue = JSON.parse(localStorage.getItem('formId'));
    if (formValue.length == 1) {
      if (formValue[0] == 'air-tickets') {
        console.log("in if")
        localStorage.setItem("selectOnlyAirTickits", 'true')
      }
    } else {
      localStorage.setItem("selectOnlyAirTickits", 'false')
    }
  }


}
