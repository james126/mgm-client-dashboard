import { Component, OnInit, Renderer2, RendererFactory2, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Scripts, ScriptStore } from './script.store'
import { ContactFormService } from "./service/contact-form.service";
import { Contact } from './dto/contact';
import { RecaptchaComponent } from 'ng-recaptcha';
import { cilCheck } from '@coreui/icons';

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
  styleUrls: [
      '../../assets/index/css/google-web-font.css',
    '../../assets/index/lib/animate/animate.min.css',
     '../../assets/index/css/google-web-font.css',
    '../../assets/index/css/style2.css'
  ],
  providers: [ContactFormService],
})
export class IndexComponent implements OnInit {
  @ViewChild('recaptcha', { static: false, read: RecaptchaComponent }) repactcha?: RecaptchaComponent;
  siteKey: string = environment.siteKey;
  captchaResponse: boolean = false;
  service: ContactFormService;
  router: Router;
  submitted: boolean = false;
  contactForm!: FormGroup;
  private scripts: Scripts[] = [];
  slides: any[] = new Array(2).fill({id: -1, src: '', title: '', name: '', location: ''});
  icons = { cilCheck };

  formValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    message: ''
  };


  private renderer: Renderer2;
  constructor(service: ContactFormService, router: Router, private rendererFactory: RendererFactory2) {
    this.service = service;
    this.router = router;
    this.renderer = rendererFactory.createRenderer(null, null);

    ScriptStore.forEach((script: any) => {
      this.scripts.push(script);
    });
  }

  ngOnInit(): void {
    this.scripts.forEach((obj : Scripts) => {
      const script = this.renderer.createElement('script');
      script.src = obj.src;
      // this.renderer.appendChild(document.head, script);
      document.getElementsByTagName('head')[0].appendChild(script);

      this.slides[0] = {
        id: 0,
        src: './assets/index/image/quote1.png',
        title: 'Aston and Mark did a great job cleaning up my overgrown lawn which hadn\'t been mowed for months',
        name: 'Billy Brown',
        location: 'Dannemora'
      };
      this.slides[1] = {
        id: 1,
        src: '/assets/index/image/quote1.png',
        title: 'The team did a great job landscaping my development before it went to market',
        name: 'Kirsty Merriman',
        location: 'Sunnyvale'
      }
    });

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
        Validators.email
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
      ])
    });
  }

  submitCaptcha(captchaResponse: any) {
    this.service.submitRecaptcha(captchaResponse).subscribe({
      next: (data) => {
        this.captchaResponse = true;
      }, error: (err) => {
        //allow form submission anyway - errors are logged in ContactFormService
        this.captchaResponse = true;
      }
    });
  }

  submitForm() {
    setTimeout(() => {
      document.getElementById("submit-button")?.blur();
    }, 500);

    if (this.contactForm.valid && this.captchaResponse) {
      const contact = new Contact();
      contact.first_name = this.contactForm.get('first_name')!.value;
      contact.last_name = this.contactForm.get('last_name')!.value;
      contact.email = this.contactForm.get('email')!.value;
      contact.phone = this.contactForm.get('phone')!.value;
      contact.address_line1 = this.contactForm.get('address_line1')!.value;
      contact.address_line2 = this.contactForm.get('address_line2')!.value;
      contact.message = this.contactForm.get('message')!.value;

      this.service.submitContactForm(contact).subscribe({
        next: (data) => {
          this.captchaResponse = false;
          this.repactcha?.reset();
          this.resetForm()
        }, error: (err) => {
          this.submitted = true;
        }
      });
    }
  }

  resetForm() {
    this.contactForm.reset();
    this.submitted = false;
    this.router.navigate(['/index'], { skipLocationChange: true })
        .then(r => true );
  }

  get first_name() {
    return this.contactForm.get('first_name');
  }

  get last_name() {
    return this.contactForm.get('last_name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get address_line1() {
    return this.contactForm.get('address_line1');
  }

  get address_line2() {
    return this.contactForm.get('address_line2');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
