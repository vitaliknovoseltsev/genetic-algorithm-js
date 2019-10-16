'use strict';

class Population {
    constructor(length, weights, genLength, mutation) {
        this.length = length;
        this.weights = weights.map((item) => item);
        this.gens = [];
        this.sumFitnes = null;
        this.genLength = genLength;
        this.couples = [];
        this.mutation = mutation;
    };
    randGens() {
        if (this.gens.length === 0) {
            for (let i = 0; i < this.length; i += 1) {
                const gen = [];
                for (let j = 0; j < this.genLength; j += 1) {
                    gen.push(this.randomInteger(0, 1));
                }
                this.gens.push(new Сhromosome(gen, this.weights));
            }
        }
    };
    countAverageFitnes() {
        this.sumFitnes = this.gens.reduce(function(sum, current) {
            return sum + current.fitnesFun;
        }, 0);
    }
    calcChanceInGen() {
        for (const gen of this.gens) {
            gen.calcChance(this.sumFitnes);
        }
    }
    randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.abs(Math.round(rand));
    }
    randomDouble(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.abs(rand);
    }
    findСouples() {
        // Оператор репродукции
        // (Составление пар родителей методом колеса рулетки)
        this.couples = [];
        for (let i = 0; i < this.length; i += 1) {
            let chanceVal = this.randomDouble(0, 1);
            chanceVal = (chanceVal > 1) ? Math.abs(1 - chanceVal) : chanceVal;
            let chanceCircleVal = 0;
            for (let j = 0; j < this.gens.length; j += 1) {
                chanceCircleVal += this.gens[j].chance;
                if (chanceVal <= chanceCircleVal) {
                    this.couples.push({
                        a: this.gens[i],
                        b: this.gens[j]
                    });
                    break;
                }
            }
        }
    }
    crossover() {
        for (const couple of this.couples) {
            const k = this.randomInteger(0, this.genLength - 1);
            const genA = [];
            const genB = [];
            for (let i = 0; i < this.genLength; i += 1) {
                genA.push((i <= k) ? couple.a.genList[i] : couple.b.genList[i]);
                genB.push((i <= k) ? couple.b.genList[i] : couple.a.genList[i]);
            }
            this.mutate(genA);
            this.mutate(genB);
            this.gens.push(new Сhromosome(genA, this.weights));
            this.gens.push(new Сhromosome(genB, this.weights));
        }
        this.countAverageFitnes();
        this.calcChanceInGen();
    }
    mutate(gen) {
        const mutateChance = this.randomDouble(0, 1);
        if (mutateChance <= this.mutation) {
            const k = this.randomInteger(0, this.genLength - 1);
            gen[k] = (gen[k] === 0) ? 1 : 0;
        }
    }
    selection() { 
        while(this.gens.length !== this.length) {
            const index = this.randomInteger(0, this.genLength - 1);
            if (!this.gens[index].isElite) {
                this.gens.splice(index, 1);
            }
        }
    }
    findElite(count, max) {
        let counter = 0;
        this.gens = this.gens.map((item) => {
            item.isElite = false;
            return item;
        })
        while(counter < count) {
            let elite = null;
            for (let i = 1; i < this.gens.length; i += 1) {
                if (this.gens[i].fitnesFun <= max) {
                    elite = this.gens[i];
                    break; 
                }
            } 
            for (const gen of this.gens) {
                if (!gen.isElite && elite.fitnesFun < gen.fitnesFun && gen.fitnesFun <= max) {
                    elite = gen;
                }
            }
            elite.isElite = true;
            counter += 1;
        }
    }
    getBest(min, max) {
        const best = this.gens.filter((item) => {
            if (item.fitnesFun > min && item.fitnesFun < max) {
                return item;
            }
        })
        return best;
    }
    getOptimal(max) {
        let optimal = null;
        for (let i = 1; i < this.gens.length; i += 1) {
            if (this.gens[i].fitnesFun <= max) {
                optimal = this.gens[i];
                break; 
            }
        }        
        for (let i = 0; i < this.gens.length; i += 1) {
            if (optimal.fitnesFun < this.gens[i].fitnesFun && this.gens[i].fitnesFun <= max) {
                optimal = this.gens[i];
            }
        }
        return optimal;
    }
}