import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Awskey } from '../env'
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(
    public file: File,

  ) { }



  uploadImage(image, fileType, fileObject) {
    console.log("image path and name", image, fileType, fileObject);
    return new Promise((resolve, reject) => {
      let body, ext, type, key;
      if (fileObject.length) {
        console.log("file object", fileObject);
        body = fileObject;
        type = fileType;
      }

      console.log("ext", ext)
      console.log("BODY======>", body)
      console.log("EXT====>", ext)
      console.log("key====>", key)
      console.log("type====>", type)
      this.s3Putimage({ body, type: type }, 'base64').then((result) => { resolve(result); }).catch((err) => { reject(err); });
    })
  }


  s3Putimage(file, encoding) {
    let responseData = []
    console.log("file", file, "encoding", encoding)
    return new Promise((resolve, reject) => {
      AWS.config.accessKeyId = Awskey.accessKeyId;
      AWS.config.secretAccessKey = Awskey.secretAccessKey;
      AWS.config.region = 'us-east-2';
      AWS.config.signatureVersion = 'v4';
      let s3 = new AWS.S3();
      file.body.map((item) => {
        console.log("item", item);
        let ext = item.type.split('/')[1];
        let date = Date.now();
        let params = {
          Body: item,
          Bucket: 'tripion-testing',
          Key: "chat/" + item.name + date + '.' + ext,
          ACL: "public-read",
          ContentType: 'audio/webm',
        };
        console.log("params", params)
        s3.upload(params, function (evt) {
          console.log('Event In evt====>>>>', evt);

        }).send(function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            reject(err);
          } else {
            console.log('Successfully uploaded file.', data);
            const obj = {
              url: data.Location,
              mimeType: item.type,
              ext: ext,
              name: item.name,
              type: file.type
            }
            responseData.push(obj);
            console.log('responseData', responseData);
            if (responseData.length == file.body.length) {
              resolve(responseData);
            }
          }
        });
      })
    })
  }
}
