import { Injectable } from '@angular/core';
import _default from 'chart.js/dist/plugins/plugin.tooltip'
import { AnimationBuilderService } from './animation-builder.service'
import animationData from './animationData.json'
import { style, animate } from '@angular/animations'

@Injectable()
export class AnimationService {
   private _animations: Map<string, AnimationBuilderService> = new Map();

  constructor(private service: AnimationBuilderService) {
    const json = JSON.parse(JSON.stringify(animationData));

    Object.keys(json).forEach((key) => {
        let a = new AnimationBuilderService();
        a.trigger = key;
        a.beforeOpacity = json[key][0].opacity;
        a.beforeTransform = json[key][0].transform;
        a.timing = json[key][1].timing;
        a.afterOpacity = json[key][2].opacity;
        a.afterTransform = json[key][2].transform;
        this._animations.set(key, a);
    })
  }

    getAnimation(elementId: string) {
        let a: AnimationBuilderService | undefined = this._animations.get(elementId)

        return [
            style({ opacity: Number(`${a?.beforeOpacity}`), transform: `${a?.beforeTransform}` }),
            animate(`${a?.timing}`, style({ opacity: Number(`${a?.afterOpacity}`), transform: `${a?.afterTransform}` }))
        ];
    }

    get animations(): Map<string, AnimationBuilderService> {
        return this._animations
    }
}

