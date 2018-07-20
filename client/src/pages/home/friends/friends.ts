import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { User } from '../../../interfaces/User';

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage implements OnInit {

  searchQuery: string = ''
  allFriends: User[] = []
  friends: User[] = []

  constructor(public navCtrl: ViewController, public navParams: NavParams) { }

  ngOnInit() {
    this.allFriends = this.navParams.get('friends');
    this.searchReset();
  }

  searchFriends() {
    this.friends = this.allFriends.filter(({ username, nickname }) => {
      const query = this.searchQuery.toLowerCase();

      username = username.toLowerCase();
      nickname = nickname.toLowerCase();

      return username.includes(query) || nickname.includes(query);
    });
  }

  searchReset() {
    this.friends = this.allFriends;
  }

}
