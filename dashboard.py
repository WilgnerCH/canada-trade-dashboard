import streamlit as st
import pandas as pd

st.set_page_config(
    page_title="Canada Trade Intelligence",
    layout="wide"
)

st.title("🇨🇦 Canada Trade Intelligence Dashboard")

# ✅ DADOS LEVES (IMPORTANTE)
DATA_URL = "https://huggingface.co/datasets/WilgnerCH/canada-trade-analytics/resolve/main/monthly.parquet"

@st.cache_data
def load_data():
    return pd.read_parquet(DATA_URL)

df = load_data()

st.success("Data loaded successfully")

# =========================
# KPIs
# =========================
st.subheader("Key Metrics")

imports = df[df["trade_type"] == "Import"]["Value"].sum()
exports = df[df["trade_type"] == "Export"]["Value"].sum()
balance = exports - imports

col1, col2, col3 = st.columns(3)

col1.metric("Total Imports", f"${imports:,.0f}")
col2.metric("Total Exports", f"${exports:,.0f}")
col3.metric("Trade Balance", f"${balance:,.0f}")

# =========================
# TREND
# =========================
st.subheader("Monthly Trade Trend")

pivot = df.pivot(index="date", columns="trade_type", values="Value")

st.line_chart(pivot)
