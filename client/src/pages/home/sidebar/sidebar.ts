import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { Party } from '../../../interfaces/Party';
import { AppState } from '../../../store/reducers';
import { PartyProvider } from '../../../providers/party/party';
import { Subscription } from '../../../../node_modules/rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-sidebar',
  templateUrl: 'sidebar.html',
})
export class SidebarPage implements OnInit, OnDestroy {

  query: string = ''
  parties: Array<Party> = []

  parties$: Observable<Party[]>
  partiesSub: Subscription

  constructor(
    public navCtrl: NavController,
    public partyProvider: PartyProvider,
    public changeDetectorRef: ChangeDetectorRef,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.parties$ = this.store.select('parties');
    this.partiesSub = this.parties$.subscribe((parties) => {
      this.parties = parties.sort((a, b) => {
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.partiesSub.unsubscribe();
    this.changeDetectorRef.detach();
  }

  onQuery() {
    this.parties$.subscribe((parties) => {
      this.parties = parties.filter(({ name }) => {
        const query = this.query.toLowerCase();
        name = name.toLowerCase();
        return name.includes(query);
      });
    });
  }

  reset() {
    this.parties$.take(1).subscribe((parties) => {
      this.parties = parties;
    });
  }

  goToParty(party) {
    this.navCtrl.push('PartyPage', { party });
  }

}
