import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appActiveHighlight]',
  standalone: true,
})
export class ActiveHighlightDirective {
  @Input() appActiveHighlight = false;

  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('mouseenter') onMouseEnter() {
    if (this.appActiveHighlight) {
      this.renderer.addClass(this.element.nativeElement, 'highlight');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.element.nativeElement, 'highlight');
  }
}
