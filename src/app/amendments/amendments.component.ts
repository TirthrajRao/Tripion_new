import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonContent, NavController, ModalController, Platform, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { S3Service } from '../services/s3.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { HTTP } from '@ionic-native/http/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {AppComponent} from '../app.component';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as firebase from 'firebase';

import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
declare var $: any;

@Component({
  selector: 'app-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss'],
})
export class AmendmentsComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;
  fileTransfer: FileTransferObject = this.transfer.create();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  messages: any = [];
  messageDateString: any;
  addMessageForm: FormGroup;
  refreshIntervalId: any;
  loading: Boolean = false;
  locationData: any;
  lat: any;
  lng: any
  height = 0;
  imgPreview: any;
  messagesList: any = []
  imageSet: Boolean = false;
  downloading: Boolean = false;
  files: any;
  urls: any;
  chatId: any;

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  timex: any;

  constructor(
    public _chatService: ChatService,
    public router: Router,
    public _userService: UserService,
    public _s3Service: S3Service,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public route: ActivatedRoute,
    public http: HTTP,
    public platform: Platform,
    private camera: Camera,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private photoViewer: PhotoViewer,
    private transfer: FileTransfer,
    private file: File,
    public _toastService: ToastService,
    private fileOpener: FileOpener,
    public sanitizer: DomSanitizer,
    private media: Media,
    private base64: Base64,
    private filesPath: FilePath,
    public appComponent:AppComponent,
    private mediaCapture: MediaCapture,
    ) {
    this.addMessageForm = new FormGroup({
      message: new FormControl('', Validators.required)
    })
    this.chatId = this.currentUser.chat_id;
    console.log(this.router.url)
    this.height = platform.height() - 56;
    this.getMessage();
    console.log("this.chatId", this.chatId)
  }

  // active(){
    //   console.log("active");
    // }

    // released(){
      //   console.log("release")
      // }

  /**
   * Get Messages
   */
   getMessage() {
     this.loading = true;
     firebase.database().ref('chat_data/' + this.chatId + '/message').on('value', resp => {
       console.log("res", resp)
       let tmp = [];
       resp.forEach(data => {
         tmp.push({
           key: data.key,
           message: data.val()
         })
       })
       this.messagesList = tmp;
       this.loading = false;
       console.log("message list", this.messagesList);

       // console.log("-------", this.messagesList[40].message.message.url)
       this.contentArea.scrollToBottom();
       setTimeout(() => {
         _.forEach(this.messagesList, (message) => {
           if (message.message.message_type == 'ifram') {
             const newUrl = message.message.msg.location.replace(/\\/g, "");
             console.log("new url", $('#' + message.key))
             $('#' + message.key).append(newUrl)
           }
         })
       }, 2000)

     });
   }



  /**
   * check messege get or not
   */
   ionViewWillEnter() {
     console.log("in enter");
     console.log("======params======", this.route.snapshot.queryParams)
     this._userService.getMessagesToAmmendments().subscribe(response => {
       console.log("messages response=============>", response)
     })
     if (this.route.snapshot.queryParams) {
       this.locationData = this.route.snapshot.queryParams;
       console.log("location data in ammendments", this.locationData);
       if (this.locationData.place_id) {
         this.getLatLng(this.locationData.place_id);
       } else if (Object.keys(this.locationData).length) {
         console.log("this.locationdata", this.locationData)
         this.sendLocation(this.locationData)
       } else if (this.locationData.url) {
         console.log("this.locationdata", this.locationData)
         this.sendLocation(this.locationData)
       }
     }
     // if (this.route.queryParams) {
       //   this.route.queryParams.subscribe((param) => {
         //     console.log("param", param)
         //     this.locationData = param
         //     console.log("location data in ammendments", this.locationData);
         //     if (this.locationData.place_id) {
           //       this.getLatLng(this.locationData.place_id);
           //     } else if (Object.keys(this.locationData).length) {
             //       console.log("this.locationdata", this.locationData)
             //       this.sendLocation(this.locationData)
             //     }
             //   })
             // }
           }



           ngOnInit() {
             // Open Footer
             $(document).ready(function () {
               $("#open_attachment").click(function () {
                 $(".attechments").slideToggle();
               });
               // $(".attach_img").click(function () {
                 //   $(".attechments").slideToggle();
                 // })
               });
           }

  /**
   * Pull to refresh
   * @param {object} event
   */
   doRefresh(event) {
     console.log('Begin async operation');
     setTimeout(() => {
       event.target.complete();
     }, 2000);
     this.getMessage();
   }

  /**
   * check Message created date
   * @param {Number} messageIndex
   */
   isDifferentDay(messageIndex: number): boolean {
     if (messageIndex === 0) return true;
     const d1 = new Date(this.messagesList[messageIndex - 1].message.date);
     const d2 = new Date(this.messagesList[messageIndex].message.date);

     return (
       d1.getFullYear() !== d2.getFullYear() ||
       d1.getMonth() !== d2.getMonth() ||
       d1.getDate() !== d2.getDate()
       );
   }

  /**
   * Group Message by Created date
   * @param {Number} messageIndex
   */
   getMessageDate(messageIndex: number): string {
     // let dateToday = new Date().toDateString();
     // let longDateYesterday = new Date();
     // longDateYesterday.setDate(new Date().getDate() - 1);
     // let dateYesterday = longDateYesterday.toDateString();
     // let today = dateToday.slice(0, dateToday.length - 5);
     // let yesterday = dateYesterday.slice(0, dateToday.length - 5);

     // const wholeDate = new Date(
     //   this.messagesList[messageIndex].message.date
     // ).toDateString();

     // this.messageDateString = wholeDate.slice(0, wholeDate.length - 5);
     // if (
     //   new Date(this.messagesList[messageIndex].message.date).getFullYear() ===
     //   new Date().getFullYear()
     // ) {
       //   if (this.messageDateString === today) {
         //     return "Today";
         //   } else if (this.messageDateString === yesterday) {
           //     return "Yesterday";
           //   } else {
             //     // console.log("message string", this.messageDateString)
             //     return this.messageDateString;
             //   }
             // } else {
               //   return wholeDate;
               // }

               var fromNow = moment(this.messagesList[messageIndex].message.date).fromNow();

               return moment(this.messagesList[messageIndex].message.date).calendar(null, {

                 lastDay: '[Yesterday]',
                 sameDay: '[Today]',

                 sameElse: function () {
                   return "[" + fromNow + "]";
                 }
               });


             }

             changeDateFormate(date) {
               return moment(date).format('dddd ,h:mm a')
             }

  /**
   * rdirect to location page
   */
   async launchLocationPage() {
     console.log("=====in location modal open====");
     this.router.navigate(['/home/location'])
   }

  /**
   * Get Place information using placeid
   * @param {string} placeId
   */
   getLatLng(placeId) {
     console.log("placeId========>", placeId);
     // this.http.get('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + placeId + '&key=AIzaSyAHyK08CHb5PEfGHwUc34x-Lnp86YsODGg', {}, {})
     this.http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&key=AIzaSyAHyK08CHb5PEfGHwUc34x-Lnp86YsODGg', {}, {})
     .then(data => {
       console.log("res", data.status, JSON.parse(data.data));
       this.lat = JSON.parse(data.data).result.geometry.location.lat
       this.lng = JSON.parse(data.data).result.geometry.location.lng
       console.log("lat and lng", this.lat, this.lng);
       const obj = {
         lat: this.lat,
         lon: this.lng,
         name: JSON.parse(data.data).result.name
       }
       console.log("=======", obj);
       const messageData = {
         message: obj
       }
       this.send(messageData, 'latlon')
       console.log("this.messages", this.messages)
     })
     .catch(error => {
       console.log("err", error.status);
       console.log("err", error.error); // error message as string
       console.log("err", error.headers);

     });

   }

  /**
   * Open map
   * @param {number} lat
   * @param {number} lng
   * @param {string} name
   */
   openMap(lat, lng, name) {
     let destination = lat + ',' + lng;
     console.log("destination", destination, name)
     if (this.platform.is('ios')) {
       window.open('maps://?q=' + destination, '_system');
     } else {
       let label = encodeURI('My Label');
       window.open('geo:0,0?q=' + destination + '(' + name + ')', '_system');
     }
   }

  /**
   * Send Location
   * @param {object} data
   */
   sendLocation(data) {
     console.log("location data", data);
     const obj = {
       lat: data.lat,
       lon: data.lng,
       name: data.name
     }
     console.log("obj", obj)
     const messageData = {
       message: obj,
     }
     console.log("messagedata", messageData)
     this.send(messageData, 'latlon');
     console.log("this.messages", this.messages)
   }


  /**
   * Send Message
   * @param {object} data
   */
   send(data, type) {
     console.log("send message", data, type, data.message);
     if (data.message.type)
       delete data.message.type
     // data.delete.message.type;
     if (!data.message) {
       alert("Enter Message Text")
       return
     }
     var date = new Date();
     var formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
     console.log("date", formattedDate)

     let joinData = firebase.database().ref('chat_data/' + this.chatId + '/message').push();
     joinData.set({
       date: formattedDate,
       is_read: 0,
       message_type: type,
       msg: data.message,
       user_id: 1,
       sender_id: this.currentUser.id
     });
     this.addMessageForm.reset();
   }


  /**
   * Upload image
   */
   async getPhoto(type) {

     const alert = await this.alertCtrl.create({
       // title: 'Profile Picture',
       message: 'From where do you want to choose your item pic?',
       buttons: [
       {
         text: 'Cancel',
         handler: data => { }
       },
       {
         text: 'Choose from gallery',
         handler: () => {
           // Call imageProvider to process, upload, and update user photo.
           this._s3Service.setProfilePhoto('', this.camera.PictureSourceType.PHOTOLIBRARY, type).then(data => {
             console.log("response from gallary", data)
             this.imgPreview = data;
             this.openModal(this.imgPreview)
             // $("#display-image").fadeIn();
             this.imageSet = true;
           });
         }
       },
       {
         text: 'Take my photo',
         handler: () => {
           // Call imageProvider to process, upload, and update user photo.
           this._s3Service.setProfilePhoto('', this.camera.PictureSourceType.CAMERA, type).then(data => {
             console.log("response", data)
             this.imgPreview = data;
             this.openModal(this.imgPreview)
             this.imageSet = true;
           });
         }
       }
       ]
     })
     await alert.present();
   }

  /**
  *Open Modal
  */
  async openModal(imgPath, type?) {
    console.log("path", imgPath, type);
    // this.router.navigate(['/home/send-image'],{queryParams:{path:imgPath}})
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        'image': imgPath,
        'fileObject': this.files,
        'type': type
      }
    });

    modal.onDidDismiss()
    .then((data) => {
      console.log("data", data)
      const imageData = data.data;
      console.log("user====>", imageData.data); // Here's your selected imagedata!
      const messageData = {
        message: imageData.data,
      }
      this.send(messageData, messageData.message.type)
    });
    return await modal.present();
  }

  /**
   * Preview Image
   * @param {object} data
   */
   previewImage(data) {
     console.log("data", data)
     this.photoViewer.show(data.url)
   }

  /**
   * Download File
   * @param {object} data
   */
   downloadImage(data) {
     console.log("download", data);
     this.downloading = true;
     const ROOT_DIRECTORY = 'file:///sdcard//';
     const downloadFolderName = 'Download/';

     this.file.checkFile(ROOT_DIRECTORY + downloadFolderName, data.name + '.' + data.ext).then((isExist) => {
       this.openFile(ROOT_DIRECTORY + downloadFolderName + data.name + '.' + data.ext, data.mimeType);
     }).catch((notexist) => {

       console.log("nonexist")
       //create dir
       this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
       .then((entries) => {
         //Download file
         this._toastService.presentToast("Downloading.....", 'success')
         this.fileTransfer.download(data.url, ROOT_DIRECTORY + downloadFolderName + '/' + data.name + '.' + data.ext).then((entry) => {
           this.downloading = false;
           console.log('download complete: ' + entry.toURL());
           this._toastService.presentToast("Download Completed", 'success');
           this.openFile(entry.nativeURL, data.mimeType);
         }, (error) => {
           console.log("error", error);
           this._toastService.presentToast('Error in dowloading', 'danger');
         })
       }).catch((error) => {
         console.log("erorr", error);
         this._toastService.presentToast('Error in dowloading', 'danger')
       });
     })
   }

  /**
   * Open File
   */
   openFile(url, mimeType) {
     console.log(url);
     this.fileOpener.showOpenWithDialog(url, mimeType)
     .then(() => console.log('File is opened'))
     .catch(e => console.log('Error opening file', e));

   }

   selectFile(e, type) {
     console.log("file data", e.target.files);
     this.files = e.target.files;
     let reader = new FileReader();
     reader.readAsDataURL(this.files[0]);
     reader.onload = (_event) => {
       this.urls = reader.result

       console.log("url", this.urls)
       if (this.urls && type != 'file') {
         this.openModal(this.urls, type)
       } else if (this.urls && type == 'file') {
         console.log("file type");
         this._s3Service.uploadImage(this.urls, this.files[0].name, 'file', this.files[0]).then((res) => {
           console.log("Response", res);
           const messageData: any = {
             message: res,
           }
           this.send(messageData, messageData.message.type)
         }).catch((err) => {
           console.log("Error is", err);
this.appComponent.errorAlert()
           // this._toastService.presentToast("Internal server error", 'danger')
         })
       }
     }
   }



   startRecord() {
     console.log("startRecord");
     console.log("this.file", this.file)
     const ROOT_DIRECTORY = this.file.externalRootDirectory;
     console.log("directory",ROOT_DIRECTORY)
     // const downloadFolderName = 'Download/';
     // this.mediaCapture.captureAudio().then(res => {
       //   console.log("audio file",res)
       //   // this.storeMediaFiles(res);
       // }, (err: CaptureError) => console.error('err',err));
       // if (this.platform.is('ios')) {
         //   this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
         //   this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
         //   this.audio = this.media.create(this.filePath);
         // } else if (this.platform.is('android')) {
           //   this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
           //  console.log("this.filename",this.fileName)
           //   this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
           //   console.log("this.filename",this.filePath)
           //   this.audio = this.media.create(this.filePath);
           //   console.log("this.audio",this.audio)
           // }
           this.recording = true;
           this.startTimer();
           this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.mp3';
           console.log("this.filename", this.fileName)
           this.filePath = ROOT_DIRECTORY + this.fileName;
           console.log("this.filename", this.filePath)
           this.audio = this.media.create(this.filePath);
           this.audio.startRecord();
         }

         async stopRecord() {
           await clearInterval(this.timex);
           this.recording = false;
           console.log("this.audio", this.audio);
           this.audio.stopRecord();

           this.audio.play();
           this.audio.setVolume(0.8);

           let duration = this.audio.getDuration();
           console.log("duration", duration);
           // let reader = new FileReader();
           // reader.readAsDataURL(this.filePath);
           // reader.onload = (_event) => {
             //   this.urls = reader.result
             // }
             //   console.log("url", this.urls)
             let data = { name: this.fileName, src: this.filePath, type: 'audio/mp3' };
             console.log("recorded audio", data);


             // var getFileBlob = function (url, cb) {
               //   var xhr = new XMLHttpRequest();
               //   xhr.open("GET", url);
               //   xhr.responseType = "blob";
               //   xhr.addEventListener('load', function () {
                 //     cb(xhr.response);
                 //   });
                 //   xhr.send();
                 // };

                 // var blobToFile = function (blob, name) {
                   //   blob.lastModifiedDate = new Date();
                   //   blob.name = name;
                   //   return blob;
                   // };

                   // var getFileObject = function (filePathOrUrl, cb) {
                     //   getFileBlob(filePathOrUrl, function (blob) {
                       //     cb(blobToFile(blob, this.fileName));
                       //   });
                       // };

                       // getFileObject(this.filePath, function (fileObject) {
                         //   console.log("fileobject", fileObject);
                         // });



                         // this.file.readAsArrayBuffer('file:///sdcard//', this.fileName).then((res) => {
                           //   console.log("res===>", res)
                           //   try {
                             //     let blob = new Blob([res], { type: "audio/mp3" });
                             //     console.log("blob=====", blob)
                             //   } catch (z) {
                               //     console.log("errrrr", z)
                               //     // alert('error al crear blob' + z);
                               //   }
                               // }).catch(err => alert('error al leer el archivo ' + JSON.stringify(err)));


                               this.base64.encodeFile(data.src).then((base64File: string) => {
                                 // console.log("base64file", base64File);
                                 var x = base64File.substr(13, base64File.length);
                                 x = "data:audio/mp3;base64" + x;
                                 console.log("x---------------", x);
                                 this._s3Service.uploadImage(data.src, data.name, 'audio', x).then((res) => {
                                   console.log("Response", res);
                                   const messageData: any = {
                                     message: res,
                                   }
                                   console.log("messge response=====>", messageData)
                                   this.send(messageData, messageData.message.type)
                                 }).catch((err) => {
                                   console.log("Error is", err);
                                   this.appComponent.errorAlert()
                                   // this._toastService.presentToast("Internal server error", 'danger')
                                 })

                                 // }, (err) => {
                                   //   console.log(err);
                                   // });

                                   // this._s3Service.uploadImage('', data.name, 'audio', data).then((res) => {
                                     //   console.log("Response", res);
                                     //   const messageData: any = {
                                       //     message: res,
                                       //   }
                                       //   console.log("messge response=====>",messageData)
                                       //   // this.send(messageData, messageData.message.type)
                                       // }).catch((err) => {
                                         //   console.log("Error is", err);
                                         //   this._toastService.presentToast("Internal server error", 'danger')
                                       })




                             }

                             startTimer() {
                               var hours = 0;
                               var mins = 0;
                               var seconds = 0;

                               this.timex = setInterval(() => {
                                 seconds++;
                                 console.log("=====", seconds)
                                 if (seconds > 59) {
                                   seconds = 0; mins++;
                                   if (mins > 59) {
                                     mins = 0; hours++;
                                     if (hours < 10) { $("#hours").text('0' + hours + ':') } else $("#hours").text(hours + ':');
                                   }

                                   if (mins < 10) {
                                     $("#mins").text('0' + mins + ':');
                                   }
                                   else $("#mins").text(mins + ':');
                                 }
                                 if (seconds < 10) {
                                   console.log("seconds", '0' + seconds)
                                   $("#seconds").text('0' + seconds);
                                 } else {
                                   $("#seconds").text(seconds);
                                 }

                                 // this.startTimer();
                                 console.log("timer", $("#seconds").text(seconds).val())
                               }, 1000);

                             }
                           }