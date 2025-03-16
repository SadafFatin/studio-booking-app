import { ChangeDetectionStrategy, Component, Signal, signal, WritableSignal } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, MatSelectModule, ReactiveFormsModule, FormsModule,
    MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatListModule, DatePipe,MatAccordion, MatExpansionModule
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent {

  bookings : WritableSignal<any> = signal({});
  bookedStudios: WritableSignal<any[]> = signal([]);

  ngOnInit(): void {
     this.bookings = JSON.parse(localStorage.getItem('booking') || '{}');
     this.bookedStudios.set(Object.keys(this.bookings));
  }
}
