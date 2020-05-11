import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { ToastService } from 'src/app/services/toast.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppComponent } from '../../app.component';

// import html2canvas from 'html2canvas';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Platform } from '@ionic/angular';
import { Base64 } from '@ionic-native/base64/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var $: any;
declare const html2canvas: any;

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
  images = [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKAAgAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQADAQIGBwj/xAA0EAACAQMDAQYEBQQDAQAAAAABAgMABBESITFBBRMiUWFxMoGRoQYUscHwByNC4RXR8VL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAhEQACAgMAAwEBAQEAAAAAAAAAAQIRAxIhBBRRMUEiE//aAAwDAQACEQMRAD8A9qU1aKoQ1apogRZUrArNAJKlSpWMSpUqVjEqVKlYxKlSpWMSsGs1qaxjVjVTGt2qpzRQrNUar1NLDeopwvioiG9hc4JIouLFU0Hg1mqJJRCmtgcelDy9oYA7sfM0FFsZySGFSk5vpy2dQx5AUTFfd4ulsK3/ANHii4NAWSLDGlRTgsM+VbAg8UsDwlv7pydWdSnmrJLnC6YGAx6VtTKaGFYzS97yWNNRCt5dKFk7RkPIHyorG2K8sUOsipmkQv3zxRdvdmQgKwz5UXjaAsyYyNamqu8ZBlyAPWtGnz8Lr8qSimxY1UOa0e4I8jQ73Q6imoVyRw1v28xwJV38wabWXasbNlfFjpiuHgZSOaNgdlxj6116o47aO8HajshXXseRUW6VuTXLW12/BOR60fFMzfDSqCQXNv8AR8synrW4kB60milJOBzV/elOTvQo1jPUPOlXa/4isOynCXM4EjDIj1AH0rIuWJ5+9eYf1ImmuO22EcE+mNFUkqSG2ByKll2jVHT48Y5G3L8R6h2F25a9tQu0GVeM4kRt8ex6imZANeXf0muWV+0A2sKFjAB+Ebt969HF0vnTY9nHomdRjOkEaBUwBVP5lfOsfmB509MlaL5JpCulnYgdCap750+FiK1aUEZzVDyDzrUBthDXsmMNv7ULJfeYIqiWX1oSWWjqK5M4dLqLYjGTzvRsF0gYf3Bg+dJobNtsijUttuNxxT8GY8gu4+pA+dFrfRDhsfKklvZ7ArqJ9qZRWeMack+oo0hLY1hvkUZVs59KIjlEozq+tBQ2h2yprHacw7M7PnvSjMsKaio5NK2gq2JPx52p2v2VFDJYlEtJPCz4OvVvzvxjGPnXm83aFzPIWmmeRic+IkfpT7tbtKXtK8lMsrSgAE5JwPQDp/ulQtkyNhUpRb/GdeNxiuo6n+nPbFz+bksbm4UWjqWUynBD9AD6+tegya1PWvHrS5t4HzPGXjU4ZA5Qn5iui/CPbs1x25FYtIRFIrKFJzluV388DHTNUi0lRLJFydndmVxWO+f1q38sSvBHpjNVSQyqNl2ptkQ1ZPzJXg59K1N1q860aGcbgn6UPIsoHijDfKtwyssknNBy3BrVnccgj70LOXPDD5itYaEtpf20knd4cP7U5tpIG2yaSw9nQpcrOilWAx0pxBrG2o/z2Fea/Lfw9T0ov+jWDuABgnPtWbntjsqwlWG6ue7c+ak4+1DR6sEoxBIxvk0p7U/DMXavaP5ua8mj2A0Io2x5E0Pbfw3pJf07eyubO4hWWKXUjDIYK24+lIf6hXlsv4VuUhmUtMwTrk9SPtRHZlpDYWiwKzyKNgZAMgY44rl/6imK37MtYYEVEaYnSoAGwP8A3Wh5LlLUL8RRWxw1s5EQUDw75opZBp3oCBgEcHUT08hVmvArrjLhGUelk7RnxHng+1bdi3TWfadtcId4plf3waDdiakRCkHOCOlDbo2v+T6QjuLR4klDrpdQwx5EZqGe0YbMD8q4T8PRL2n2BZSzXd2uU0kRz6QNJxjb2pnD2bFbphLq9xjGHuC2Bt51xy8lptUVXiJq7HqXlhJqMM0bhSVJU5wfKqpLmzweCKSradw0pgmZBKSzDSvJ68etCX1nHdWwgupJJEUj/Mrk9M45re1L4H04/RtcXNlu2xAHQ0vmubLbChifUUo/4+GFmMck4ZjkkzMc7YrRlaNQqzPpGwBcn7nc0V5UhfTj9E0N3OynLliPWmVreyLGe8YhhjGPWkccMu0aklioOfQnfb6UWne5gdxpAZnYY5xxXLKJ2qQfJ266Np1EZHNX23ak0gyGffffrSWRBC0ckxMrMc+3H70WXMbFRCxIbSf3qUolE/o7i7RnLhd8eZ5Fc7+O+/ns7eVkbu4pCCxxjJH+vvTW0uJGJ0IAo5POela9oTy31vNZzQho9hhuCRuP0FDHLWaYZpSi0cJZ2r3EZ0tpTV4j0Hr61VNpDkRklBsCeT60QzKlpEi9QWO+/PWgid969p1So8pW2yE1jis1qc9Bn0pGUo9c/BxWL8OWCd3lTHqznqSSf1p20qY2BB9+a5vs1Zbe1tbVNjHEgJA64o9u+L+EEsNhmvIlNubPRjFKKD3ljwckj5igri4txsZMHFavGSnjwzHn1pXd4VsaSCRuD5UybFaL3uYX8Mcv1FDSBTuZc+uKFk1ggKPXPFUzrKIyNWPVaeLYjRWjKHxjGRgHkkdaOt5VYAvwdsAcUlgm1GJSQdQOoD/Efw0yVhtgbFvhrSsKph0VujMoYKVU5O3rRFraiJASctqzlt/XegLSVpAxbw5ON+tXxXJxmTYlTuDxU26HoaLaqF7nSoTIywO5G/Oaw/ZqOr6HO2AMe+aiSjT/AHDqHwgetWGYMior4yNyBikbGSOW/FHY8Fq0SwwMIzl2CHBZidxxncj7muXhtitxdrOAFW3YkxjYcHb5bfOu17fnb83G006rAVMaqx3J4z8tvvXP9g2P/JyX80mklbfTGCPCrFNueoxiuzFkahbZz5IrfgvurRH7RMedUcaogCEb4UDn3zTvs78Jrey2t6kqx2wPjj5ZiCdvLfFKvEhOWyjkkacAHfoPL3rvvw/heybVGbcgke2o5rZckopNMOOCb6EpE0TFgOdznr8qjtIhJcZB326/w1s74YnJUAAZ/X9qrkYPqAOwB26+1cqjZZtglzcEAlvCOlBPPwSQTjbNFyjIWQeuQTsDjFAl8IpVckDgdR1NUUUK2B3F2GGoj5ihZLgnSThc1ZdW5RMRLgZI9t/+qplhaVwdWFjxv51RRRJyYBb4752jBBVM5zRH5vTIi+W+c+lLraVl2XkP4z+lXXrahFhdydJ98Z/ena6BPg6EveRImk7oGJ8qst5AZI9UmEZiNJ643pXZXCpMEkOohMD0z/5RneIdCNpEoOrA6ZP/AFXPJUWTtDa4l0YVB4myeeB/MCqUuZBcxxx8OfESfhOcAY9d/pQ5V54ydaAsoC+eR/5WLEyxzzXMhXuwmlQF+n2zScY3QntQK9q73EZcRr4UL41MTwR1BI+lUdiQTWsUjysTNcbSIxGc75P0P6VLi4j0HIV5RIh8Y1AE7/YYrRpSO1YFKvp1atuR4QCT9aa3rRqV2CX1vGk6LBGqh2Y4JzheQce36U/jultZobUHcQ5wPM0mmiZ7sNIiFAxZmbYAbYxv6Y+tDGecXn5sjOF8PlkZGP5507WyJp6s6aS9DxqNQ1AbDjOTmhvz6BiWbAyOB96S2txIt5HEfgkwMcDpxWJL1klYN0OghsHO4/3S6DOY7kuy4329M7UO0neIZCw4IIH3FL++wRpGSGIPz4/etZptAIByvxe+38+lOkLYY0qumpXGN9v586GMyatQIwV29t6AaclGGeePvVcc4CIvVRyev8/eqKJNtAcfwaWwBpL+pOa2S71AlgNQIxtwfOhFbVI5Ylm0nLVlWX+4w2FWcSWwSjsrd8udIPX34ouOfXpd2II3NLg/enRkr5VC+gBc+9I4JjqVDtL5zAjqwJVTtnn+ZNZN08URibcEqxYn4dulKI7gpGuRw3zqxZjJIO8GQHBI+VTeMf8A6DyyOsAOnGXcHquw3+lbmdZWubgoupeARtznHzpdaXrMJwz/ABKNx71bFNCbOYSk97nxHPIAP1qTgU2MrcPcx7ykGUkvtk4xt7AdPah45GSOSEgmNV8QHUZ4HkN/tQ8AVHDqyyMV3XcdRyfKrjcnS4VUCBd8E/Ln+c1Sq4Jd9LLacQvqyTN3mpFAx/kMqPrVfaDFpZnLZBlJ3APXj70M7gEMCxKjbH853+1V3Tk92wwAyhyBvvVFEm2GxXIjvUZmJwSuT1wMiqXnP9wk9NQNURSOrux/yXIBPnnfFDd6zjB2wcH2p1EXYKL7ZXjk5rSRiiRueMDNaW5BXTJnLHpVHeMU89sU1As0UlRnqaxrypHnUQZU7422rWmFLFk0sCOc1ZI4KIw5J3qhCNQyON6mdl981qMXtKuvW+SobgVDIchuDya02ZFXSPE/NSbZz0GKAbCgzLGcf4jkeZrKgySCNGIDDYnr/qtGIW2l2yCwAPl1qy18UcYwdQU6MfP9zU2hkWwRae8P+MaBgCcDJ6/Sq5NKd2jk4xqbyFWXswRGjgPQCRuh24A+VCrNq1M3PB9RiglfQt1wumlEkOx1OCN+MjjPyqpiWiU4JIzn0FVxkhiw9vtWrOQhGSPDTpCWWZLIm3iwRmh21KQh6c0VAVURajqz0NUXGkT4HQb+9MjGBJpYBd8Dnjmq2671jOSD61g01AP/2Q=="
    ,
    "data:image/jpeg;base64,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",
    "data:image/jpeg;base64,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"
  ]
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
    console.log("create pdf");

    const description = $('#des').text();
    const included = $('#included').text()
    const excluded = $('#excluded').text()
    const estimate = $('#estimate').text()
    var docDefinition = {

      content: [],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          // alignment: 'center',
          // background : '#021b79',
          color: 'white',
          margin: [65, 0, 0, 0]
          // width: '100%',
          // lineHeight: 2
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          margin: [0, 25, 0, 0],
          fontSize: 18,
          bold: true
        },
        duration: {
          fontSize: 14,
          margin: [0, 10, 0, 0],
          color: 'grey'
        },
        img: {
          margin: [0, 10, 0, 0]
        },
        text: {
          color: '#434a5e',
          margin: [0, 5, 0, 0]
        },
        logo: {
          margin: [5, 0, 0, 0]
        }
      }
    }
    // for (var i = 0; i < this.planDetail.images.length; i++) {
    //   docDefinition.content.push({
    //     columns: [
    //       {
    //         image: await this.getBase64ImageFromURL( this.planDetail.images[i].image_url),
    //         height: 150, width: 150, style: 'img'
    //       }], columnGap: 10
    //   });
    // }
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
                // fixed width
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

      { text: this.planDetail.plan_name, style: 'story' },

      { text: this.planDetail.inquiry_name + ' tour for ' + this.planDetail.duration + ' Nights', style: 'duration' },

      { text: 'Description', style: 'subheader' },
      { text: description, style: 'text' },

      { text: 'Included', style: 'subheader' },
      { text: included, style: 'text' },

      { text: 'Excluded', style: 'subheader' },
      { text: excluded, style: 'text' },

      { text: 'Estimate', style: 'subheader' },
      { text: estimate, style: 'text' },

      { text: 'Attachment', style: 'subheader' },
      // {
      //   image: await this.getBase64ImageFromURL(
      //     "https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300"
      //   )
      // },
    );

    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);

    console.log("download pdf");
    // if (this.plt.is('android')) {
      console.log("in if")
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        console.log("directory  ", this.file.externalRootDirectory);
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalRootDirectory, this.planDetail.plan_name + '.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          console.log("fileentry",fileEntry)
          this.fileOpener.open(this.file.dataDirectory + this.planDetail.plan_name + '.pdf', 'application/pdf');
        })
      });
    // } else {
    //   console.log("in else")
    //   this.pdfObj.download();
    // }

  }


  // getBase64ImageFromURL(url) {
  //   return new Promise((resolve, reject) => {
  //     var img = new Image();
  //     img.setAttribute("crossOrigin", "anonymous");
  //     img.onload = () => {
  //       console.log("img load")
  //       var canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       var ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);

  //       var dataURL = canvas.toDataURL("image/png");

  //       resolve(dataURL);
  //     };

  //     img.onerror = error => {
  //       reject(error);
  //     };

  //     img.src = url;
  //   });
  // }


  downloadPlanPdf() {
    console.log("download pdf");
    if (this.plt.is('android')) {
      console.log("in if")
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        console.log("directory  ", this.file.externalRootDirectory);
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalRootDirectory, this.planDetail.plan_name + '.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      console.log("in else")
      this.pdfObj.download();
    }
  }

}
