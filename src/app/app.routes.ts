import { Routes } from '@angular/router';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { StudioListComponent } from './studio-list/studio-list.component';

export const routes: Routes = [
  { path: '', component: StudioListComponent },  // Default route
  { path: 'booking-form', component: BookingFormComponent },
  { path: 'booking-list', component: BookingListComponent },
  { path: '**', redirectTo: '' }  // Wildcard route for 404, redirecting to default
];