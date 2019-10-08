'use strict';

class Сhromosome {
    constructor(genList, weights) {
        this.genList = genList.map((item) => item);
        this.fitnesFun = null;
        this.chance = null;
        this.calcFitnesFunc(weights);
    }
    calcFitnesFunc(weights) {
        this.fitnesFun = 0;
        for (let i = 0; i < this.genList.length; i += 1) {
            if (this.genList[i] === 1) {
                this.fitnesFun += weights[i];
            }
        }
    }
    calcChance(sum) {
        this.chance = this.fitnesFun/sum;
    }
}