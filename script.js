const DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-data/resolve/main/canada_trade_full.parquet";

// 🚨 IMPORTANTE: como GitHub Pages não lê parquet direto,
// você provavelmente já converteu para JSON.
// Se ainda não, depois te ajudo nisso.
// Por enquanto assumindo JSON:

const JSON_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/monthly.json";

async function loadData() {
    const response = await fetch(JSON_URL);
    const data = await response.json();
    return data;
}

function buildChart(data) {

    const dates = data.map(d => d.date);
    const imports = data.map(d => d.imports / 1e9);
    const exports = data.map(d => d.exports / 1e9);

    const traceImports = {
        x: dates,
        y: imports,
        mode: "lines",
        name: "Imports",
        line: { color: "#1f77b4", width: 2 },
        hovertemplate: "%{y:.1f} bi<extra></extra>"
    };

    const traceExports = {
        x: dates,
        y: exports,
        mode: "lines",
        name: "Exports",
        line: { color: "#ff7f0e", width: 2 },
        hovertemplate: "%{y:.1f} bi<extra></extra>"
    };

    const layout = {
        paper_bgcolor: "#0d1117",
        plot_bgcolor: "#0d1117",
        font: { color: "#ffffff" },

        xaxis: {
            gridcolor: "#2a2a2a"
        },

        // ✅ CORREÇÃO AQUI
        yaxis: {
            title: "",
            tickvals: [50, 60, 70, 80],
            ticktext: ["50 bi", "60 bi", "70 bi", "80 bi"],
            gridcolor: "#2a2a2a"
        },

        legend: {
            orientation: "h",
            y: 1.1
        },

        margin: { t: 40 }
    };

    Plotly.newPlot("chart", [traceImports, traceExports], layout, { responsive: true });
}

async function init() {
    const data = await loadData();
    buildChart(data);
}

init();
