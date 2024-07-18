import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../../../environments/environment'

export interface PasswordStrength {
  valid: boolean;
  suggestions: string[];
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  repeatedPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private usernameTakenUrl = '';
  private emailTakenUrl = '';
  private signupUrl = ''

  constructor(private http: HttpClient) {
    this.usernameTakenUrl = environment.server + environment.usernameTaken;
    this.usernameTakenUrl = environment.server + environment.emailTaken;
    this.usernameTakenUrl = environment.server + environment.signUp;
  }

  public isUsernameTaken(username: string): boolean {
    // return this.post<{ taken: boolean }>(this.usernameTakenUrl, {
    //   username,
    // }).pipe(map((result) => result.usernameTaken));
    return true;
  }

  //changed
  public isEmailTaken(email: string): boolean {
    // return this.post<{ taken: boolean }>(this.emailTakenUrl, { email }).pipe(
    //     map((result) => result.emailTaken),
    // );
    return false;
  }

  public signup(data: SignupData): Observable<{ success: true }> {
    // return this.post<{ success: true }>(this.signupUrl, data);
    return of({ success: true });
  }

  private post<Response>(path: string, data: any): Observable<Response> {
    return this.http.post<Response>(path, data);
  }

  public getPasswordStrength(value: string): PasswordStrength {
    let strength: PasswordStrength = {
      valid: false,
      suggestions: []
    }

    if (!value) {
      strength.suggestions.push('invalid password')
      return strength;
    }

    const upperCase = this.hasUpperCase(value, strength);
    const lowerCase = this.hasLowerCase(value, strength);
    const numeric = this.hasNumeric(value, strength);
    const specialChar = this.hasSpecialChar(value, strength);
    const length = value.length == 10;
    if (!length) strength.suggestions.push('required length 10 characters');
    strength.valid = upperCase && lowerCase && numeric && specialChar;

    return strength;
  }

  private hasUpperCase(value: string, strength: PasswordStrength): boolean {
    const hasUpperCase = /[A-Z]+/.test(value);
    hasUpperCase ? null : strength.suggestions.push('requires uppercase character');
    return hasUpperCase;
  }

  private hasLowerCase(value: string, strength: PasswordStrength): boolean {
    const hasLowerCase = /[a-z]+/.test(value);
    hasLowerCase ? null : strength.suggestions.push('requires lowercase character');
    return hasLowerCase;
  }

  private hasNumeric(value: string, strength: PasswordStrength): boolean {
    const hasNumeric = /[0-9]+/.test(value);
    hasNumeric ? null : strength.suggestions.push('requires numeric character');
    return hasNumeric;
  }

  private hasSpecialChar(value: string, strength: PasswordStrength): boolean {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
    hasSpecialChar ? null : strength.suggestions.push('requires special character');
    return hasSpecialChar;
  }

}
