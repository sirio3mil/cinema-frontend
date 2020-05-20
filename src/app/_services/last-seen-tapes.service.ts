import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TapeUser} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class LastSeenTapesService {
  private currentListSubject: BehaviorSubject<TapeUser[]>;

  constructor() {
    this.currentListSubject = new BehaviorSubject<TapeUser[]>(JSON.parse(localStorage.getItem('lastSeenTapes')));
  }

  public get subscribed(): TapeUser[] {
    return this.currentListSubject.value;
  }

  save(items: TapeUser[]) {
    localStorage.setItem('lastSeenTapes', JSON.stringify(items));
    this.currentListSubject.next(items);
  }

  add(item: TapeUser) {
    this.subscribed.push(item);
    localStorage.setItem('lastSeenTapes', JSON.stringify(this.subscribed));
    this.currentListSubject.next(this.subscribed);
  }
}
