import { Component, OnInit } from '@angular/core';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [ './viewer.component.sass' ]
})
export class ViewerComponent implements OnInit {
  constructor(private vektorService: VektorService) {}

  ngOnInit() {
    this.vektorService.loadData();
  }
}
