import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
    private _testimonialSlides: any[] = new Array(2).fill({ id: -1, src: '', title: '', name: '', location: '' })
    private _landingSlides: any[] = new Array(3).fill({ id: -1, src: '', line1: '', line2: '' })

    get testimonialSlides(): any[] {
        return this._testimonialSlides
    }

    get landingSlides(): any[] {
        return this._landingSlides
    }

    constructor() {
        this._testimonialSlides[0] = {
            id: 0,
            src: './assets/index/image/quote1.png',
            title: 'Aston and Mark did a great job cleaning up my overgrown lawn which hadn\'t been mowed for months',
            name: 'Billy Brown',
            location: 'Dannemora',
        }
        this._testimonialSlides[1] = {
            id: 1,
            src: './assets/index/image/quote1.png',
            title: 'The team did a great job landscaping my development before it went to market',
            name: 'Kirsty Merriman',
            location: 'Sunnyvale',
        }

        this._landingSlides[0] = {
            id: 0,
            src: './assets/index/image/one.jpg',
            line1: 'Mr Grass Master',
            line2: 'East Auckland garden maintenance specialists',
        }
        this._landingSlides[1] = {
            id: 1,
            src: './assets/index/image/two.jpg',
            line1: 'We\'re here to help',
            line2: 'get your outdoor areas looking great',
        }
        this._landingSlides[2] = {
            id: 2,
            src: './assets/index/image/three.jpg',
            line1: 'Giving you more time',
            line2: 'to enjoy doing what you love most',
        }
    }
}
