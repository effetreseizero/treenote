//https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6
export class CoreState {

  public readonly homeHelper: boolean;
  public readonly surveyHelper: boolean;

  constructor() {
    // set initial state
    this.homeHelper= true;
    this.surveyHelper = true;
  }
}