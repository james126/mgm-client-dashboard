import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomAnimationBuilderService {
  private _trigger: String = '';
  private _beforeOpacity: number = -1;
  private _beforeTransform: string = '';
  private _timing: string = '';
  private _afterOpacity: number = -1;
  private _afterTransform: string = '';

  constructor() {  }

  get trigger(): String {
    return this._trigger
  }

  set trigger(value: String) {
    this._trigger = value
  }

  get beforeOpacity(): number {
    return this._beforeOpacity
  }

  set beforeOpacity(value: number) {
    this._beforeOpacity = value
  }

  get beforeTransform(): string {
    return this._beforeTransform
  }

  set beforeTransform(value: string) {
    this._beforeTransform = value
  }

  get timing(): string {
    return this._timing
  }

  set timing(value: string) {
    this._timing = value
  }

  get afterOpacity(): number {
    return this._afterOpacity
  }

  set afterOpacity(value: number) {
    this._afterOpacity = value
  }

  get afterTransform(): string {
    return this._afterTransform
  }

  set afterTransform(value: string) {
    this._afterTransform = value
  }
}
