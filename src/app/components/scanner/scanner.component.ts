import { Component, OnInit } from '@angular/core';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.sass']
})
export class ScannerComponent implements OnInit {

  constructor(private readonly scannerService: ScannerService) { }

  ngOnInit(): void {
    this.scannerService.loadSchedules();
  }

}
