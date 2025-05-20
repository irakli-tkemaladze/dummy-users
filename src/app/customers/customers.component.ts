import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { ProxyService } from '../proxy.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { User } from './user.model';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-customers',
  imports: [NgClass, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit, AfterViewInit, OnDestroy {
  router: Router = inject(Router);
  pg = input.required<string>();
  private proxy = inject(ProxyService);
  public allPages: number[] = [];
  uiPages: number[] = [];
  currentPage: number = 1;
  public users: User[] = [];
  totalUsers: number = 0;
  destroyRef = inject(DestroyRef);
  lastUserSearch: string = '';
  search = input<string>();
  searchInput = viewChild<NgModel>('search');
  private usersService = inject(UsersService);
  isNavigationChange = this.usersService.onNavigationClicked;
  isFirstTimeOnPage = this.usersService.isFirstTimeOnUsersGroup;
  markedUser = this.usersService.markedUser;
  constructor() {
    effect(() => {
      if (
        (this.isNavigationChange() && this.currentPage > 1) ||
        this.lastUserSearch
      ) {
        this.searchInput()?.reset();
        this.lastUserSearch = '';
        this.currentPage = 1;
        this.isNavigationChange.set(false);
        this.isFirstTimeOnPage.set(false);
        this.getUsers();
        this.calculateUiPages();
      } else if (!this.lastUserSearch && this.isNavigationChange()) {
        this.isNavigationChange.set(false);
      }
    });
  }
  ngAfterViewInit() {
    const timeOut = setTimeout(() => {
      this.searchInput()?.control.setValue(this.search());
      clearTimeout(timeOut);
    });
  }

  ngOnInit(): void {
    if (+this.pg() < 1) {
      this.router.navigate(['/customersGroups', 'page', 1]);
    } else if (+this.pg() > 0) {
      this.currentPage = +this.pg();
    } else {
      this.router.navigate(['/customersGroups', 'page', 1]);
    }
    const timeOut = setTimeout(() => {
      if (this.isFirstTimeOnPage()) {
        this.lastUserSearch = this.search() ?? '';
        this.getUsers();
      }
      clearTimeout(timeOut);
    });
    if (!this.isFirstTimeOnPage()) {
      this.isFirstTimeOnPage.set(true);
    }
  }

  onPageChange(newPage: number) {
    if (
      newPage !== this.currentPage &&
      newPage >= 1 &&
      newPage <= this.allPages[this.allPages.length - 1]
    ) {
      this.currentPage = newPage;
      if (this.search()) {
        this.router.navigate(['/customersGroups', 'page', this.currentPage], {
          queryParams: { search: this.search() },
        });
      } else {
        this.router.navigate(['/customersGroups', 'page', this.currentPage]);
      }
      const timeout = setTimeout(() => {
        this.getUsers();
        clearTimeout(timeout);
      });
    } else {
      return;
    }
    this.calculateUiPages();
  }

  getUsers() {
    let usersData: Observable<{
      limit: number;
      skip: number;
      total: number;
      users: User[];
    }>;
    if (this.lastUserSearch) {
      usersData = this.proxy.getUsersService({
        limit: 10,
        skip: (this.currentPage - 1) * 10,
        q: this.lastUserSearch,
      });
    } else {
      usersData = this.proxy.getUsersService({
        limit: 10,
        skip: (this.currentPage - 1) * 10,
      });
    }
    const subscription = usersData.subscribe({
      next: (res: {
        limit: number;
        skip: number;
        total: number;
        users: User[];
      }) => {
        this.users = res.users;
        if (
          this.currentPage > Math.ceil(res.total / 10) &&
          !this.lastUserSearch
        ) {
          this.currentPage = Math.ceil(res.total / 10);
          this.router.navigate(['/customersGroups', 'page', this.currentPage]);
          subscription.unsubscribe();
          this.getUsers();
        }
        if (this.totalUsers !== res.total) {
          this.totalUsers = res.total;
          this.allPages = [];
          for (let i = 1; i <= Math.ceil(this.totalUsers / 10); i++) {
            this.allPages.push(i);
          }
          this.calculateUiPages();
        }
      },
      error: (err: Error) => {
        console.log(err.message);
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }

  calculateUiPages() {
    if (this.currentPage < this.allPages.length - 1 && this.currentPage >= 3) {
      this.uiPages = [];
      for (
        let i = this.currentPage - 1;
        i <= this.currentPage + 1 && i < this.allPages.length;
        i++
      ) {
        this.uiPages.push(i);
      }
    } else if (this.currentPage < 3) {
      this.uiPages = [];
      for (let i = 2; i < this.allPages.length && i <= 4; i++) {
        this.uiPages.push(i);
      }
    } else {
      this.uiPages = [];
      for (let i = this.allPages.length - 3; i < this.allPages.length; i++) {
        if (i > 1) {
          this.uiPages.push(i);
        }
      }
    }
  }

  onUserSearchClick(searchInput: NgModel) {
    if (this.lastUserSearch !== searchInput.value) {
      let timeOut = setTimeout(() => {
        if (searchInput.value) {
          this.router.navigate(['/customersGroups', 'page', 1], {
            queryParams: { search: this.lastUserSearch },
          });
        } else {
          this.router.navigate(['/customersGroups', 'page', 1]);
        }
        clearTimeout(timeOut);
      });
      this.currentPage = 1;
    } else {
      return;
    }

    this.lastUserSearch = searchInput.value;
    this.getUsers();
  }
  onUserDblClicked(user: User) {
    this.usersService.lastPage.set(this.currentPage);
    if (this.lastUserSearch) {
      this.usersService.lastUserSearch.set(this.lastUserSearch);
    }
    this.router.navigate(['/users', user.id]);
  }
  markUser(user: User) {
    if (user.id !== this.markedUser()?.id) {
      this.usersService.markedUser.set(user);
    } else {
      this.usersService.markedUser.set(undefined);
    }
  }
  onUserChange() {
    if (typeof this.usersService.markedUser() !== 'undefined') {
      this.usersService.isEditUserClicked.set(true);
    }
  }
  ngOnDestroy(): void {
    this.usersService.markedUser.set(undefined);
  }
}
