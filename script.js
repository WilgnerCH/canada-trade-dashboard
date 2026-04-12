const DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/monthly.json";

async function loadData() {
    const response = await fetch(DATA_URL);
    return await response.json();
}

function buildChart(data) {

    const imports = data.filter(d => d.trade_type === "Import");
    const exports = data.filter(d => d.trade_type === "Export");

    const trace1 = {
        x: imports.map(d => d.date),
        y: imports.map(d => d.Value),
        type: 'scatter',
        name: 'Imports'
    };

    const trace2 = {
        x: exports.map(d => d.date),
        y: exports.map(d => d.Value),
        type: 'scatter',
        name: 'Exports'
    };

    const layout = {
        paper_bgcolor: "#0e1117",
        plot_bgcolor: "#0e1117",
        font: { color: "white" }
    };

    Plotly.newPlot('chart', [trace1, trace2], layout);
}

loadData().then(buildChart);
