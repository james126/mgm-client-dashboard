import { Injectable } from '@angular/core';
import _default from 'chart.js/dist/plugins/plugin.tooltip'
import { CustomAnimationBuilderService } from './custom-animation-builder.service'
import animationData from './animationData.json'
import { style, animate } from '@angular/animations'

@Injectable()
export class AnimationService {
   animations: Map<string, CustomAnimationBuilderService> = new Map();

  constructor(private service: CustomAnimationBuilderService) {
    const json = JSON.parse(JSON.stringify(animationData));

    Object.keys(json).forEach((key) => {
        let a = new CustomAnimationBuilderService();
        a.trigger = key;
        a.beforeOpacity = json[key][0].opacity;
        a.beforeTransform = json[key][0].transform;
        a.timing = json[key][1].timing;
        a.afterOpacity = json[key][2].opacity;
        a.afterTransform = json[key][2].transform;
        this.animations.set(key, a);
    })
  }

    getAnimation(elementId: string) {
        let a: CustomAnimationBuilderService | undefined = this.animations.get(elementId)

        return [
            style({ opacity: Number(`${a?.beforeOpacity}`), transform: `${a?.beforeTransform}` }),
            animate(`${a?.timing}`, style({ opacity: Number(`${a?.afterOpacity}`), transform: `${a?.afterTransform}` }))
        ];
    }
}

