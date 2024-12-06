import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrl: './contatti.component.scss',
})
export class ContattiComponent {
  toastSvc = inject(ToastService);
  @ViewChild('successToast') successToast!: TemplateRef<any>;
  @ViewChild('unSuccessToast') unSuccessToast!: TemplateRef<any>;
  errorToastMessage!: string;

  showToast(template: TemplateRef<any>) {
    this.toastSvc.show({
      template,
      classname: 'bg-Success text-light',
      delay: 5000,
    });
  }
  showToastDanger(template: TemplateRef<any>) {
    this.toastSvc.show({
      template,
      classname: 'bg-unSuccess text-light',
      delay: 5000,
    });
  }
  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const x = event.clientX - button.offsetLeft;
    const y = event.clientY - button.offsetTop;

    const ripples = document.createElement('span');
    ripples.classList.add('prova');
    ripples.style.left = `${x}px`;
    ripples.style.top = `${y}px`;

    button.appendChild(ripples);

    setTimeout(() => {
      ripples.remove();
    }, 600);
  }

  center: google.maps.LatLngLiteral = {
    // Specifica le coordinate

    lat: 45.47602768250262,
    lng: 9.194341658087021,
  };
  zoom = 17; // Imposta il livello di zoom
  linkMap: string = `https://www.google.com/maps/search/?api=1&query=${this.center.lat},${this.center.lng}`;
  markerTitle = 'The Secret Plate';
  customIcon: google.maps.Icon | undefined;

  ngOnInit() {
    this.customIcon = {
      url: 'markerMap.png', // URL dell'icona
      scaledSize: new google.maps.Size(60, 60), // Usa google.maps.Size
      origin: new google.maps.Point(5, -7), // Usa google.maps.Point
    };
  }
  onMarkerClick() {
    window.open(this.linkMap, '_blank'); // Apre Google Maps in una nuova scheda
  }

  emailJsSvcID: string = 'service_apgylmq';
  emailJsUserID: string = 'QehYFaW0_V3QCPPdx';
  sendEmail(contactForm: any) {
    // event.preventDefault();

    const formData = {
      name: contactForm.value.name,
      email: contactForm.value.email,
      message: contactForm.value.message,
    };

    const { name, email, message } = formData;

    // Primo invio: invia il messaggio a te stesso

    if (
      contactForm.controls['name']?.valid &&
      contactForm.controls['email']?.valid &&
      contactForm.controls['message']?.valid
    ) {
      emailjs
        .send(
          this.emailJsSvcID,
          'template_hgy14b7',
          {
            name: name,
            email: email,
            message: message,
          },
          this.emailJsUserID
        )
        .then(
          (response) => {
            console.log(
              'Email inviata con successo!',
              response.status,
              response.text
            );
          },
          (error) => {
            console.error('Errore nell’invio dell’email:', error);
          }
        );

      // Secondo invio: invia il messaggio di conferma all'utente
      emailjs
        .send(
          this.emailJsSvcID,
          'template_s7e9u1s',
          {
            name: name,
            email: email,
            message: message,
          },
          this.emailJsUserID
        )
        .then(
          (response) => {
            console.log(
              'Email inviata con successo!',
              response.status,
              response.text
            );
          },
          (error) => {
            console.error('Errore nell’invio dell’email:', error);
          }
        );

      contactForm.reset();
      this.showToast(this.successToast);
    } else {
      if (
        !contactForm.controls['name']?.valid &&
        !contactForm.controls['email']?.valid &&
        !contactForm.controls['message']?.valid
      ) {
        this.errorToastMessage = 'Please fill all the fields';
      } else {
        // Controllo specifico per ogni campo

        // Verifica campo "name"
        if (!contactForm.controls['name']?.valid) {
          this.errorToastMessage = 'Please enter your name';
        }

        // Verifica campo "email"
        if (!contactForm.controls['email']?.valid) {
          if (!contactForm.controls['email']?.touched) {
            this.errorToastMessage = 'Please enter your email';
          } else {
            this.errorToastMessage = 'Please enter a valid email';
          }
        }

        // Verifica campo "message"
        if (!contactForm.controls['message']?.valid) {
          this.errorToastMessage = 'Please enter your message';
        }
      }
      this.showToastDanger(this.unSuccessToast);
    }
  }
}
