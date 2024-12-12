import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

/**
 * Custom overlay container
 *
 * @author Tomáš Kocí
 */
@Injectable({ providedIn: 'root' })
export class CustomOverlayContainer extends OverlayContainer {
  protected override _createContainer(): void {
    super._createContainer();
    this._containerElement.classList.add('custom-overlay-container');
  }
}
