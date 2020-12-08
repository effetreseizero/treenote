import { Injectable } from '@angular/core';

//https://capacitorjs.com/docs/guides/storage
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  // set a key/value object
  async setObject(key: string, object: Object) {
    try {
      const result = await Storage.set({
        key: key,
        value: JSON.stringify(object)
      });
      console.log('set Object in storage: ' + result);
      return true;
    } catch (reason) {
      console.log(reason);
      return false;
    }
  }
  // get a key/value object
  async getObject(key: string): Promise<any> {
    try {
      const result = await Storage.get({
        key: key
      });
      if (result != null) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }
  // remove a single key value:
  remove(key: string) {
    Storage.remove({key});
  }
  //  delete all data from your application:
  clear() {
    Storage.clear();
  }
}
