import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface UploadForm {
  form: FormGroup;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @Output()
  public formStatusChanged: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public onSubmit: EventEmitter<UploadForm> = new EventEmitter();

  stepForm = this.fb.group({
    file: [null, [Validators.required]],
  });
  
  mimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder) {
    console.log('formStatusChanges: ', this.stepForm.statusChanges);
    this.stepForm.statusChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((data) => {
        console.log('formStatusChanged: ', this.formStatusChanged, 'form status: ', this.stepForm.status);
        this.formStatusChanged.emit(this.stepForm.valid);
      });
  }

  ngOnInit() {
  }

  public getControl(name: string, form: FormGroup = this.stepForm): AbstractControl | null {
    return form.get(name) ? form.get(name) : null;
  }

  nextStep($event: Event): void {
    console.log('event: ', $event);
    console.log('form status: ', this.stepForm.status);
    this.onSubmit.emit({
      form: this.stepForm,
    });
  }
}
