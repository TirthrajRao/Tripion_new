import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config ';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public http: HttpClient) { }

  /**
   * Get Chat
   * @param {Object} data 
   */
  getChat(data) {
    return this.http.post(config.baseApiUrl + 'get-chat', data)
  }


  /**
   * Add Message
   * @param {object} data 
   */
  addMessage(data) {
    return this.http.post(config.baseApiUrl + 'add-chat', data);
  }
}
