import { Component, inject } from '@angular/core';
import { UsersService } from '../users.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-fetch-data-response',
  imports: [NgClass],
  templateUrl: './fetch-data-response.component.html',
  styleUrl: './fetch-data-response.component.scss',
})
export class FetchDataResponseComponent {
  usersService = inject(UsersService);
  icon = this.usersService.popupIcon;
  text = this.usersService.popupText;
  isError = this.usersService.isError;
  onCancelPopup() {
    this.usersService.fetchingDataEnd.set(false);
  }
  inClickPopup(e: Event) {
    e.stopPropagation();
  }
}
