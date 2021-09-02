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

  public async addNewToGallery(role): Promise<Photo> {
    // Take a photo

   
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: role, 
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
