// ==========================
// CONFIG
// ==========================
const BASE_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/";

// ==========================
// FORMATADOR
// ==========================
function formatBillions(value) {
    return (value / 1e9).toFixed(1) + " bi";
}

// ==========================
// LOAD DATA
// ==========================
async function loadData() {
    const monthly = await fetch(BASE_URL + "monthly.json").then(r => r.json());
    const countries = await fetch(BASE_URL + "countries.json").then(r => r.json());
    const products = await fetch(BASE_URL + "products.json").then(r => r.json());

    return { monthly, countries, products };
}

// ==========================
// BUILD DASHBOARD
// ==========================
loadData().then(data => {

    const { monthly, countries, products } = data;

    // ==========================
    // KPI
    // ==========================
    const latest = monthly[monthly.length - 1];

    const imports = monthly.filter(d => d.trade_type === "Import").slice(-1)[0].Value;
    const exports = monthly.filter(d => d.trade_type === "Export").slice(-1)[0].Value;

    document.getElementById("kpi-imports").innerText = formatBillions(imports);
    document.getElementById("kpi-exports").innerText = formatBillions(exports);
    document.getElementById("kpi-balance").innerText = formatBillions(exports - imports);

    // ==========================
    // MONTHLY CHART
    // ==========================
    const labels = [...new Set(monthly.map(d => d.date))];

    const importsData = labels.map(date => {
        const row = monthly.find(d => d.date === date && d.trade_type === "Import");
        return row ? row.Value : 0;
    });

    const exportsData = labels.map(date => {
        const row = monthly.find(d => d.date === date && d.trade_type === "Export");
        return row ? row.Value : 0;
    });

    new Chart(document.getElementById("monthlyChart"), {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Imports",
                    data: importsData,
                    borderColor: "#2E86C1"
                },
                {
                    label: "Exports",
                    data: exportsData,
                    borderColor: "#F39C12"
                }
            ]
        },
        options: {
            plugins: {
                legend: { labels: { color: "white" } }
            },
            scales: {
                y: {
                    ticks: {
                        color: "white",
                        callback: value => formatBillions(value)
                    }
                },
                x: {
                    ticks: { color: "white" }
                }
            }
        }
    });

    // ==========================
    // COUNTRIES CHART
    // ==========================
    const topCountries = countries.slice(0, 10);

    new Chart(document.getElementById("countriesChart"), {
        type: "bar",
        data: {
            labels: topCountries.map(d => d.Country),
            datasets: [{
                label: "Trade Value",
                data: topCountries.map(d => d.Value),
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "white" } }
            },
            scales: {
                y: {
                    ticks: {
                        color: "white",
                        callback: value => formatBillions(value)
                    }
                },
                x: {
                    ticks: { color: "white" }
                }
            }
        }
    });

    // ==========================
    // PRODUCTS CHART
    // ==========================
    const topProducts = products.slice(0, 10);

    new Chart(document.getElementById("productsChart"), {
        type: "bar",
        data: {
            labels: topProducts.map(d => d.HS),
            datasets: [{
                label: "Trade Value",
                data: topProducts.map(d => d.Value),
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "white" } }
            },
            scales: {
                y: {
                    ticks: {
                        color: "white",
                        callback: value => formatBillions(value)
                    }
                },
                x: {
                    ticks: { color: "white" }
                }
            }
        }
    });

});
