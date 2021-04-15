//https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6
export class CoreState {

  public readonly hideHelper: boolean;
  public readonly darkMode: boolean;

  constructor() {
    // set initial state
    this.hideHelper= true;
    this.darkMode = false;
  }
}