import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface iBooking {
  date: NgbDateStruct;
  time: string;
  people: number;
  email: string;
  fullName: string;
  phone: string;
  id: string;
}
