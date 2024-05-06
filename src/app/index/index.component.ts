import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { AnimationService } from './service/animation.service'
import { ContactFormService } from './service/contact-form.service'
import { Contact } from './dto/contact'
import { RecaptchaComponent } from 'ng-recaptcha'
import { cilCheck } from '@coreui/icons'
import { AnimationBuilder, AnimationPlayer } from '@angular/animations'

@Component({
    selector: 'mgm-index',
    templateUrl: './index.component.html',
    styles: [`#page-container {
      position: relative;
      min-height: 100vh;
    }
    #content-wrap {
      padding-bottom: 4.5rem; /* Footer height */
    }`],
    providers: [ContactFormService],
})
export class IndexComponent implements OnInit, OnDestroy {
    @ViewChild('recaptcha', { static: false, read: RecaptchaComponent }) repactcha?: RecaptchaComponent
    @ViewChildren('anmtn', { read: ElementRef }) elmnt!: QueryList<ElementRef<HTMLElement>>;
    siteKey: string = environment.siteKey
    captchaResponse: boolean = false
    submitted: boolean = false
    contactForm!: FormGroup
    testimonialSlides: any[] = new Array(2).fill({ id: -1, src: '', title: '', name: '', location: '' })
    landingSlides: any[] = new Array(3).fill({ id: -1, src: '', line1: '', line2: ''})
    icons = { cilCheck }
    private player!: AnimationPlayer;
    observerable: IntersectionObserver | undefined;

    formValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        message: '',
    }

    constructor(private service: ContactFormService, private router: Router, private animationBuilder: AnimationBuilder,
        private animmationService: AnimationService) {
    }

    ngOnInit(): void {
        this.testimonialSlides[0] = {
            id: 0,
            src: './assets/index/image/quote1.png',
            title: 'Aston and Mark did a great job cleaning up my overgrown lawn which hadn\'t been mowed for months',
            name: 'Billy Brown',
            location: 'Dannemora',
        }
        this.testimonialSlides[1] = {
            id: 1,
            src: './assets/index/image/quote1.png',
            title: 'The team did a great job landscaping my development before it went to market',
            name: 'Kirsty Merriman',
            location: 'Sunnyvale',
        }

        this.landingSlides[0] = {
            id: 0,
            src: './assets/index/image/one.jpg',
            line1: 'Mr Grass Master',
            line2: 'East Auckland garden maintenance specialists'
        }
        this.landingSlides[1] = {
            id: 1,
            src: './assets/index/image/two.jpg',
            line1: 'We\'re here to help',
            line2: 'get your outdoor areas looking great'
        }
        this.landingSlides[2] = {
            id: 2,
            src: './assets/index/image/three.jpg',
            line1: 'Giving you more time',
            line2: 'to enjoy doing what you love most'
        }

        this.contactForm = new FormGroup({
            first_name: new FormControl(this.formValues.first_name, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                Validators.pattern('[^ ]+'),
            ]),
            last_name: new FormControl(this.formValues.last_name, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                Validators.pattern('[^ ]+'),
            ]),
            email: new FormControl(this.formValues.email, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                Validators.email,
            ]),
            phone: new FormControl(this.formValues.phone, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                Validators.pattern('[^ ]+'),
            ]),
            address_line1: new FormControl(this.formValues.address_line1, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
            ]),
            address_line2: new FormControl(this.formValues.address_line2, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
            ]),
            message: new FormControl(this.formValues.message, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1000),
            ]),
        })
    }

    ngAfterViewInit() {
        this.observerable = new IntersectionObserver(
                (observers) => {
                    observers.forEach((observer) => {
                        if (observer.isIntersecting) {
                            //animation code
                            const factory = this.animationBuilder.build(this.animmationService.getAnimation(observer.target.id));
                            this.player = factory.create(observer.target);
                            this.player.play();
                            this.observerable!.unobserve(observer.target)
                        }
                    });
                },
                { threshold: 0 }
            );
        this.elmnt.forEach((e, index) => {
            this.observerable!.observe(e.nativeElement);
        })
    }

    submitForm() {
        setTimeout(() => {
            document.getElementById('submit-button')?.blur()
        }, 500)

        if (this.contactForm.valid && this.captchaResponse) {
            const contact = new Contact()
            contact.first_name = this.contactForm.get('first_name')!.value
            contact.last_name = this.contactForm.get('last_name')!.value
            contact.email = this.contactForm.get('email')!.value
            contact.phone = this.contactForm.get('phone')!.value
            contact.address_line1 = this.contactForm.get('address_line1')!.value
            contact.address_line2 = this.contactForm.get('address_line2')!.value
            contact.message = this.contactForm.get('message')!.value

            this.service.submitContactForm(contact).subscribe({
                next: (data) => {
                    this.captchaResponse = false
                    this.repactcha?.reset()
                    this.resetForm()
                }, error: (err) => {
                    this.submitted = true
                },
            })
        } else {
            this.submitted = true;
        }
    }

    submitCaptcha(response: any) {
        //timeout or repactcha.reset() produces a null response
        if (response == null) {
            this.captchaResponse = false;
        } else {
            this.service.submitRecaptcha(response).subscribe({
                next: (data) => {
                    this.captchaResponse = true
                }, error: (err) => {
                    //allow form submission anyway - errors are logged in ContactFormService
                    this.captchaResponse = true
                },
            })
        }
    }

    resetForm() {
        this.contactForm.reset()
        this.submitted = false
        this.router.navigate(['/index'], { skipLocationChange: true })
            .then(r => true)
    }

    get first_name() {
        return this.contactForm.get('first_name')
    }

    get last_name() {
        return this.contactForm.get('last_name')
    }

    get email() {
        return this.contactForm.get('email')
    }

    get phone() {
        return this.contactForm.get('phone')
    }

    get address_line1() {
        return this.contactForm.get('address_line1')
    }

    get address_line2() {
        return this.contactForm.get('address_line2')
    }

    get message() {
        return this.contactForm.get('message')
    }

    ngOnDestroy(): void {
        this.observerable?.disconnect(); //removes all observers
    }
}
