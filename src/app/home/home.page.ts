import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DomController, GestureController, IonHeader } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgStyle],
})
export class HomePage implements AfterViewInit {

  @ViewChild('box', { read: ElementRef })
  box!: ElementRef;
  @ViewChild(IonHeader, { read: ElementRef })
  header!: ElementRef;
  @ViewChild('boxDos', { read: ElementRef })
  boxDos!: ElementRef;
  power = 0;
  longPressActive = false;

  constructor(private gestureCtrl: GestureController, private domCtrl: DomController) { }

  async ngAfterViewInit() {
    await this.domCtrl.read(() => {
      const headerHeight = this.header.nativeElement.offsetHeight;
      this.setupGesture(headerHeight)
    });
  }

  setupGesture(headerHeight: number) {
    const backgrounds = ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0.5)', 'rgba(255, 0, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 255, 0.5)', 'rgba(0, 255, 255, 0.5)'];
    const DOUBLE_CLICK_THRESHOLD = 500;
    let lastOnStart = 0;
    let currentColor = 'rgba(0, 0, 255, 0.5)';

    const moveGesture = this.gestureCtrl.create({
      el: this.box.nativeElement,
      threshold: 0,
      gestureName: 'move',
      onStart: ev => {
        onStart(this.box);
      },
      onMove: ev => {
        const currentX = ev.currentX;
        const currentY = ev.currentY;
        this.box.nativeElement.style.transform = `translate(${currentX}px, ${currentY - headerHeight}px)`;
      }
    });
    
    const moveGestureDos = this.gestureCtrl.create({
      el: this.boxDos.nativeElement,
      threshold: 0,
      gestureName: 'move',
      onStart: ev => {
        onStart(this.boxDos);
      },
      onMove: ev => {
        const currentX = ev.currentX;
        const currentY = ev.currentY;
        this.boxDos.nativeElement.style.transform = `translate(${currentX}px, ${currentY - headerHeight}px)`;
      }
    });
    
    const onStart = (boxelement:  ElementRef) => {
      const now = Date.now();
      if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
        boxelement.nativeElement.style.setProperty('background', getRandomBackground());
        lastOnStart = 0;
      } else {
        lastOnStart = now;
      }
    }

    const getRandomBackground = () => {
      const options = backgrounds.filter(bg => bg !== currentColor);
      currentColor = options[Math.floor(Math.random() * options.length)];
      return currentColor;
    }

    moveGesture.enable(true);
    moveGestureDos.enable(true);
  }
}
