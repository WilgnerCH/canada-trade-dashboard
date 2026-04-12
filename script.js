const DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/monthly.json";

// =========================
// FORMATADOR
// =========================
function formatBillions(value) {
    return (value / 1e9).toFixed(1) + " bi";
}

// =========================
// LOAD DATA
// =========================
async function loadData() {
    const response = await fetch(DATA_URL);
    return await response.json();
}

// =========================
// BUILD CHART
// =========================
function buildChart(data) {

    const imports = data.filter(d => d.trade_type === "Import");
    const exports = data.filter(d => d.trade_type === "Export");

    const trace1 = {
        x: imports.map(d => d.date),
        y: imports.map(d => d.Value / 1e9),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Imports',
        line: { width: 3 },
        hovertemplate: "%{y:.1f} bi<extra></extra>"
    };

    const trace2 = {
        x: exports.map(d => d.date),
        y: exports.map(d => d.Value / 1e9),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Exports',
        line: { width: 3 },
        hovertemplate: "%{y:.1f} bi<extra></extra>"
    };

    const layout = {
        paper_bgcolor: "#0e1117",
        plot_bgcolor: "#0e1117",
        font: { color: "white" },

        xaxis: {
            title: "",
            showgrid: false
        },

        yaxis: {
            title: "",
            tickformat: ".0f",
            ticksuffix: " bi",
            gridcolor: "#2a2a2a"
        },

        legend: {
            orientation: "h",
            y: 1.1
        },

        margin: {
            t: 20
        }
    };

    Plotly.newPlot('chart', [trace1, trace2], layout, { responsive: true });
}

// =========================
// INIT
// =========================
loadData().then(buildChart);
