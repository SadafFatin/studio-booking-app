import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, MatDatepicker,
    MatSelectModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatIconModule,
    MatCardModule, MatButton, MatTimepickerModule],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {


  previousBooking: any = signal([]);
  bookings:any = {

  }

  maxTime = new Date();
  minTime = new Date();
  customOptions: any = [];

  constructor(
    public dialogRef: MatDialogRef<BookingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bookings = JSON.parse(localStorage.getItem('booking') || '{}');
    this.previousBooking.set( this.bookings[String(this.data.studio.Id)] || []);
  }

  ngOnInit(): void {
    this.minTime= new Date( ); // 8:00 AM
    this.maxTime = new Date(); // 6:00 PM
    const openTime = this.data.studio.Availability.Open.split(':').map(Number);
    const closeTime = this.data.studio.Availability.Close.split(':').map(Number);
    this.minTime.setHours(openTime[0], openTime[1], 0, 0);
    this.maxTime.setHours(closeTime[0], closeTime[1],0, 0);
  }

  onSubmit(form: any): void {
    if(this.bookStudio(form)){
      this.dialogRef.close();
    }
  }


   bookStudio(form:NgForm): boolean {
    const { fromSlot, toSlot , date, email, name} = form.value;

    if( fromSlot < this.minTime || toSlot > this.maxTime){
      alert('Start and End time must be between ' + this.data.studio.Availability.Open + ' and ' + this.data.studio.Availability.Close);
      return false;
    }

    if(fromSlot >= toSlot){
      alert('End time must be greater than start time');
      return false;
    }

    if(this.previousBooking().some((booking:any) =>
      booking.date === date.toISOString() &&
      ((fromSlot.toISOString() >= booking.fromSlot && fromSlot.toISOString() < booking.toSlot) ||
        (toSlot.toISOString() > booking.formSlot && toSlot.toISOString() <= booking.toSlot) ||
        (fromSlot.toISOString() <= booking.formSlot && toSlot.toISOString() >= booking.toSlot))
     ))
    {
      alert('This time slot is already booked. Please choose another time slot.');
      return false;
    }

    const bookingData =
      {
        studio: this.data.studio,
        date: date.toISOString(),
        fromSlot: fromSlot.toISOString(),
        toSlot: toSlot.toISOString(),
        user: {
          name: name,
          email: email
        }
    };
    this.previousBooking().push(bookingData);
    this.bookings[String(this.data.studio.Id)] = this.previousBooking();

    localStorage.setItem("booking" , JSON.stringify(this.bookings));
    alert('Booking confirmed!');
    return true;
  }


}
