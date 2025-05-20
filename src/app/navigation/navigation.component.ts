import { Component, inject } from '@angular/core';
import { Nav } from './navigation.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  navigationChange = inject(UsersService);
  navigations: Nav[] = [
    { title: 'დასახელება', routerLink: 'unknown1' },
    { title: 'სურათების ავტორიზაციის გვერდზე', routerLink: 'unknown2' },
    { title: 'ინსტრუქცია ავტორიზაციის გვერდზე', routerLink: 'unknown3' },
    { title: 'პარამეტრები', routerLink: 'unknown4' },
    {
      title: 'მომხმარებლის ჯგუფები',
      routerLink: '/customersGroups/page',
    },
  ];
  onNavigationChange() {
    if (!this.navigationChange.onNavigationClicked())
      this.navigationChange.onNavigationClicked.set(true);
  }
}
