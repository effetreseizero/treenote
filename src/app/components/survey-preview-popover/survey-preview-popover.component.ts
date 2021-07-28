//https://edupala.com/ionic-popover-example/
import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-survey-preview-popover',
  templateUrl: './survey-preview-popover.component.html',
  styleUrls: ['./survey-preview-popover.component.scss'],
})
export class SurveyPreviewPopoverComponent implements OnInit {
  survey;
  desc;
  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.desc = "La segnalazione ha evidenziato il deperimento";

    switch(this.survey.loc_problema){
      case "010_chioma":
        this.desc+=" delle chiome";
        break;
      case "020_fusto":
          this.desc+=" dei fusti";
          break;
      case "030_entrambi":
          this.desc+=" delle chiome e dei fusti";
          break;

    };

    switch(this.survey.tipologia){
      case "010_gruppo":
        this.desc+=" di un gruppo";
        break;
      case "010_gruppo":
          this.desc+=" di un bosco";
          break;
    };

    switch(this.survey.identificazione){
      case "010_conifera":
        this.desc+=" di latifoglie";
        break;
      case "020_latifoglia":
          this.desc+=" di conifere";
          break;
      case "030_misto":
          this.desc+=" misto, latifoglie e conifere";
          break;

    };
    if(this.survey.sintomo_0!=""){
      this.desc+=". Il sintomo riscontrato è"
      switch(this.survey.sintomo_0){
        case "010_avvizzimento_fogliare":
            this.desc+=" l'avvizzimento fogliare";
            break;
        case "020_ingiallimento_fogliare":
            this.desc+=" l'ingiallimento fogliare";
            break;
        case "030_disseccamento_rami":
            this.desc+=" il disseccamento di rami";
            break;
        case "040_microfillia":
            this.desc+=" la microfillia";
            break;
        case "050_emissione_rami_epicormici":
            this.desc+=" l'emissione di rami epicormici";
            break;
        case "060_fessurazione_longitudinale_corteccia":
            this.desc+=" la fessurazione longitudinale della corteccia";
            break;
        case "070_colatura_mugillaginosa":
            this.desc+=" la colatura mugillaginosa";
            break;
        default:
            this.desc+=" in fase di indagine";
            break;
      };
      this.desc+="."
    } else{
      this.desc+=". Sono in corso di indagine sintomi e cause del fenomeno."
    }

  }

  dismiss() {
    // code for dismiss
    this.popoverController.dismiss();
  }
    
}
