import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IonicPage, MenuController } from 'ionic-angular';
import { Party } from '../../../interfaces/Party';
import { AppState } from '../../../store/reducers';
import { PartyProvider } from '../../../providers/party/party';
import { User } from '../../../interfaces/User';
import { UserProvider } from '../../../providers/user/user';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage implements OnInit, OnDestroy {

  user: User
  userSub: Subscription
  parties: Party[] = []
  friends: User[] = []

  constructor(
    public menuCtrl: MenuController,
    public userProvider: UserProvider,
    public partyProvider: PartyProvider,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.userSub = this.store.select('user').subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async ionViewWillEnter() {
    const friends = await this.userProvider.getUserFriends(this.user.id);
    this.friends = friends.data;

    const friendsParties = [];
    const friendsPartiesMap = {};
    await Promise.all(this.friends.map(async (friend) => {
      const parties = await this.userProvider.getUserParties(friend.id);
      const uniqueParties = parties.data
        .map(groupUser => groupUser.party)
        .filter((party) => {
          let isUnique = false;

          if (!(party.id in friendsPartiesMap)) {
            isUnique = true;
            friendsPartiesMap[party.id] = true;
          }

          return isUnique;
        });

      friendsParties.push(...uniqueParties);
    }));

    this.parties = friendsParties.sort((a, b) => {
      const aUpdatedAt = new Date(a.updatedAt);
      const bUpdatedAt = new Date(b.updatedAt);

      if (aUpdatedAt === bUpdatedAt) return 0;
      return aUpdatedAt > bUpdatedAt ? -1 : 1;
    });
  }


  toggleSidebar() {
    this.menuCtrl.toggle();
  }

}


