import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../interfaces/User';
import { AppState } from '../../../store/reducers';
import { PartyProvider } from '../../../providers/party/party';
import { LoadingUiProvider } from '../../../providers/loading-ui/loading-ui';

@IonicPage()
@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage implements OnInit {

  partyId: string
  partyGuests: User[]
  friends$: Observable<User[]>
  friends: User[]
  searchQuery: string = ''

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public partyProvider: PartyProvider,
    public loadingUIProvider: LoadingUiProvider,
    private store: Store<AppState>,
  ) {
    const party = this.navParams.get('party');
    this.partyId = party.id;
  }

  ngOnInit() {
    this.friends$ = this.store.select('friends');
    this.searchReset();
  }

  inviteFriend(friend) {
    this.loadingUIProvider.load(
      async () => {
        await this.partyProvider.joinParty(friend.id, this.partyId);
        await this.partyProvider.inviteUser(this.partyId, friend.phone);
        this.friends = await this.onlyUninvitedUsers(this.friends);
      },
      `Something went wrong when inviting @${friend.username}`,
      {
        loadingOptions: { content: `Inviting @${friend.username}` },
        delay: 500,
      },
    );
  }

  searchFriends() {
    this.friends$.subscribe(friends => this.onlyUninvitedUsers(friends).then((uninvitedFriends) => {
      this.friends = uninvitedFriends.filter(({ username, nickname }) => {
        const query = this.searchQuery.toLowerCase();

        username = username.toLowerCase();
        nickname = nickname.toLowerCase();

        return username.includes(query) || nickname.includes(query);
      });
    }));
  }

  searchReset() {
    this.friends$.take(1).subscribe(friends => this.onlyUninvitedUsers(friends)
      .then(uninvitedFriends => this.friends = uninvitedFriends));
  }

  onlyUninvitedUsers(friends): Promise<User[]> {
    return this.partyProvider.getPartyUsers(this.partyId).then((partyGuestsResponse) => {
      const partyGuestsIds = partyGuestsResponse.data.map(groupUser => groupUser.user.id);
      return friends.filter(friend => !partyGuestsIds.includes(friend.id));
    });
  }

  onDone() {
    const onDone = this.navParams.get('onDone');
    onDone ? onDone() : this.viewCtrl.dismiss();
  }

}
