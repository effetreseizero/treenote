import { Component, OnInit } from '@angular/core';

import { FirebaseService} from '../../services/data/firestore.service';
import { Survey} from '../../services/data/survey';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})
export class SurveysPage implements OnInit {

  surveyList = [];
  surveyData: Survey;
  surveyForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder
  )
  {
    this.surveyData = {} as Survey;
  }

  ngOnInit()
  {
    this.surveyForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      notes: ['', [Validators.required]]
    })

    this.firebaseService.read_surveys().subscribe(data => {

      this.surveyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          location: e.payload.doc.data()['location'],
          notes: e.payload.doc.data()['notes'],
        };
      })
      console.log(this.surveyList);

    });
  }

  createRecord() {
    console.log(this.surveyForm.value);
    this.firebaseService.create_survey(this.surveyForm.value).then(resp => {
      this.surveyForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_survey(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.editName = record.name;
    record.editLocation= record.location;
    record.editNotes = record.notes;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['name'] = recordRow.editName;
    record['location'] = recordRow.editLocation;
    record['notes'] = recordRow.editNotes;
    this.firebaseService.update_survey(recordRow.id, record);
    recordRow.isEdit = false;
  }

}
