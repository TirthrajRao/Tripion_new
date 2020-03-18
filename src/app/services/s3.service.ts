import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { key } from '../env'
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private options: CameraOptions = {
    targetWidth: 384,
    targetHeight: 384,
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    // encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,

  }
  constructor(
    private camera: Camera,
    private filePath: FilePath,
    public file: File,

  ) { }

  /**
   * get image from camera and gallary
   * @param {string} name
   * @param {string} sourceType
   */
  setProfilePhoto(name, sourceType, mediaType): Promise<any> {
    let base64Image;
    console.log("sourcetype", sourceType, mediaType)
    return new Promise((resolve, reject) => {
      this.options.sourceType = sourceType;
      this.options.mediaType = mediaType
      if (mediaType == 2) {
        console.log("---------", mediaType)
        this.options.destinationType = 1
      }
      this.camera.getPicture(this.options).then(async (res) => {
        console.log("res", res);
        console.log("videoURI", JSON.stringify(res), "mediatype", mediaType);
        // console.log("videoURI", res.toURI());

        if (mediaType == 0) {
          if (res) {
            base64Image = 'data:image/jpeg;base64,' + res;
            resolve(base64Image);
          }
        } else if (mediaType == 1) {
          if (res) {
            var filename = res.substr(res.lastIndexOf('/') + 1);
            var dirpath = res.substr(0, res.lastIndexOf('/') + 1);
            dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
            this.file.readAsDataURL(dirpath, filename).then(
              file64 => {
                console.log("file64=====>", file64); //base64url...
                resolve(file64);
              }).catch(err => {
                reject(err);
              });
          }
        } else if (mediaType == 2) {
          console.log("in all media", res)
          if (res) {
            var filename = res.substr(res.lastIndexOf('/') + 1);
            var dirpath = res.substr(0, res.lastIndexOf('/') + 1);
            dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
            console.log("filename", filename, "dirpath", dirpath)
            this.file.readAsDataURL(dirpath, filename).then(
              file64 => {
                console.log("file64=====>", file64); //base64url...
                // resolve(file64);
              }).catch(err => {

                reject(err);
              });
          }
        }
      }).catch((err) => {
        reject(err);
      })
    })

  }

  /**
   * upload image to s3
   */
  uploadImage(image, imageName, fileType, fileObject?) {
    console.log("image path and name", image, imageName, fileType);
    return new Promise((resolve, reject) => {
      let date = Date.now();

      let body, ext, mime, type, key;
      if (image.includes('data:imagedf')) {
        body = image;
        body = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        ext = image.split(';')[0].split('/')[1] || 'jpg';
        mime = "image/" + ext,
          type = "image"
      } else if (image.includes('data:video/mp4;base64fgg')) {
        body = Buffer.from(image.replace(/^data:video\/\w+;base64,/, ''), 'base64');;
        console.log("----", image)
        ext = image.split(';')[0].split('/')[1] || 'mp4';
        mime = "video/" + ext,
          type = "vedio"
      } else if (image.includes('data:audio')) {
        console.log("type audio")
        body = image;
        // body = Buffer.from(image.replace(/^data:audio\/\w+;base64,/, ''), 'base64');
        ext = image.split(';')[0].split('/')[1] || 'mp3';
        mime = "audio/" + ext,
          type = fileType,
          key = "chat/" + date + '.' + ext;
      } else if (fileObject) {
        console.log("file object", fileObject);
        body = fileObject;
        ext = fileObject.type.split('/')[1];
        type = fileType;
        mime = fileObject.type
        key = "chat/" + imageName + date + '.' + ext;
      }
      console.log("ext", ext)
      console.log("BODY======>", body)
      console.log("EXT====>",ext)
      console.log("key====>",key)
      console.log("type====>",type)
      // const key = "chat/" + imageName + date + '.' + ext;
      // console.log(body, ext, mime, key, type)
      this.s3Putimage({ body, mime: mime, name: imageName, type: type }, key, 'base64', ext).then((result) => { resolve(result); }).catch((err) => { reject(err); });
    })
  }


  s3Putimage(file, key, encoding, ext) {
    console.log("file", file, "key", key, "encoding", encoding)
    return new Promise((resolve, reject) => {
      AWS.config.accessKeyId = key.accessKeyId;
      AWS.config.secretAccessKey = key.secretAccessKey;
      AWS.config.region = 'us-east-2';
      AWS.config.signatureVersion = 'v4';
      let s3 = new AWS.S3();

      const params = {
        Body: file.body,
        Bucket: 'tripion-testing',
        Key: key,
        ACL: "public-read",
        ContentType: file.mime,
      };
      console.log("params", params)

      s3.upload(params, function (evt) {
        console.log('Event In evt====>>>>', evt);
        // resolve(evt)
        // console.log(evt.loaded + ' of ' + evt.total + ' Bytes');

      }).send(function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          reject(err);
        }
        console.log('Successfully uploaded file.', data);
        const obj = {
          url: data.Location,
          mimeType: file.mime,
          ext: ext,
          name: file.name,
          type: file.type
        }
        console.log("obj", obj)
        resolve(obj);
      });
    })
    // })
  }
}
