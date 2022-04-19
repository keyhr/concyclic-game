import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  viewSizePx: number = 700;

  constructor() {}

  ngOnInit(): void {
    if (window.innerWidth < 600) this.viewSizePx = window.innerWidth * 1.2;
  }
}
