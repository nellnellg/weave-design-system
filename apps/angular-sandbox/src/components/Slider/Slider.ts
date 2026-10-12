// GENERATED from Slider.contract.json + Slider.angular.json. Do not edit by hand.
// Regenerate: node packages/angular/src/emit/emit.mjs Slider --out <dir>
//
// Chooses a number from a continuous range where the approximate value matters more than the exact one — a volume, a zoom level, a price ceiling.

import {
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  input,
  model,
  viewChild,
} from '@angular/core';
import { snap, useRangeControl } from '@weave/angular/behavior';
import type { RangeOptions } from '@weave/angular/behavior';

// Transcribed from Slider.contract.json: the `range` block, plus min/max/step from
// the `value` state. The cases this commits us to are in
// @weave/contracts/conformance/range-stepping.json.
const RANGE: RangeOptions = {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  pageStep: 10,
};

@Component({
  // The binding's `element` becomes a SELECTOR, because an Angular component attaches
  // to an element rather than rendering one. A consumer writes <div weaveSlider>.
  selector: 'div[weaveSlider]',
  exportAs: 'weaveSlider',
  // ViewEncapsulation.None IS LOAD-BEARING. Angular's default rewrites every selector in
  // these stylesheets to include a generated _ngcontent attribute, which would scope them
  // to this component and break the one property the whole system rests on: that a theme
  // file selecting on [data-weave-component] dresses the React, Vue and Angular builds
  // alike. It fails silently — the CSS loads, matches nothing, and the component renders
  // unstyled.
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./Slider.structure.css', './Slider.theme.css'],
  host: {
    '[attr.role]': "'slider'",
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-weave-state-dragging]': 'range.dragging() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'announcedValue()',
    '[style.--weave-fraction]': 'range.fraction()',
    'data-weave-component': 'Slider',
    'data-weave-part': 'root',
    '(keydown)': 'range.onKeyDown($event)',
    '(pointerdown)': 'range.onPointerDown($event)',
    '(pointermove)': 'range.onPointerMove($event)',
    '(pointerup)': 'range.onPointerUp($event)',
    '(pointercancel)': 'range.onPointerUp($event)',
  },
  template: `
    <div #track data-weave-part="track"></div>
    <div data-weave-part="fill"></div>
    <div data-weave-part="thumb"></div>
  `,
})
export class Slider {
  /** The platform's own disabled state. Removed from the focus order and cannot be moved. */
  readonly disabled = input<boolean>(false);
  /** The chosen number. Bounded and stepped — facts that live nowhere else, and that no boolean or enumeration can carry. Two-way: `[(value)]`. */
  readonly value = model<number>(0);

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /** Announce the value the contract says this holds, not the one it was handed: a
   *  controlled value may arrive off-step, and the thumb would be drawn at one
   *  number and announced as another. */
  protected readonly announcedValue = computed(() => snap(this.value(), RANGE));

  protected readonly range = useRangeControl(
    RANGE,
    () => this.value(),
    (next: number) => this.value.set(next),
    () => Boolean(this.disabled()),
    () => this.track()?.nativeElement ?? null,
  );
}
