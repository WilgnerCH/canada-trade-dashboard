// ==========================
// CONFIG
// ==========================
const BASE_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/";

// ==========================
// HS MAPPING
// ==========================
const hsMapping = {
    "2709": "Crude Oil",
    "8703": "Passenger Vehicles",
    "7108": "Gold",
    "2711": "Petroleum Gas",
    "9999": "Special Transactions"
};

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

    console.log("DATA LOADED:", data);

    // ==========================
    // KPI
    // ==========================
    const latest = monthly[monthly.length - 1];

    document.getElementById("kpi-imports").innerText = formatBillions(latest.imports);
    document.getElementById("kpi-exports").innerText = formatBillions(latest.exports);
    document.getElementById("kpi-balance").innerText = formatBillions(latest.exports - latest.imports);

    // ==========================
    // MONTHLY CHART
    // ==========================
    new Chart(document.getElementById("monthlyChart"), {
        type: "line",
        data: {
            labels: monthly.map(d => d.date),
            datasets: [
                {
                    label: "Imports",
                    data: monthly.map(d => d.imports),
                    borderColor: "#2E86C1",
                    tension: 0.3
                },
                {
                    label: "Exports",
                    data: monthly.map(d => d.exports),
                    borderColor: "#F39C12",
                    tension: 0.3
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
    // COUNTRIES
    // ==========================
    const topCountries = countries.slice(0, 10);

    new Chart(document.getElementById("countriesChart"), {
        type: "bar",
        data: {
            labels: topCountries.map(d => d.country),
            datasets: [{
                label: "Total Trade",
                data: topCountries.map(d => d.total),
                backgroundColor: "#2E86C1"
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
    // PRODUCTS
    // ==========================
    const topProducts = products.slice(0, 10);

    new Chart(document.getElementById("productsChart"), {
        type: "bar",
        data: {
            labels: topProducts.map(d => {
                const code = (d.hs || "").substring(0, 4);
                return hsMapping[code] || d.hs;
            }),
            datasets: [{
                label: "Total Trade",
                data: topProducts.map(d => d.total),
                backgroundColor: "#F39C12"
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

}).catch(err => {
    console.error("ERRO:", err);
});
