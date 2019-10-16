

function renderRowInTable(genList) {
    const table = document.getElementById('table');
    for (let gen of genList) {
        const row = document.createElement('tr');
        if (gen.isElite) row.classList.add('bg-info');
        row.innerHTML = `
            <td>${gen.genList.join()}</td>
            <td>${gen.fitnesFun}</td>
            <td>${gen.chance}</td>`;
        table.appendChild(row);
    }
}
function renderTitlesInTable(title) {
    const table = document.getElementById('table');
    const row = document.createElement('tr');
    row.classList.add('title');
    row.innerHTML = `<td colspan="3">${title}</td>`;
    table.appendChild(row);    
}



const iterationCount = 4;
const weights = [1, 2, 4, 8, 17, 34, 68, 136, 272, 544];
const population = new Population(100, weights, 10, 0.8);

let i = 0;
let stop = false;
while(i !== iterationCount && !stop) {
    renderTitlesInTable(`Итерация #${i + 1}. Начальная популяция`);
    population.randGens();
    population.countAverageFitnes();
    population.calcChanceInGen();
    renderRowInTable(population.gens);
    population.findСouples();
    population.crossover();
    population.findElite(2, 141);
    population.selection();
    renderTitlesInTable('Итоговая популяция');
    renderRowInTable(population.gens);
    const best = population.getBest(139, 141);
    if (best.length !== 0) {
        stop = true;
        console.log('best', best);
        const encObj = encryption(weights, best[0].genList); 
        console.log(encObj);
        const decriptMessage = decript(encObj.total, encObj.q, encObj.r, encObj.w);
        console.log(decriptMessage);
    }
    i += 1;
}
if (!stop) {
    const optimal = population.getOptimal(141);
    console.log('optimal', optimal);
    const encObj = encryption(weights, optimal.genList); 
    console.log(encObj);
    const decriptMessage = decript(encObj.total, encObj.q, encObj.r, encObj.w);
    console.log(decriptMessage);
}


function encryption(weights, gen) {
    const sum = weights.reduce(function(sum, current) {
        return sum + current;
    }, 0);
    const q = primeNumber(sum + 1);
    const r = randomInteger(1, q - 1);
    const b = weights.map((item) => {
        return (item * r) % q;
    });
    let a = 0;
    for (let i = 0; i < b.length; i += 1) {
        a += gen[i] * b[i];
    }
    return {
        w: weights,
        q: q,
        r: r,
        total: a,
    }
};

function decript(a, q, r, weights) {
    const m = modInverse(r, q);
    const v = (a * m) % q;

    let totalSum = v;
    let an = 0;

    let tmpWeights = weights.map((item) => item);
    while(totalSum !== 0) {
        an = findMaxByMin(tmpWeights, totalSum);
        totalSum = totalSum - an;
    }
    tmpWeights = tmpWeights.map((item) => {
        return (item === 0) ? 1 : 0;
    });
    return tmpWeights;
}

function findMaxByMin(arr, min) {
    let maxEl = null;
    for (let i = 0; i < arr.length; i += 1) {
        if (arr[i] <= min) {
            maxEl = arr[i]; break;
        }  
    }
    let index = 0;
    for (let i = 0; i < arr.length; i += 1) {
        if (maxEl <= arr[i] && arr[i] <= min) {
            maxEl = arr[i];
            index = i;
        }
    }
    arr[index] = 0;
    return maxEl;
}
function modInverse(a, m) 
{ 
    a = a % m; 
    for (let x = 1; x < m; x++) 
       if ((a * x) % m == 1) 
          return x; 
    return 1; 
}
function primeNumber(start) {
    let startVal = start;
    let primeVal = null;
    while(!primeVal) {
        if (!isPrime(startVal)) {
           startVal += 1;
        } else {
            primeVal = startVal;
        }
    }
    return startVal;
}
function getCoprimeVal(end) {
    for (let i = 5; i < end; i += 1) {
        if (isCoprime(i, end)) {
            return i;
        }
    }
}
function isPrime(num) {
    for(var i = 2; i < num; i++)
        if(num % i === 0) return false;
    return num > 1;
}
function isCoprime (a, b) {
    let num;
    while ( b ) {
        num = a % b;
        a = b;
        b = num;
    }
    if (Math.abs(a) == 1) {
        return true;
    }
    return false;
}
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.abs(Math.round(rand));
}   
