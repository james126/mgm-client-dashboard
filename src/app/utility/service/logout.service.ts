import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../../../environments/environment'

export class Result {
    outcome!: boolean
    error: HttpErrorResponse | null

    constructor(outcome: boolean, error: HttpErrorResponse | null) {
        this.outcome = outcome
        this.error = error
    }
}

@Injectable({
    providedIn: 'root',
})
export class LogoutService {
    private logoutUrl = ''

    constructor(private http: HttpClient, private logger: NGXLogger) {
        this.logoutUrl = environment.server + environment.logout
    }

    logout(): Observable<Result | any> {
        return this.http.get<Result>(this.logoutUrl, {
            observe: 'response',
            withCredentials: true,
        }).pipe(
            map(result => new Result(result.body?.outcome ? result.body.outcome : false, null)),
            catchError((err, caught) => {
                this.handleError(err, this.logger)
                return of(err)
            }),
        )
    }

    private handleError(error: HttpErrorResponse, logger: NGXLogger) {
        this.logger.error(error)
    }
}
