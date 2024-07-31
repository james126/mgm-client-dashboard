import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { environment } from 'src/environments/environment.development'

import { SignupService } from '../../app/views/pages/register/services/signup.service'

describe('SignupService', () => {
    let signupService: SignupService;
    let controller: HttpTestingController;
    const server = environment.server;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SignupService],
        })
        signupService = TestBed.inject(SignupService)
        controller = TestBed.inject(HttpTestingController);
    })

    it('check is username taken', () => {
        const username = "apple";
        const serverResponse = { usernameTaken: true }


        let actualResult: any;
        signupService.isUsernameTaken(username).subscribe(result => {
            actualResult = result
        })

        let usernameUrl = `${server}${environment.usernameTaken}?username=${username}`;
        const request = controller.expectOne({ method: 'GET', url: usernameUrl });
        request.flush(serverResponse);
        controller.verify();

        expect(actualResult).toBe(serverResponse.usernameTaken);
    })

    it('handles response errors', () => {

    })
})
