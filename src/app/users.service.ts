import { Injectable, signal } from '@angular/core';
import { User } from './customers/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  onNavigationClicked = signal<boolean>(false);
  markedUser = signal<User | undefined>(undefined);
  isEditUserClicked = signal<boolean>(false);
  fetchingDataEnd = signal<boolean>(false);
  popupIcon = signal<string>('');
  popupText = signal<string>('');
  isError = signal<boolean>(false);
  isFirstTimeOnUsersGroup = signal<boolean>(true);
  lastUserSearch = signal<string>('');
  lastPage = signal<number>(0);
}
