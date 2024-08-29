import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LandingFragmentService {
    private fragment$ = new BehaviorSubject<string>('');

    setFragment(fragment: string): void {
        this.fragment$.next(fragment);
    }

    getFragment() {
        return this.fragment$;
    }
}
