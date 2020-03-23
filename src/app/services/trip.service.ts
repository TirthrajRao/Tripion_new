import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config '

@Injectable({
  providedIn: 'root'
})
export class TripService {
  // formData = JSON.parse(localStorage.getItem('form_data'));
  formData;
  constructor(private http: HttpClient) { }

  /**
   * Store form data
   * @param {object} data 
   */
  storeFormData(data) {
    console.log("formData", data);
    this.formData = JSON.parse(localStorage.getItem('form_data'));
    if (this.formData) {
      console.log(this.formData);
      const formRes = [];
      if (this.formData.length) {
        formRes.push(...this.formData, data);
      } else {
        formRes.push(this.formData, data)
      }
      console.log(formRes)
      localStorage.setItem('form_data', JSON.stringify(formRes))
    } else {
      localStorage.setItem("form_data", JSON.stringify(data));
    }
  }

  /**
   * Add safe to travel request
   * @param {Object} data 
   */
  addSafeToTravelReq(data) {
    return this.http.post(config.baseApiUrl + 'submit-form', data)
  }

  /**
   * Get safe travel response of requests
   * @param {object} data 
   */
  getSafeToTravelResponse(data) {
    return this.http.post(config.baseApiUrl + 'get-safe-travel', data)
  }

  /**
   * Get Form Category list
   */
  getFormCategoryList() {
    return this.http.get(config.baseApiUrl + 'form-category');
  }

  /**
   * Add Inquiry
   * @param {Object} data 
   */
  addInquiry(data) {
    console.log(data);
    return this.http.post(config.baseApiUrl + 'submit-form', data);
  }

  /**
   * Add FFP request
   * @param {Object} data 
   */
  addFFPRequest(data) {
    return this.http.post(config.baseApiUrl + 'add-flight', data)
  }

  /**
   * Get FFP responces
   * @param {Object} data 
   */
  getFfpResponse(data) {
    return this.http.post(config.baseApiUrl + 'get-flight', data)
  }

  /**
   * Get all trips
   * @param {object} data 
   */
  getAllTrips(data) {
    return this.http.post(config.baseApiUrl + 'home', data)
  }

  /**
   * Get Single Trip Details
   * @param {Object} data 
   */
  getSingleTripDetail(data) {
    return this.http.post(config.baseApiUrl + 'single-inquiry', data)
  }

  /**
   * Get Single Plan Details
   * @param {object} data 
   */
  getPlanDetail(data) {
    return this.http.post(config.baseApiUrl + 'single-plan', data)
  }

  /**
   * Get All Pllans Of trip
   * @param {Object} data 
   */
  getAllPlans(data) {
    return this.http.post(config.baseApiUrl + 'plans', data);
  }
  /**
   * Send Selected Plan
   * @param {object} data 
   */
  sendPlan(data){
    return this.http.post(config.baseApiUrl + 'book-plan', data);
  }
  /**
   * Get Trip Timeline
   * @param {Object} data 
   */
  getTripTimeline(data){
    return this.http.post(config.baseApiUrl + 'get-timeline', data)
  }

  /**
   * Get Timeline Day details
   * @param {Object} data 
   */
  getDayDetail(data){
    return this.http.post(config.baseApiUrl + 'timeline-detail', data)
  }

  /**
   * Get document request of inquiry
   * @param {Object} data 
   */
  getDocumentReq(data){
    return this.http.post(config.baseApiUrl + 'get-doc-request', data);
  }

  /**
   * Get Past trips
   * @param {object} data 
   */
  getPastTrip(data){
    return this.http.post(config.baseApiUrl + 'past-trip', data);
  }

  /**
   * Get Quotations of trip
   * @param {object} data 
   */
  getQuotations(data){
    return this.http.post(config.baseApiUrl + 'get-quotation', data);
  }

  /**
   * Add Passport Inquiry
   * @param {object} data 
   */
  addPassportForm(data){
    return this.http.post(config.baseApiUrl + 'submit-form', data);
  }
}