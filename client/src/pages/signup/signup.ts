import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  nickname: string = '';
  phone: string = '';
  username: string = '';
  userData: any;

  constructor(navParams: NavParams, public navCtrl: NavController, public userProvider: UserProvider) {
    this.userData = navParams.get('userData');
  }

  onSubmit() {
    const { nickname, phone, username, userData } = this;
    const user = {
      'username': username,
      'nickname': nickname,
      'phone': phone,
      'googleId': userData.googleId,
      'email': userData.email,
      'avatar': userData.avatar,
    }
    this.userProvider.createUser(user)
      .then(user => this.userProvider.authenticate({
        strategy: 'google',
        access_token: userData.accessToken,
      }).then(() => this.navCtrl.setRoot(HomePage, {user})));
    
  }

}
