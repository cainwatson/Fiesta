import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interfaces/User';
import { AppState } from '../../store/reducers';
import { AddFriends } from '../../store/friends/friends.actions';
import { FriendRequestsState } from '../../store/friend-requests/friend-requests';
import { AddFromFriendRequests, AddToFriendRequests } from '../../store/friend-requests/friend-requests.actions';
import { AddUserParties } from '../../store/parties/parties.actions';
import { UserProvider } from '../../providers/user/user';
import { PartyProvider } from '../../providers/party/party';
import { app } from '../../feathers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  timelineRoot = 'TimelinePage'
  searchRoot = 'SearchPage'
  createPartyRoot = 'CreatePartyPage'
  friendRequestsRoot = 'FriendRequestsPage'
  profileRoot = 'ProfilePage'

  user$: Observable<User>
  friendRequests$: Observable<FriendRequestsState>

  constructor(
    public userProvider: UserProvider,
    public partyProvider: PartyProvider,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    app.service('friends').on('created', this.updateFriendships.bind(this));
    app.service('friends').on('removed', this.updateFriendships.bind(this));
    app.service('friend-requests').on('created', this.updateFriendRequests.bind(this));
    app.service('friend-requests').on('removed', this.updateFriendRequests.bind(this));
    app.service('group-users').on('created', this.updateParties.bind(this));

    this.user$ = this.store.select('user');
    this.friendRequests$ = this.store.select('friend-requests');
  }

  ngOnDestroy() {
    app.service('friends').off('created', this.updateFriendships.bind(this));
    app.service('friends').off('removed', this.updateFriendships.bind(this));
    app.service('friend-requests').off('created', this.updateFriendRequests.bind(this));
    app.service('friend-requests').off('removed', this.updateFriendRequests.bind(this));
    app.service('group-users').off('created', this.updateParties.bind(this));
  }

  updateFriendships(data) {
    this.user$.take(1).subscribe((user) => {
      const { user1_id, user2_id } = data;
      const userId = user.id;

      if (user1_id === userId || user2_id === userId) {
        this.userProvider.getUserFriends(userId)
          .then(friendsResponse => this.store.dispatch(new AddFriends(friendsResponse.data)));
        this.userProvider.getFromFriendRequests(userId)
          .then(friendRequestsResponse => this.store.dispatch(new AddFromFriendRequests(friendRequestsResponse.data)));
      }
    });
  }

  updateFriendRequests(data) {
    this.user$.take(1).subscribe((user) => {
      const { from_user_id, to_user_id } = data;
      const userId = user.id;

      if (from_user_id === userId || to_user_id === userId) {
        this.userProvider.getFromFriendRequests(userId)
          .then(friendRequestsResponse => this.store.dispatch(new AddFromFriendRequests(friendRequestsResponse.data)));
        this.userProvider.getToFriendRequests(userId)
          .then(friendRequestsResponse => this.store.dispatch(new AddToFriendRequests(friendRequestsResponse.data)));
      }
    });
  }

  updateParties(data) {
    this.user$.take(1).subscribe((user) => {
      const groupUserId = data.user_id;
      const userId = user.id;

      if (groupUserId === userId) {
        this.partyProvider.getUserParties(userId)
          .then(parties => this.store.dispatch(new AddUserParties(parties)));
      }
    });
  }

}
