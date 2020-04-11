import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { config } from '../config ';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(public http: HttpClient) { }

  /**
   * Upload documents
   * @param {object} data 
   */
  uploadDocuments(data) {
    return this.http.post(config.baseApiUrl + 'add-image', data)
  }

  /**
   * Get all images of user documents
   * @param {object} data 
   */
  getAllImages(data){
    return this.http.post(config.baseApiUrl + 'get-brifcase', data)
  }

  /**
   * Add Passport
   * @param {Object} data 
   */
  addPassport(data){
    return this.http.post(config.baseApiUrl + 'add-passport', data)
  }

  /**
   * Get Passport
   * @param {Object} data 
   */
  getPassport(data){
    return this.http.post(config.baseApiUrl + 'get-passport', data)
  }

  /**
   * Get Single Passport Detail
   * @param {object} data 
   */
  getSinglePassport(data){
    return this.http.post(config.baseApiUrl + 'get-single-passport', data)
  }
  /**
   * Send Document to admin
   * @param {object} data 
   */
  sendDocument(data){
    return this.http.post(config.baseApiUrl + 'upload-doc', data)
  }

  /**
   * Get All Passport of loggedin user
   * @param {object} data 
   */
  getFolderData(data){
    return this.http.post(config.baseApiUrl + 'get-image', data)
  }

  /**
   * Edit Passport Details
   * @param {Object} data 
   */
  editPassportDetail(data){
    return this.http.post(config.baseApiUrl + 'edit-passport', data)
  }

  /**
   * Create Folder
   * @param {object} data 
   */
  createFolder(data){
    return this.http.post(config.baseApiUrl + 'add-folder', data)
  }
 
  /**
   * Get Folder data and all folder name
   * @param {object} data 
   */
  getAllFolder(data){
    return this.http.post(config.baseApiUrl + 'get-all-folders', data)
  }

  /**
   * Remove Image
   * @param {object} data 
   */
  removeImage(data){
    return this.http.post(config.baseApiUrl + 'delete-image', data)
  }

  /**
   * Add Visa
   * @param {object} data 
   */
  addVisa(data){
    return this.http.post(config.baseApiUrl + 'add-visa', data);
  }

  /**
   * Get 
   * @param {object} data 
   */
  getVisa(data){
    return this.http.post(config.baseApiUrl + 'get-visa', data);
  }

  /**
   * Get Single Visa Detail
   * @param {object} data 
   */
  getSingleVisa(data){
    return this.http.post(config.baseApiUrl + 'get-single-visa', data);
  }

  /**
   * Edit visa
   * @param {object} data 
   */
  editVisaDetail(data){
    return this.http.post(config.baseApiUrl + 'edit-visa', data);
  }
}
