import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Party } from '../../../interfaces/Party';
import { User } from '../../../interfaces/User';
import { PartyProvider } from '../../../providers/party/party';
import { UserProvider } from '../../../providers/user/user';
import { MediaComponent } from '../../../components/media/media';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-party-info',
  templateUrl: 'party-info.html',
})
export class PartyInfoPage {

  party: Party;
  users: User[] = []

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public view: ViewController,
    public partyProvider: PartyProvider,
    public userProvider: UserProvider,
  ) { this.party = navParams.get('party') }

  ngOnInit() {
    this.userProvider.getUsersInParty(this.party.id)
    .then(response => this.users = response.data);
  }

  openMedia(startingIndex) {
    this.modalCtrl.create(MediaComponent, {
      startingIndex,
      media: this.party.media,
    }).present();
  }

  closeModal() {
    this.view.dismiss();
  }

  parseDate(date) {
    return moment(date).format('MMMM Do YYYY, h:mm a');
  }

}
