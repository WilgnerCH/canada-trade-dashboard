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
// LIMPA NOME DO HS (🔥 CORE FIX)
// ==========================
function cleanHSName(name, hs) {
    if (!name) return hs;

    // Remove código inicial tipo "2709.00"
    let clean = name.replace(/^\d+\.\d+\s*/, "");

    // Remove repetição comum
    clean = clean.replace(/^\d+\s*/, "");

    // Corta tamanho (UX profissional)
    if (clean.length > 45) {
        clean = clean.substring(0, 45) + "...";
    }

    return clean;
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
    // PRODUCTS (🔥 FIX FINAL)
    // ==========================
    const topProducts = products.slice(0, 10);

    new Chart(document.getElementById("productsChart"), {
        type: "bar",
        data: {
            labels: topProducts.map(d => cleanHSName(d.name, d.hs)),
            datasets: [{
                label: "Total Trade",
                data: topProducts.map(d => d.total),
                backgroundColor: "#F39C12"
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "white" } },

                // 🔥 TOOLTIP PROFISSIONAL
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const item = topProducts[context[0].dataIndex];
                            return item.name || item.hs;
                        },
                        label: function(context) {
                            return "Total: " + formatBillions(context.raw);
                        },
                        afterLabel: function(context) {
                            const item = topProducts[context.dataIndex];

                            return [
                                "Imports: " + formatBillions(item.imports),
                                "Exports: " + formatBillions(item.exports),
                                "HS Code: " + item.hs
                            ];
                        }
                    }
                }
            },

            scales: {
                y: {
                    ticks: {
                        color: "white",
                        callback: value => formatBillions(value)
                    }
                },
                x: {
                    ticks: {
                        color: "white",
                        maxRotation: 40,
                        minRotation: 25
                    }
                }
            }
        }
    });

}).catch(err => {
    console.error("ERRO:", err);
});
