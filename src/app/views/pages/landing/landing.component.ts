
import { HttpErrorResponse } from '@angular/common/http'
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, forwardRef } from '@angular/core'
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { catchError, debounceTime, fromEvent, Observable, of, Subscription, switchMap, timer } from 'rxjs'
import { AnimationService } from './service/animation.service'
import { CarouselService } from './service/carousel.service'
import { ContactFormService, SubmitFormResult } from './service/contact-form.service'
import { Contact } from './dto/contact'
import { cilCheck } from '@coreui/icons'
import { AnimationBuilder, AnimationPlayer } from '@angular/animations'

export const ASYNC_DELAY = 1000

export enum Status {
    Idle = 'Idle',
    Success = 'Success',
    Error = 'Error'
}

@Component({
    selector: 'landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LandingComponent),
            multi: true,
        },
    ],
})
export class LandingComponent implements OnInit, OnDestroy {
    @ViewChildren('animation', { read: ElementRef }) private animationElement!: QueryList<ElementRef<HTMLElement>>
    @ViewChild('modal', { static: true }) modal!: ElementRef

    @ViewChild('firstName', { static: true }) firstNameInput!: ElementRef
    public firstNameValid: boolean | undefined
    @ViewChild('lastName', { static: true }) lastNameInput!: ElementRef
    public lastNameValid: boolean | undefined
    @ViewChild('email', { static: true }) emailInput!: ElementRef
    public emailValid: boolean | undefined
    @ViewChild('phone', { static: true }) phoneInput!: ElementRef
    public phoneValid: boolean | undefined
    @ViewChild('addressLine1', { static: true }) addressLine1Input!: ElementRef
    public addressLine1Valid: boolean | undefined
    @ViewChild('addressLine2', { static: true }) addressLine2Input!: ElementRef
    public addressLine2Valid: boolean | undefined
    @ViewChild('message', { static: true }) messageInput!: ElementRef
    public messageValid: boolean | undefined

    public firstName$: Subscription | undefined
    public lastName$: Subscription | undefined
    public email$: Subscription | undefined
    public phone$: Subscription | undefined
    public addressLine1$: Subscription | undefined
    public addressLine2$: Subscription | undefined
    public message$: Subscription | undefined

    public status: Status
    public modalVisible: boolean
    readonly faCircleExclamation  = faCircleExclamation
    readonly faCircleCheck  = faCircleCheck

    private _testimonialSlides: any[] = new Array(2).fill({ id: -1, src: '', title: '', name: '', location: '' })
    private _landingSlides: any[] = new Array(3).fill({ id: -1, src: '', line1: '', line2: '' })

