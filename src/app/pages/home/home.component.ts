import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  btnOver(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    const rect = button.getBoundingClientRect();

    const x = event.pageX - rect.left;
    const y = event.pageY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);

    button.addEventListener('animationend', () => {
      button.style.removeProperty('--x');
      button.style.removeProperty('--y');
    });
  }
  btnOver2(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    const rect = button.getBoundingClientRect();

    const x = event.pageX - button.offsetLeft;
    const y = event.pageY - button.offsetTop;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);

    button.addEventListener('animationend', () => {
      button.style.removeProperty('--x');
      button.style.removeProperty('--y');
    });
  }
}
