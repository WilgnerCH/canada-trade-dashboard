const DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-data/resolve/main/canada_trade_full.parquet";

async function loadData() {
    const response = await fetch(DATA_URL);
    const buffer = await response.arrayBuffer();

    const table = await arrow.tableFromIPC(buffer);

    const df = table.toArray();

    return df;
}

function buildChart(data) {

    const imports = data.filter(d => d.trade_type === "Import");
    const exports = data.filter(d => d.trade_type === "Export");

    const groupByDate = (arr) => {
        const map = {};
        arr.forEach(d => {
            if (!map[d.date]) map[d.date] = 0;
            map[d.date] += d.Value;
        });
        return map;
    };

    const imp = groupByDate(imports);
    const exp = groupByDate(exports);

    const dates = Object.keys(imp);

    const trace1 = {
        x: dates,
        y: Object.values(imp),
        type: 'scatter',
        name: 'Imports'
    };

    const trace2 = {
        x: dates,
        y: Object.values(exp),
        type: 'scatter',
        name: 'Exports'
    };

    Plotly.newPlot('chart', [trace1, trace2]);
}

loadData().then(buildChart);
