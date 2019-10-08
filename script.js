

function renderRowInTable(genList) {
    const table = document.getElementById('table');
    for (let gen of genList) {
        const row = document.createElement('tr');
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
const weights = [15, 20, 10, 4, 23, 33, 34, 10, 8, 5];
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
    population.selection();
    renderTitlesInTable('Итоговая популяция');
    renderRowInTable(population.gens);
    console.log('iteration = ', i);
    const best = population.getBest(139, 141);
    if (best.length !== 0) {
        stop = true;
        console.log('best', best);
    }
    i += 1;
}
if (!stop) {
    console.log('optimal', population.getOptimal(141));
}
