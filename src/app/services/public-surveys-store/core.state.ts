//https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6


export class CoreState {

    public readonly publicSurveys: any;
  
    constructor() {
      // set initial state
      this.publicSurveys = [];
    }
}