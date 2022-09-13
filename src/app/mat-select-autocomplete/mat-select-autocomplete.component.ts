import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';

export interface Option {
  id: number;
  label: string;
}

@Component({
  selector: 'app-mat-select-autocomplete',
  templateUrl: './mat-select-autocomplete.component.html',
  styleUrls: ['./mat-select-autocomplete.component.scss'],
})
export class MatSelectAutocompleteComponent implements OnInit {
  @Input() label!: string;
  @Input() options!: Option[];
  @Input() selectedOptions: Option[] = [];
  @Input() multiple = false;
  @Input() allowNone = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';

  @Input() set disabled(disabled: boolean) {
    if (disabled) {
      this.selectedOptionsFormControl.disable();
    } else {
      this.selectedOptionsFormControl.enable();
    }
  }

  @Output() selectedOptionsChange = new EventEmitter<Option[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('matSelect') matSelect!: MatSelect;

  search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  filteredOptions$!: Observable<Option[]>;

  lastSelectedOptions: Option[] = [];
  selectedOptionsFormControl = new FormControl();
  selectedOptions$: BehaviorSubject<Option[]> = new BehaviorSubject<Option[]>([]);
  selectedOptionsCount$: Observable<number> = this.selectedOptions$.pipe(
    map(options => options.length),
  );

  constructor() {
  }

  ngOnInit() {
    this.initSelectedOptions();

    this.initSelectedOptionsFormControlValue();

    this.initOptionsFiltering();
  }

  private initSelectedOptions() {
    if (this.selectedOptions) {
      this.updateSelectedOptions(this.selectedOptions);
    }
  }

  private updateSelectedOptions(selectedOptions: Option[]) {
    const selectedOptionsChanged =
      selectedOptions.length !== this.lastSelectedOptions.length
      || !selectedOptions?.every(option => this.lastSelectedOptions.some(lastSelectedOption => lastSelectedOption.id === option.id));

    if (selectedOptionsChanged) {
      this.selectedOptions$.next(selectedOptions);
      this.selectedOptionsChange.emit(selectedOptions);
    }
  }

  private initSelectedOptionsFormControlValue() {
    this.selectedOptionsFormControl.setValue(
      this.multiple
        ? this.options.filter(option => {
          return this.isOptionSelected(option);
        })
        : this.options.find(option => {
          return this.isOptionSelected(option);
        }),
    );
  }

  private isOptionSelected(option: Option) {
    return this.selectedOptions$.getValue().some(selectedOption => selectedOption.id === option.id);
  }

  private initOptionsFiltering() {
    this.filteredOptions$ = this.search$.pipe(
      debounceTime(200),
      startWith(''),
      distinctUntilChanged(),
      switchMap(optionName => this.getFilteredOptions(optionName),
      ),
    );
  }

  private getFilteredOptions(optionName: string | null = null): Observable<Option[]> {
    return of(
      optionName
        ? this.filterListOptions(optionName)
        : this.options.slice(),
    );
  }

  private filterListOptions(search: string): Option[] {
    const searchValue = search.toLowerCase();

    return this.options.filter(option => {
      return option.label.toLowerCase().indexOf(searchValue) >= 0;
    });
  }

  private registerAutocomplete() {
    const selectedOptions = this.getSelectedOptions();

    const lastListOption = this.options[this.options.length - 1];
    const secondLastListOption = this.options[this.options.length - 2];

    if (selectedOptions?.length === 1 || selectedOptions?.length === 2) {
      const firstSelectedOption = selectedOptions[0];
      const secondSelectedOption = selectedOptions[1] ?? null;

      if (firstSelectedOption?.id === lastListOption?.id
        || firstSelectedOption?.id === secondLastListOption?.id
        || secondSelectedOption?.id === lastListOption?.id) {
        this.matSelect.panel.nativeElement.scrollTop = this.matSelect.panel.nativeElement.scrollHeight;
      }
    }

    this.search$.next('');

    this.focusSearch();
  }

  onSelectOpened() {
    this.registerAutocomplete();

    this.lastSelectedOptions = this.getSelectedOptions() ?? [];
  }

  onSelectClosed() {
    this.search$.next('');

    const selectedOptions = this.getSelectedOptions();

    this.updateSelectedOptions(selectedOptions);
  }

  getSelectedOptions(): Option[] {
    if (this.selectedOptionsFormControl.value) {
      if (Array.isArray(this.selectedOptionsFormControl.value)) {
        return this.selectedOptionsFormControl.value;
      } else {
        return [this.selectedOptionsFormControl.value];
      }
    }

    return [];
  }

  focusSearch() {
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  trackById(index: number, option: Option): number {
    return option.id;
  };
}
