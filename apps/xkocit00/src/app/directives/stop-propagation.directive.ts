import { Directive, HostListener } from '@angular/core';

/**
 * Directive to stop propagation of the event
 * Used to prevent the click event from bubbling up the DOM tree
 * and being caught by parent elements
 *
 * @author Tomáš Kocí
 */
@Directive({
  selector: '[appStopPropagation]',
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
