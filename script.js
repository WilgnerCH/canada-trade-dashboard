const DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/monthly.json";

async function loadData() {
    const response = await fetch(DATA_URL);
    return await response.json();
}

function buildChart(data) {

    const imports = data.filter(d => d.trade_type === "Import");
    const exports = data.filter(d => d.trade_type === "Export");

    const dates = imports.map(d => d.date);

    const trace1 = {
        x: dates,
        y: imports.map(d => d.Value),
        type: 'scatter',
        name: 'Imports'
    };

    const trace2 = {
        x: dates,
        y: exports.map(d => d.Value),
        type: 'scatter',
        name: 'Exports'
    };

    Plotly.newPlot('chart', [trace1, trace2]);
}

loadData().then(buildChart);
