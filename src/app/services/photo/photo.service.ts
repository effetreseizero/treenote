//https://ionicframework.com/docs/angular/your-first-app/2-taking-photos
import { Injectable } from '@angular/core';

import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
  CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  //public photos: Photo[] = [];

  constructor() { }

  public async addNewToGallery(): Promise<Photo> {
    // Take a photo

    //TO DO 
    //discover how to resize captured images
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      width:800,
      preserveAspectRatio:true,
      quality: 70,
      correctOrientation: true 
    });

    return {
        filetype: capturedPhoto.format,
        webviewPath: capturedPhoto.webPath
    };
  }
}

export interface Photo {
  filetype: string;
  webviewPath: string;
}
