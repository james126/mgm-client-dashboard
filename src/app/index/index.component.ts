import { HttpResponse } from '@angular/common/http'
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, forwardRef } from '@angular/core'
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AnimationService } from './service/animation.service'
import { CarouselService } from './service/carousel.service'
import { ContactFormService } from './service/contact-form.service'
import { Contact } from './dto/contact'
import { RecaptchaComponent } from 'ng-recaptcha'
import { cilCheck } from '@coreui/icons'
import { AnimationBuilder, AnimationPlayer } from '@angular/animations'

@Component({
    selector: 'mgm-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IndexComponent),
            multi: true,
        }
    ]
})
export class IndexComponent implements OnInit, OnDestroy {
    @ViewChild('recaptcha', { static: false, read: RecaptchaComponent }) private repactcha?: RecaptchaComponent
    @ViewChildren('animation', { read: ElementRef }) private animationElement!: QueryList<ElementRef<HTMLElement>>;

    private _testimonialSlides: any[] = new Array(2).fill({ id: -1, src: '', title: '', name: '', location: '' })
    private _landingSlides: any[] = new Array(3).fill({ id: -1, src: '', line1: '', line2: ''})

    private _contactForm: FormGroup
    private formValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        message: ''
    }

    private observerable: IntersectionObserver | undefined;
    private _icons = { cilCheck }
    private player!: AnimationPlayer;
    private _recaptchaValid: boolean = false
    private _submitted: boolean = false

    constructor(private contactFormService: ContactFormService, private router: Router, private animationBuilder: AnimationBuilder,
        private animmationService: AnimationService, private carouselService: CarouselService) {
        this._contactForm = new FormGroup({
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
            recaptcha: new FormControl(null, [
                Validators.required
            ]),
        })
    }

    ngOnInit(): void {
        this._landingSlides = this.carouselService.landingSlides;
        this._testimonialSlides = this.carouselService.testimonialSlides;
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
        this.animationElement.forEach((e, index) => {
            this.observerable!.observe(e.nativeElement);
        })
    }

    submitForm() {
        setTimeout(() => {
            document.getElementById('submit-button')?.blur()
        }, 500)

        if (this._contactForm.valid && this._recaptchaValid) {
            const contact = new Contact()
            contact.first_name = this._contactForm.get('first_name')!.value
            contact.last_name = this._contactForm.get('last_name')!.value
            contact.email = this._contactForm.get('email')!.value
            contact.phone = this._contactForm.get('phone')!.value
            contact.address_line1 = this._contactForm.get('address_line1')!.value
            contact.address_line2 = this._contactForm.get('address_line2')!.value
            contact.message = this._contactForm.get('message')!.value

            this.contactFormService.submitContactForm(contact).subscribe({
                next: (data) => {
                    this._recaptchaValid = false
                    this.repactcha?.reset()
                    this.resetForm()
                }, error: (err) => {
                    this._submitted = true
                },
            })
        } else {
            this._submitted = true;
        }
    }

    submitRecaptcha(token: any) {
        //do something here
        //timeout or repactcha.reset() produces a null token
        if (token == null) {
            this._recaptchaValid = false;
        } else {
            this.contactFormService.submitRecaptcha(token).subscribe({
                next: (res) => {
                    const obj = JSON.parse(JSON.stringify(res.body))
                    if (obj["score"] >= 0.7){
                        this._recaptchaValid = true
                    }
                }, error: (err) => {
                    this.contactFormService.error(err);
                    this._recaptchaValid = false
                },
            })
        }
    }

    erroredRecaptcha(token: any) {
        this._recaptchaValid = false;
    }

    resetForm() {
        this._contactForm.reset()
        this._submitted = false
        this.router.navigate(['/index'], { skipLocationChange: true })
            .then(r => true)
    }

    ngOnDestroy(): void {
        this.observerable?.disconnect(); //removes all observers
    }

    get recaptchaValid(): boolean {
        return this._recaptchaValid
    }

    get first_name() {
        return this._contactForm.get('first_name')
    }

    get last_name() {
        return this._contactForm.get('last_name')
    }

    get email() {
        return this._contactForm.get('email')
    }

    get phone() {
        return this._contactForm.get('phone')
    }

    get address_line1() {
        return this._contactForm.get('address_line1')
    }

    get address_line2() {
        return this._contactForm.get('address_line2')
    }

    get message() {
        return this._contactForm.get('message')
    }

    get submitted(): boolean {
        return this._submitted
    }

    get icons(): { cilCheck: string[] } {
        return this._icons
    }

    get contactForm(): FormGroup {
        return this._contactForm
    }

    get testimonialSlides(): any[] {
        return this._testimonialSlides
    }

    get landingSlides(): any[] {
        return this._landingSlides
    }
}
