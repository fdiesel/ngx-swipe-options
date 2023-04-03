import {AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {NgxSwipeOptionsService} from "./ngx-swipe-options.service";
import {Subscription} from "rxjs";

@Component({
  selector: '[ngx-swipe-options]',
  templateUrl: './ngx-swipe-options.component.html',
  styleUrls: [
    './ngx-swipe-options.component.sass'
  ]
})
export class NgxSwipeOptionsComponent implements AfterViewInit, OnDestroy {
  constructor(private readonly renderer: Renderer2,
              private readonly service: NgxSwipeOptionsService) {
  }

  @ViewChild('boundary') boundaryElement!: ElementRef;
  @ViewChild('drag') dragElement!: ElementRef;
  @ViewChild('center') centerElement!: ElementRef;
  @ViewChild('before') beforeElement!: ElementRef;
  @ViewChild('after') afterElement!: ElementRef;

  swipe$$!: Subscription;

  centerWidth = 0;
  beforeWidth = 0;
  afterWidth = 0;

  ngAfterViewInit(): void {
    this.beforeWidth = this.beforeElement.nativeElement.offsetWidth;
    this.afterWidth = this.afterElement.nativeElement.offsetWidth;
    this.boundaryElement.nativeElement.scroll({
      top: 0,
      left: this.beforeWidth
    });
    this.swipe$$ = this.service.swipe.subscribe(() => {
      if (this.position !== 'center') {
        this.moveTo('center');
      }
    });
  }

  position: 'before' | 'center' | 'after' = 'center';

  moveTo(position: typeof this.position): void {
    if (position !== 'center') {
      this.service.swipe.next();
    }
    this.position = position;
    switch (position) {
      case 'before':
        this.boundaryElement.nativeElement.scroll({
          top: 0,
          left: this.beforeWidth + this.afterWidth,
          behavior: 'smooth'
        });
        break;
      case 'center':
        this.boundaryElement.nativeElement.scroll({
          top: 0,
          left: this.beforeWidth,
          behavior: 'smooth'
        });
        break;
      case 'after':
        this.boundaryElement.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        break;
    }
  }

  private scrollTimeout: any;
  private doScrollSnap = true;

  blockScrollSnap(): void {
    this.doScrollSnap = false;
  }

  scrollSnap(): void {
    if (this.doScrollSnap) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.snap();
      }, 100)
    }
  }

  snap(): void {
    this.doScrollSnap = true;
    const scrollLeft = this.boundaryElement.nativeElement.scrollLeft;
    if (scrollLeft < this.beforeWidth / 2) {
      this.moveTo('after');
    } else if (scrollLeft > this.beforeWidth + this.afterWidth / 2) {
      this.moveTo('before');
    } else {
      this.moveTo('center');
    }
  }

  ngOnDestroy() {
    this.swipe$$.unsubscribe();
  }
}
