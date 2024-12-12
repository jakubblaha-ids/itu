import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/main/app.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ListOfListsComponent } from './components/list-of-lists/list-of-lists.component';
import { CardComponent } from './components/list-of-lists/card/card.component';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { ListComponent } from './components/list/list.component';
import { ItemCardComponent } from './components/list/item-card/item-card.component';
import { CreateItemDialogComponent } from './components/list/create-item-dialog/create-item-dialog.component';
import { ConfiramtionDialogComponent } from './components/confiramtion-dialog/confiramtion-dialog.component';
import { CreateListDialogComponent } from './components/list-of-lists/create-list-dialog/create-list-dialog.component';
import { ImportListComponent } from './components/list-of-lists/import-list/import-list.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './services/custom-overlay-container';
import { SettingsDialogComponent } from './components/topbar/settings-dialog/settings-dialog.component';
import { ItemManagerService } from './services/item-manager.service';
import { ListManagerService } from './services/list-manager.service';
import { ResourceManagerService } from './services/resource-manager.service';
import { UserManagerService } from './services/user-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    ListOfListsComponent,
    CardComponent,
    StopPropagationDirective,
    ListComponent,
    ItemCardComponent,
    CreateItemDialogComponent,
    ConfiramtionDialogComponent,
    CreateListDialogComponent,
    ImportListComponent,
    SettingsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule, // Add MatCardModule to imports
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    ListManagerService,
    ItemManagerService,
    ResourceManagerService,
    UserManagerService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true, backdropClass: 'custom-backdrop' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
