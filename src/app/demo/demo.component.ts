import { Component } from '@angular/core';
import { Option } from '../mat-select-autocomplete/mat-select-autocomplete.component';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  animations: [
    trigger('highlight', [transition(':enter', animate(
      '500ms ease-out',
      keyframes([
        style({transform: 'scale(1, 1)', 'background-color': '*', offset: 0}),
        style({transform: 'scale(0.99, 0.99)', 'background-color': '#ecf0f7', offset: 0.5}),
        style({transform: 'scale(1, 1)', 'background-color': '*', offset: 1}),
      ]),
    ))]),
  ],
})
export class DemoComponent {
  testOptions: Option[] = [
    {
      id: 0,
      label: 'First one',
    },
    {
      id: 1,
      label: 'Second one',
    },
    {
      id: 2,
      label: 'Third one',
    },
    {
      id: 3,
      label: 'Fourth one',
    },
    {
      id: 4,
      label: 'Fifth one',
    },
    {
      id: 5,
      label: 'Sixth one',
    },
    {
      id: 6,
      label: 'Seventh one',
    },
    {
      id: 7,
      label: 'Eighth one',
    },
    {
      id: 8,
      label: 'Nineth one',
    },
    {
      id: 9,
      label: 'Tenth one',
    },
  ];

  firstOptions: Option[] = [this.testOptions[1]];
  secondOptions: Option[] = [this.testOptions[1], this.testOptions[2]];

  onFirstSelectedOptionsChange(selectOptions: Option[] | null) {
    this.firstOptions = selectOptions ?? [];
  }

  onSecondSelectedOptionsChange(selectOptions: Option[] | null) {
    this.secondOptions = selectOptions ?? [];
  }
}
