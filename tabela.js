let st = 3;
let parametri = [];
let utez = [];
let alternative = [];
let vrednostiVrstic = [];
let sum = [];
let vrednosti = [];

function dodajKolono() {
    let glava = document.getElementById('tabela').tHead;
    for (let h = 0; h < glava.rows.length; h++) {
        let th = document.createElement('th');
        glava.rows[h].appendChild(th);
        th.innerHTML = `<input type="text" value="Alternativa ` + st + `">`;
        st++;
    }

    let telo = document.getElementById('tabela').tBodies[0];
    for (let i = 0; i < telo.rows.length; i++) {
        let newCell = telo.rows[i].insertCell(-1);
        newCell.innerHTML = `<input type="text">`;
    }
}

function dodajVrstico() {
    let table = document.getElementById("tabela");
    let row = table.insertRow();
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let cell = row.insertCell();
        cell.innerHTML = `<input type="text">`;
    }
}

function pridobitevPodatkov() {
    let tabela = document.getElementById('tabela');

    let objCells = tabela.rows.item(0).cells; //pridobitev podatkov - alternative
    for (let j = 2; j < objCells.length; j++) {
        var x = document.getElementById("tabela").rows[0].cells[j].children[0].value;
        alternative.push(x);
    }
    console.log(alternative);

    for (i = 1; i < tabela.rows.length; i++) { //pridobitev podatkov - parametri
        var x = document.getElementById("tabela").rows[i].cells[0].children[0].value;
        parametri.push(x);
    }
    for (i = 1; i < tabela.rows.length; i++) { //pridobitev podatkov - uteži
        var x = document.getElementById("tabela").rows[i].cells[1].children[0].value;
        utez.push(x);
    }

    for (i = 1; i < tabela.rows.length; i++) { //pridobitev podatkov - vrednosti alternativ za vsak parameter (sestavljanje matrike/dvodimenzionalnega polja)
        let objCells = tabela.rows.item(i).cells;
        let vrednost = [];
        for (let j = 2; j < objCells.length; j++) {
            var x = document.getElementById("tabela").rows[i].cells[j].children[0].value;
            vrednost.push(x);
        }
        vrednostiVrstic.push(vrednost);
    }
    console.log(vrednostiVrstic);
    let pomnozeneVrednosti = [];

    for (let x = 0; x < vrednostiVrstic.length; x++) { //množenje uteži z vrednostmi
        let pomnozeneVrednostiVrstice = [];
        for (let y = 0; y < vrednostiVrstic[x].length; y++) {
            let pomnozeno = vrednostiVrstic[x][y] * utez[x];
            pomnozeneVrednostiVrstice.push(pomnozeno);
        }
        pomnozeneVrednosti.push(pomnozeneVrednostiVrstice);
    }

    console.log(pomnozeneVrednosti);

    const sestevanjeZmnozkov = (array) => { //seštevanje zmnožkov po stolpcih
        const newArray = [];
        array.forEach(sub => {
            sub.forEach((num, index) => {
                if (newArray[index]) {
                    newArray[index] += num;
                } else {
                    newArray[index] = num;
                }
            });
        });
        return newArray;
    }

    console.log(sestevanjeZmnozkov(pomnozeneVrednosti));

    function indexOfMax(arr) { //max od vsot zmnožkov
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }
    sum = sestevanjeZmnozkov(pomnozeneVrednosti);
    let indexMax = indexOfMax(sum);
    console.log(indexMax);

    let row = tabela.insertRow(); //izpiše novo vrstico in vpiše vsote zmnožkov
    for (let i = 0; i < 2; i++) {
        let cell = row.insertCell();
        cell.innerHTML = ``;
    }
    for (let i = 0; i < sum.length; i++) { //pobarva z zeleno max vrednost
        let cell = row.insertCell();
        cell.innerHTML = sum[i];
        if (i == indexMax) {
            cell.style.backgroundColor = "green";
        }
    }
}

function grafAlternativ() { //graf Primerjava alternativ
    var xArray = sum;
    var yArray = alternative;

    var data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation: "h"
    }];

    var layout = { title: "Primerjava alternativ" };

    Plotly.newPlot("graf1", data, layout);
}

function grafUtezi() { //graf Uteži parametrov
    console.log(parametri);
    console.log(utez);
    var xArray = parametri;
    var yArray = utez;

    var layout = { title: "Uteži parametrov" };

    var data = [{ labels: xArray, values: yArray, hole: .4, type: "pie" }];

    Plotly.newPlot("graf2", data, layout);
}

function grafObcutljivosti() { //graf Analiza občutljivosti parametrov

    let index = document.getElementById("index").value;
    let izbranParameter = parametri[index - 1];
    console.log(vrednostiVrstic[1]);

    let xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let noveVrednosti = [];

    for (let j = 0; j < vrednostiVrstic[index - 1].length; j++) {
        let polje = [];
        for (let k = 0; k <= 10; k++) {
            let x = vrednostiVrstic[index - 1][j] * k;
            polje.push(x);
        }
        noveVrednosti.push(polje);
    }

    console.log(noveVrednosti);
    var datasetValue = [];
    for (var j = 0; j < noveVrednosti.length; j++) {
        datasetValue[j] = {
            label: alternative[j],
            data: noveVrednosti[j],
            borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
    }

    new Chart("graf3", {
        type: "line",
        data: {
            labels: xValues,
            datasets: datasetValue
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Analiza občutljivosti izbranega parametra: " + izbranParameter,
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: true,
                    labels: { fontColor: "#000080" },
                }
            }
        }
    });

}