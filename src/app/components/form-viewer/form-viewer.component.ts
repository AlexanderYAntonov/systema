import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.css']
})
export class FormViewerComponent implements OnInit {
  @Input() formList: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
