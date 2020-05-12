import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from 'src/app/services/toast.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppComponent } from '../../app.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Platform } from '@ionic/angular';
import { Base64 } from '@ionic-native/base64/ngx';

import * as  htmlToPdfmake from 'html-to-pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-plan-option-detail',
  templateUrl: './plan-option-detail.component.html',
  styleUrls: ['./plan-option-detail.component.scss'],
})
export class PlanOptionDetailComponent implements OnInit {
  planId;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  fileTransfer: FileTransferObject = this.transfer.create();
  loading: Boolean = false;
  planDetail;
  logoImage: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  pdfObj = null;
  isDisable: Boolean = false;
  constructor(
    public route: ActivatedRoute,
    public _tripService: TripService,
    public _toastService: ToastService,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    public appComponent: AppComponent,
    public plt: Platform,
    private base64: Base64
  ) {
    this.route.params.subscribe((params) => {
      this.planId = params.id;
    });
  }

  ngOnInit() {
    console.log("plan id", this.planId);
    this.getPlanDetail(this.planId);

    this.readImage('assets/images/logo.png', (base64) => {
      this.logoImage = base64
      // console.info(base64, this.logoImage);
    });

  }

  /**
   * Convert logo image to base 64
   */
  readImage(url, callback) {
    var request = new
      XMLHttpRequest(); request.onload = function () {
        var file = new FileReader();
        file.onloadend = function () {
          callback(file.result);
        }
        file.readAsDataURL(request.response);
      };
    request.open('GET', url);
    request.responseType = 'blob';
    request.send();
  }

  /**
   * Pull to refresh
   * @param {object} event 
   */
  doRefresh(event) {
    console.log('Begin async operation');
    this.getPlanDetail(this.planId);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  /**
   * Get Single Plan Detail
   * @param {Number} id 
   */
  getPlanDetail(id) {
    this.loading = true;
    const data = {
      plan_id: id,
      id: this.currentUser.id
    }
    this._tripService.getPlanDetail(data).subscribe((res: any) => {
      console.log("plan detail", res);
      this.planDetail = res.data;
      this.loading = false;

      if ($('.plan_images').hasClass('slick-initialized'))
        $('.plan_images').slick('unslick');
      setTimeout(() => {
        this.createSlider();
      }, 1)
    }, (err) => {
      this.appComponent.errorAlert(err.error.message);
      console.log(err);
      this.loading = false;
    })
  }
  createSlider() {
    $('.plan_images').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true
    });
  }

  /**
 * Doenload report
 */
  downloadPdf(url, name, mimeType) {
    console.log("===enter====", name)
    // this.downloading = true;
    const ROOT_DIRECTORY = 'file:///sdcard//';
    const downloadFolderName = 'Download/';

    this.file.checkFile(ROOT_DIRECTORY + downloadFolderName, name).then((isExist) => {
      this.openFile(ROOT_DIRECTORY + downloadFolderName + name, mimeType);
    }).catch((notexist) => {
      console.log("nonexist")
      //create dir
      this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
        .then((entries) => {
          //Download file
          this._toastService.presentToast("Downloading.....", 'success')
          this.fileTransfer.download(url, ROOT_DIRECTORY + downloadFolderName + '/' + name).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            this.openFile(entry.nativeURL, mimeType);
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

  async createPdf() {
    this.isDisable = true;
    this.loading = true;
    console.log("create pdf");

    const description = htmlToPdfmake(this.planDetail.plan_description);
    const included = htmlToPdfmake(this.planDetail.inclueded);
    const excluded = htmlToPdfmake(this.planDetail.excluded);
    const estimate = htmlToPdfmake(this.planDetail.estimate);

    var docDefinition = {

      content: [],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: 'white',
          margin: [65, 10, 0, 9]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        name: {
          margin: [0, 25, 0, 0],
          fontSize: 18,
          bold: true
        },
        duration: {
          fontSize: 14,
          margin: [0, 10, 0, 0],
          color: 'grey'
        },
        logo: {
          margin: [5, 10, 0, 10]
        },
        'html-p': {
          color: '#434a5e',
          margin: [10, 5, 0, 0]
        },
        'html-li':{
          color: '#434a5e',
        },
        img:{
          margin:[0,0,0,10]
        }
      }
    }
    for (var i = 0; i < this.planDetail.images.length; i++) {
      docDefinition.content.push({
        columns: [
          {
            image: this.planDetail.images[i].image_base,
            height: 150, width: 150, style: 'img'
          }], columnGap: 10
      });
    }
    // docDefinition.content.push(html)
    docDefinition.content.unshift(
      {
        layout: 'noBorders',
        table: {
          widths: ['*'],
          body: [[{
            fontSize: 10,
            fillColor: '#021b79',
            color: 'white',
            alignment: 'left',
            columns: [
              {
                width: 100,
                image: this.logoImage,
                style: 'logo'
              },
              {
                width: '*',
                text: '\tBlue Diamond Voyage\t', style: 'header'
              }
            ]
          }]]
        }
      },

      { text: this.planDetail.plan_name, style: 'name' },

      { text: this.planDetail.inquiry_name + ' tour for ' + this.planDetail.duration + ' Nights', style: 'duration' },

      { text: 'Description', style: 'subheader' },
      description,

      { text: 'Included', style: 'subheader' },
      included,

      { text: 'Excluded', style: 'subheader' },
      excluded,

      { text: 'Estimate', style: 'subheader' },
      estimate,

      { text: 'Attachment', style: 'subheader' },

    );

    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);

    console.log("download pdf");
    if (this.plt.is('android')) {
      console.log("in if");
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        console.log("directory  ", this.file.externalRootDirectory);
        this.loading = false;
        this.isDisable = false;
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalRootDirectory, this.planDetail.plan_name + '.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(fileEntry.nativeURL, 'application/pdf');
        })
      });
    } else {
      console.log("in else");
      this.loading = false;
      this.isDisable = false;
      this.pdfObj.download();
    }

  }

}
