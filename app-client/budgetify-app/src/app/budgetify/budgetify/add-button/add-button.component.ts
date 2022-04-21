import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AddBtnService } from './services/add-btn.service';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent implements OnInit {

  constructor(public addBtnService: AddBtnService) {}

  ngOnInit(): void {}
}
