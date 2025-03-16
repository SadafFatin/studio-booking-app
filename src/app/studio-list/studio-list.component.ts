import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { StudioService } from '../service/studio-service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { calculateDistance } from '../util/util';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-studio-list',
  standalone: true,
  imports: [MatDialogModule,
    MatCardModule, MatButtonModule, CurrencyPipe, MatInputModule,
    MatFormField, MatListModule, MatSelectModule, MatSnackBarModule,
    MatDivider, MatToolbarModule,MatIconModule, MatGridListModule,RouterModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './studio-list.component.html',
  styleUrl: './studio-list.component.scss'
})
export class StudioListComponent {


 selectedRadius = signal(50);
 // Signal for managing the list of studios
 studioList = signal<any[]>([]);
 filteredStudios = signal<any[]>([]);

// Signal for managing search text
 searchTerm = signal<string>('');

// Signal for managing booking details
 bookingDetails = signal<any>(null);

 studioService = inject(StudioService);
 private _snackBar = inject(MatSnackBar);


constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Fetch studio data and update the studioListSignal
    this.studioService.fetchStudios().subscribe((data:any) => {
        this.studioList.set(data.Studios);
        this.filteredStudios.set(data.Studios);
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
            const distance = calculateDistance(userLat, userLon, studioLat, studioLon);
            return distance <= radius();
           });
           this.filteredStudios.set(filteredStudios);
        },
        (error) => {
          console.error('Error getting geolocation', error);
          this._snackBar.open(error.message , 'Close');
        }
      );
    }
  }


}

