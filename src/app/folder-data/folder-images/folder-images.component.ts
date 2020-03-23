import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '../../services/upload.service';
// import { ToastService } from '../../services/toast.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {AppComponent} from '../../app.component';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { Url } from 'url';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-folder-images',
  templateUrl: './folder-images.component.html',
  styleUrls: ['./folder-images.component.scss'],
})
export class FolderImagesComponent implements OnInit {
  @Input('images') allImages;
  loading: Boolean = false;
  constructor(
    public _uploadService: UploadService,
    // public _toastService: ToastService,
    private photoViewer: PhotoViewer,
    private previewAnyFile: PreviewAnyFile,
    public alertController:AlertController,
    public appComponent:AppComponent,
  ) { }

  ngOnInit() {
    console.log('images', this.allImages)
  }


  /**
   * Delete Image
   */
  async removeImage(data) {
    console.log(data);
    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.loading = true;
            const obj = {
              image_id: data.id
            }
            this._uploadService.removeImage(obj).subscribe((res: any) => {
              console.log(res);
              this.loading = false;
              this.allImages.splice(this.allImages.indexOf(data), 1);
            }, (err) => {
              console.log(err); 
              this.loading = false;
               this.appComponent.errorAlert();
              // this._toastService.presentToast(err.error.message, 'danger')
            })
          }
        }
      ]
    });

    await alert.present();


    
  }

  /**
   * Image pop up
   * @param {URL} img 
   */
  previewImage(img) {
    console.log(img)
    this.photoViewer.show(img)
  }

  /**
   * Document preview
   * @param {Url} path 
   */
  previewDocument(path) {
    console.log(path)
    this.previewAnyFile.preview(path)
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
  }

}
