//https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6
export class CoreState {

  public readonly showHomeGuide: boolean;
  public readonly darkMode: boolean;

  constructor() {
    // set initial state
    this.showHomeGuide = true;
    this.darkMode = false;
  }
}