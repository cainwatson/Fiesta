import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { Party } from '../../interfaces/Party';
import { PartyProvider } from '../../providers/party/party';
import { LoadingUiProvider } from '../../providers/loading-ui/loading-ui';

@Component({
  selector: 'create-game',
  templateUrl: 'create-game.html'
})
export class CreateGameComponent implements OnInit, OnDestroy {

  @ViewChild('matchAnimated') matchAnimatedRef: ElementRef
  @ViewChild('hotAnimated') hotAnimatedRef: ElementRef
  animationsIntervals: any[]

  party: Party
  games = [
    {
      name: 'match',
      title: 'Match!',
      description: 'Find The Mystery Person!',
      animation: 'tada',
    },
    {
      name: 'hot',
      title: 'HotTot!',
      description: 'Pass That HotTot!',
      animation: 'pulse',
    }
  ]

  constructor(
    navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public partyProvider: PartyProvider,
    public loadingUIProvider: LoadingUiProvider,
  ) {
    this.party = navParams.get('party');
  }

  ngOnInit() {
    this.animationsIntervals = [
      setInterval(() => {
        this.matchAnimatedRef.nativeElement.classList.remove('tada');
        setTimeout(() => this.matchAnimatedRef.nativeElement.classList.add('tada'), 0);
      }, 3500),
     setInterval(() => {
        this.hotAnimatedRef.nativeElement.classList.remove('pulse');
        setTimeout(() => this.hotAnimatedRef.nativeElement.classList.add('pulse'), 0);
      }, 4500),
    ];
  }

  ngOnDestroy() {
    this.animationsIntervals.forEach(interval => clearInterval(interval))
  }

  create(name) {
    this.loadingUIProvider.load(
      async () => {
        const { party, partyProvider } = this;
        const party_id = party.id;

        const game = await partyProvider.createGame({ name, party_id });
        this.navCtrl.push('PartyGamePage', { party, game });
      },
      'Oops! Something went wrong when creating your game.',
    );
  }

}