    public _contactForm: FormGroup
    private formValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        message: '',
    }

    private observerable: IntersectionObserver | undefined
    private _icons = { cilCheck }
    private player!: AnimationPlayer

    constructor(private contactFormService: ContactFormService, private router: Router, private animationBuilder: AnimationBuilder,
        private animmationService: AnimationService, private carouselService: CarouselService) {
        this._contactForm = new FormGroup({
            first_name: new FormControl(this.formValues.first_name, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(30),
                    Validators.pattern('[a-zA-Z ]+'),
                ],
                updateOn: 'change',
            }),
            last_name: new FormControl(this.formValues.last_name, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(30),
                    Validators.pattern('[a-zA-Z ]+'),
                ],
                updateOn: 'change',
            }),
            email: new FormControl(this.formValues.email, {
                validators: [
                Validators.required,
                Validators.maxLength(50),
                Validators.email,
                ],
                updateOn: 'change',
            }),
            phone: new FormControl(this.formValues.phone, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(30),
                    Validators.pattern('[0-9]+'),
                ],
                updateOn: 'change',
            }),
            address_line1: new FormControl(this.formValues.address_line1, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100),
                    Validators.pattern('[0-9a-zA-Z ]+'),
                ],
                updateOn: 'change',
            }),
            address_line2: new FormControl(this.formValues.address_line2, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100),
                    Validators.pattern('[0-9a-zA-Z ]+'),
                ],
                updateOn: 'change',
            }),
            message: new FormControl(this.formValues.message, {
                validators: [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1000),
                    Validators.pattern('[0-9a-zA-Z ]+'),
                ],
                updateOn: 'change',
            })
        })

        this.status = Status.Idle
        this.modalVisible = false
    }

    ngOnInit(): void {
        this._landingSlides = this.carouselService.landingSlides
        this._testimonialSlides = this.carouselService.testimonialSlides
    }

    ngAfterViewInit() {
        this.observerable = new IntersectionObserver(
            (observers) => {
                observers.forEach((observer) => {
                    if (observer.isIntersecting) {
                        //animation code
                        const factory = this.animationBuilder.build(this.animmationService.getAnimation(observer.target.id))
                        this.player = factory.create(observer.target)
                        this.player.play()
                        this.observerable!.unobserve(observer.target)
                    }
                })
            },
            { threshold: 0 },
        )

        this.animationElement.forEach((e, index) => {
            this.observerable!.observe(e.nativeElement)
        })

        this.firstName$ = fromEvent(this.firstNameInput.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.firstNameInput.nativeElement.value.trim()
                const valid = this._contactForm.controls['first_name'].valid
                if (value.length == 0) {
                    this.firstNameValid = undefined
                } else if (valid) {
                    this.firstNameValid = true
                } else {
                    this.firstNameValid = false
                }
            })

        this.lastName$ = fromEvent(this.lastNameInput.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.lastNameInput.nativeElement.value.trim()
                const valid = this._contactForm.controls['last_name'].valid
                if (value.length == 0) {
                    this.lastNameValid = undefined
                } else if (valid) {
                    this.lastNameValid = true
                } else {
                    this.lastNameValid = false
                }
            })

        this.email$ = fromEvent(this.emailInput.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.emailInput.nativeElement.value.trim()
                const valid = this._contactForm.controls['email'].valid
                if (value.length == 0) {
                    this.emailValid = undefined
                } else if (valid) {
                    this.emailValid = true
                } else {
                    this.emailValid = false
                }
            })

        this.phone$ = fromEvent(this.phoneInput.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.phoneInput.nativeElement.value.trim()
                const valid = this._contactForm.controls['phone'].valid
                if (value.length == 0) {
                    this.phoneValid = undefined
                } else if (valid) {
                    this.phoneValid = true
                } else {
                    this.phoneValid = false
                }
            })

        this.addressLine1$ = fromEvent(this.addressLine1Input.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.addressLine1Input.nativeElement.value.trim()
                const valid = this._contactForm.controls['address_line1'].valid
                if (value.length == 0) {
                    this.addressLine1Valid = undefined
                } else if (valid) {
                    this.addressLine1Valid = true
                } else {
                    this.addressLine1Valid = false
                }
            })

        this.addressLine2$ = fromEvent(this.addressLine2Input.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.addressLine2Input.nativeElement.value.trim()
                const valid = this._contactForm.controls['address_line2'].valid
                if (value.length == 0) {
                    this.addressLine2Valid = undefined
                } else if (valid) {
                    this.addressLine2Valid = true
                } else {
                    this.addressLine2Valid = false
                }
            })

        this.message$ = fromEvent(this.messageInput.nativeElement, 'input')
            .pipe(debounceTime(1000))
            .subscribe(() => {
                const value = this.messageInput.nativeElement.value.trim()
                const valid = this._contactForm.controls['message'].valid
                if (value.length == 0) {
                    this.messageValid = undefined
                } else if (valid) {
                    this.messageValid = true
                } else {
                    this.messageValid = false
                }
            })

        const inputs = document.querySelectorAll('input');

        inputs.forEach((input) => {
            const observer = new MutationObserver(() => {
                this._contactForm.updateValueAndValidity(); // Update the form control
            });

            observer.observe(input, {
                attributes: true, // Detect changes in the DOM attributes
                attributeFilter: ['value'], // Focus only on the value attribute
            });
        });

        /* No longer used - routes to landing page and then scrolls to a section, section value passed from template */
        // this.fragService.getFragment().subscribe((frag) => {
        //     setTimeout(() => {
        //         const element: HTMLElement | null = document.getElementById(frag);
        //         element?.scrollIntoView({ behavior: 'smooth' });
        //     }, 500);
        //
        // });
    }

    submitForm() {
        setTimeout(() => {
            document.getElementById('submit-button')?.blur()
        }, 500)

        if (this._contactForm.valid) {
            const contact = new Contact()
            contact.first_name = this._contactForm.get('first_name')!.value
            contact.last_name = this._contactForm.get('last_name')!.value
            contact.email = this._contactForm.get('email')!.value
            contact.phone = this._contactForm.get('phone')!.value
            contact.address_line1 = this._contactForm.get('address_line1')!.value
            contact.address_line2 = this._contactForm.get('address_line2')!.value
            contact.message = this._contactForm.get('message')!.value

            timer(ASYNC_DELAY).pipe(
                switchMap((delay: 0) => this.getToken()),
                switchMap((token: string) => this.contactFormService.submitRecaptcha(token)),
                switchMap((score: number | HttpErrorResponse) =>
                    (score instanceof HttpErrorResponse || score < 0.7) ? of('Error') : this.contactFormService.submitContactForm(contact)),
                catchError(() => of('Error')),
            ).subscribe({
                next: (value: string | SubmitFormResult) => {
                    if (value.constructor === SubmitFormResult && value.outcome) {
                        this.status = Status.Success
                    } else {
                        this.status = Status.Error
                    }
                },
                error: () => {
                    this.status = Status.Error
                },
                complete: () => {
                    this.toggleModalVisibility()
                },
            })
        }
    }

    toggleModalVisibility() {
        this.modalVisible = !this.modalVisible
    }

    /*
     Modal fucnction
     event: true when modal switched from invisible to visible
     false when modal switched from visible to invisible
     */
    handleChange(event: boolean) {
        if (!event){
            this._contactForm.reset()
            this.firstNameValid = undefined;
            this.lastNameValid = undefined;
            this.emailValid = undefined;
            this.phoneValid = undefined;
            this.addressLine1Valid = undefined;
            this.addressLine2Valid = undefined;
            this.messageValid = undefined;
        }
    }

    //Method required for testing
    public getToken(): Observable<string> {
        return this.contactFormService.getToken()
    }

    ngOnDestroy(): void {

        this.player?.destroy();
        this.observerable?.disconnect() //removes all observers
        this.firstName$?.unsubscribe();
        this.lastName$?.unsubscribe();
        this.email$?.unsubscribe();
        this.phone$?.unsubscribe();
        this.addressLine1$?.unsubscribe();
        this.addressLine2$?.unsubscribe();
        this.message$?.unsubscribe();
    }

    get testimonialSlides(): any[] {
        return this._testimonialSlides
    }

    get landingSlides(): any[] {
        return this._landingSlides
    }

    get icons(): { cilCheck: string[] } {
        return this._icons
    }
}
