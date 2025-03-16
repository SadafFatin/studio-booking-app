import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';

import { MatGridListModule} from '@angular/material/grid-list';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-studio-list',
  standalone: true,
  imports: [MatDialogModule,
    MatCardModule, MatButtonModule, CurrencyPipe, MatInputModule,
    MatFormField, MatListModule, MatSelectModule,
    MatDivider, MatToolbarModule,MatIconModule, MatGridListModule,RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './studio-list.component.html',
  styleUrl: './studio-list.component.scss'
})
export class StudioListComponent {


selectedRadius = signal(5);
// Signal for managing the list of studios
 studioList = signal<any[]>([]);
 filteredStudios = signal<any[]>([]);

// Signal for managing search text
 searchTerm = signal<string>('');

// Signal for managing booking details
 bookingDetails = signal<any>(null);

constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Fetch studio data and update the studioListSignal
    this.http.get<any[]>('https://gist.githubusercontent.com/rash3dul-islam/88e1565bea2dd1ff9180ff733617a565/raw/684afa147a8e726d7a5e4fdeb390f2d48b35051d/studio-mock-api,json')
      .subscribe((data: any) => {
        this.studioList.set(data.Studios);
        this.filteredStudios.set(data.Studios);
        // Set the fetched data to the signal
        console.log(this.studioList()[10].Images[0]);
      });
  }

  onSearchChange(event: Event): void {
    // Update the search term signal when the search input changes
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.filtereStudiosByArea();
  }

  filtereStudiosByArea() {
    // Dynamically filter studios based on the search term
     this.filteredStudios.set(this.studioList()?.filter(studio =>
      studio.Location.Area.toLowerCase().includes(this.searchTerm().toLowerCase()))
    );
  }


  openBookingForm(studio: any): void {
    this.dialog.open(BookingFormComponent, {
      width: '400px',
      height: '95%',
      data: { studio: studio,
        availableTimes: ['9:00 AM', '12:00 PM', '3:00 PM']
      }
    });
  }



  onRadiusSearch(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const radius = this.selectedRadius;

          let filteredStudios =  this.studioList().filter(studio => {
            const studioLat = studio.Location.Coordinates.Latitude;
            const studioLon = studio.Location.Coordinates.Longitude;
            const distance = this.calculateDistance(userLat, userLon, studioLat, studioLon);
            return distance <= radius();
           });
           this.filteredStudios.set(filteredStudios);
        },
        (error) => {
          console.error('Error getting geolocation', error);
        }
      );
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  }

  degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }








}

