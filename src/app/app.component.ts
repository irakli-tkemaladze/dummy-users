import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersService } from './users.service';
import { FetchDataResponseComponent } from "./fetch-data-response/fetch-data-response.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    NavigationComponent,
    UserEditComponent,
    UserEditComponent,
    FetchDataResponseComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  usersService = inject(UsersService);
  isEditMode = this.usersService.isEditUserClicked;
  isFetchingEnd = this.usersService.fetchingDataEnd;
  title = 'angularHomeWork1';
  router: Router = inject(Router);
  onReturnHomePg() {
    this.router.navigate(['']);
  }
}
