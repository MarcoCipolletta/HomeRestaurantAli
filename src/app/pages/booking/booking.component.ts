import emailjs from 'emailjs-com';
import { iBooking } from '../../interfacces/iBooking';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  //inizio variabili per il calendario e prenotazioni
  @ViewChild('dp') datepicker!: NgbDatepicker;
  today: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  maxDate: NgbDateStruct = {
    year: new Date().getFullYear() + 2,
    month: new Date().getMonth() + 1,
    day: new Date(this.today.year + 1, this.today.month, 0).getDate(),
  };
  chooseDate: NgbDateStruct | null = null;
  time: string = '';
  people: number | null = null;
  showDatepicker: boolean = true;
  reservations: iBooking[] = [];
  isLoading: boolean = true;

  // Inizio variabili e metodi per i toast
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

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    //Prende le prenotazioni salvate nel database e le carica nell'array
    this.firestore
      .collection<iBooking>('reservations')
      .get()
      .subscribe((response) => {
        console.log(response);

        this.reservations = response.docs.map((res) => {
          console.log(res);
          console.log(res.data());

          return { ...res.data(), id: res.id };
        });
        if (this.reservations.length > 0) {
          this.datepicker.navigateTo({
            year: new Date().getFullYear() + 1,
            month: this.today.month,
          });
          this.datepicker.navigateTo(this.today);
        }
        this.isLoading = false;
      });

    //ogni modifica nel database viene rilevata e vengono aggiornate le prenotazioni anche in locale
    this.firestore
      .collection<iBooking>('reservations')
      .valueChanges()
      .subscribe((reservations) => {
        this.reservations = reservations;
      });
  }

  //serve a disabilitare le date nel calendario(weekend, giorni passati e giorni già occupati)
  isDisabled = (date: NgbDateStruct) => {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    const isBeforeToday =
      date.year < this.today.year ||
      (date.year === this.today.year && date.month < this.today.month) ||
      (date.year === this.today.year &&
        date.month === this.today.month &&
        date.day <= this.today.day);
    const booked = this.reservations.some(
      (res) =>
        res.date.year === date.year &&
        res.date.month === date.month &&
        res.date.day === date.day
    );

    return day === 0 || day === 6 || isBeforeToday || booked;
  };

  // variabili per emailJs
  emailJsSvcID: string = 'service_b6iq63m';
  emailJsUserID: string = 'XAuf-oK7raE7hEWp6';

  book(form: NgForm) {
    if (form.valid) {
      const reservation: Partial<iBooking> = {
        date: form.value.chooseDate,
        time: form.value.time,
        people: form.value.people,
        email: form.value.email,
        fullName: form.value.fullName,
        phone: form.value.phone,
      };
      console.log(form.value);

      //inizio send firebase database

      this.firestore
        .collection('reservations')
        .add(reservation)
        .then((res) => {
          const resId = res.id;

          //invio email con emailJs conferma prenotazione
          emailjs
            .send(
              this.emailJsSvcID,
              'template_b8m6e0s',
              {
                date: reservation.date,
                time: reservation.time,
                people: reservation.people,
                fullName: reservation.fullName,
                phone: reservation.phone,
                email: reservation.email,
                id: resId,
              },
              this.emailJsUserID
            )
            .then((res) => {
              if (res.status > 299) {
                throw new Error('Email not send');
              }
            })
            .catch((err) => {
              console.log(err);
            });

          this.showToast(this.successToast);
          form.reset({ time: '', people: null });
          this.datepicker.navigateTo({
            year: new Date().getFullYear() + 1,
            month: this.today.month,
          });
          this.datepicker.navigateTo(this.today);
          this.chooseDate = this.today;
          console.log(this.chooseDate);

          setTimeout(() => {
            this.chooseDate = null;
          }, 1);
        });

      //fine send firebase database
    } else {
      if (
        !form.controls['fullName']?.valid &&
        !form.controls['phone']?.valid &&
        !form.controls['email']?.valid &&
        !form.controls['people']?.valid &&
        !form.controls['time']?.valid &&
        !form.controls['chooseDate']?.valid
      ) {
        this.errorToastMessage = 'Please fill all the fields with valid data';
      } else {
        if (!form.controls['fullName']?.valid) {
          this.errorToastMessage = 'Please enter your name';
        }
        if (!form.controls['phone']?.valid) {
          this.errorToastMessage = 'Please enter your phone';
        }
        if (!form.controls['email']?.valid) {
          if (!form.controls['email']?.touched) {
            this.errorToastMessage = 'Please enter your email';
          } else {
            this.errorToastMessage = 'Please enter a valid email';
          }
        }
        if (!form.controls['people']?.valid) {
          this.errorToastMessage = 'Please enter the number of people';
        }
        if (!form.controls['time']?.valid) {
          this.errorToastMessage = 'Please select a time';
        }
        if (!form.controls['chooseDate']?.valid) {
          this.errorToastMessage = 'Please select a date';
        }
      }

      this.showToastDanger(this.unSuccessToast);
    }
  }
}
