"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import dashStyles from "./Dashboard.module.css";
import styles from "./GrowthDashboard.module.css";

export interface GrowthRow {
  row_number: number;
  Canal: string;
  Data: string;
  Investimento: number;
  CPM: string;
  Alcance: number;
  Cliques: number;
  CTR: number;
  CPC: string;
  "Page Views": number;
  Leads: number;
  CPL: string;
  MQLs: string | number;
  CPMQLs: string;
  SQLs: number | string;
  CPSQLs: number | string;
  "META LEADS": string;
}

interface Props {
  data: GrowthRow[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

const pct = (num: number, den: number) =>
  den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "—";

const safeNum = (v: number | string): number =>
  typeof v === "number" ? v : 0;

// ── color palette ─────────────────────────────────────────────────────────────

const C = {
  primary: "#0284C7",
  slate: "#94A3B8",
  border: "rgba(28, 25, 22, 0.09)",
  gridLine: "rgba(28, 25, 22, 0.07)",
  text: "#1C1916",
  textMuted: "#A8A29E",
};

// ── sub-components ────────────────────────────────────────────────────────────

const GrowthTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        color: C.text,
        padding: "8px 14px",
        fontSize: 12,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        fontFamily: "var(--font-inter, sans-serif)",
      }}
    >
      <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name === "Investimento" ? brl(p.value) : `${p.value} leads`}
        </div>
      ))}
    </div>
  );
};

const FunnelBar = ({
  label,
  value,
  max,
  conversionFrom,
}: {
  label: string;
  value: number;
  max: number;
  conversionFrom?: { label: string; rate: string };
}) => (
  <div className={dashStyles.funnelStep}>
    {conversionFrom && (
      <>
        <span className={styles.convArrow}>↓</span>
        <div className={styles.convRate}>
          {conversionFrom.rate} converteram de {conversionFrom.label}
        </div>
        <span className={styles.convArrow}>↓</span>
      </>
    )}
    <div className={dashStyles.funnelHeader}>
      <span className={dashStyles.funnelLabel}>{label}</span>
      <span className={dashStyles.funnelValue}>
        {value.toLocaleString("pt-BR")}
      </span>
    </div>
    <div className={dashStyles.funnelTrack}>
      <div
        style={{
          background: C.primary,
          height: "100%",
          borderRadius: 4,
          width: `${Math.round((value / max) * 100)}%`,
          transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────

export default function GrowthDashboard({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const anim = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  });

  // ── aggregates ──────────────────────────────────────────────────────────────

  const totalInvest = data.reduce((s, r) => s + r.Investimento, 0);
  const totalLeads = data.reduce((s, r) => s + r.Leads, 0);
  const totalSQLs = data.reduce((s, r) => s + safeNum(r.SQLs), 0);
  const totalAlcance = data.reduce((s, r) => s + r.Alcance, 0);
  const totalCliques = data.reduce((s, r) => s + r.Cliques, 0);
  const totalPageViews = data.reduce((s, r) => s + r["Page Views"], 0);
  const cplMedio = totalLeads > 0 ? totalInvest / totalLeads : 0;

  const canais = [...new Set(data.map((r) => r.Canal))].join(", ");

  const datesSorted = [...data].sort((a, b) =>
    a.Data.localeCompare(b.Data)
  );
  const firstDate = datesSorted[0]?.Data ?? "";
  const lastDate = datesSorted[datesSorted.length - 1]?.Data ?? "";
  const dateRange =
    firstDate && lastDate && firstDate !== lastDate
      ? `${firstDate} → ${lastDate}`
      : firstDate;

  // ── chart data (group by date) ───────────────────────────────────────────────

  const chartMap: Record<string, { Investimento: number; Leads: number }> = {};
  data.forEach((r) => {
    if (!chartMap[r.Data]) chartMap[r.Data] = { Investimento: 0, Leads: 0 };
    chartMap[r.Data].Investimento += r.Investimento;
    chartMap[r.Data].Leads += r.Leads;
  });
  const chartData = Object.entries(chartMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([Data, v]) => ({ Data, ...v }));

  const axisProps = {
    axisLine: false as const,
    tickLine: false as const,
    tick: {
      fontFamily: "var(--font-inter, sans-serif)",
      fontSize: 11,
      fill: C.textMuted,
    },
  };

  const funnelMax = totalAlcance;

  return (
    <div className={dashStyles.page}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className={dashStyles.header} style={anim(0)}>
        <div className={dashStyles.title}>Growth Pack</div>
        <div className={dashStyles.meta}>
          {canais && <div>{canais}</div>}
          {dateRange && <div>{dateRange}</div>}
        </div>
      </div>

      <div className={dashStyles.body}>
        {/* ── KPIs ──────────────────────────────────────────────── */}
        <div className={dashStyles.kpiGrid} style={anim(120)}>
          {[
            {
              label: "Total Investido",
              value: brl(totalInvest),
              sub: "verba total no período",
            },
            {
              label: "Leads Gerados",
              value: totalLeads,
              sub: "formulários preenchidos",
            },
            {
              label: "CPL Médio",
              value: brl(cplMedio),
              sub: "custo por lead",
            },
            {
              label: "SQLs",
              value: totalSQLs || "—",
              sub: "leads qualificados p/ vendas",
            },
          ].map((k) => (
            <div key={k.label} className={dashStyles.kpiCard}>
              <span className={dashStyles.kpiLabel}>{k.label}</span>
              <span className={dashStyles.kpiValue}>{k.value}</span>
              <span className={dashStyles.kpiSub}>{k.sub}</span>
            </div>
          ))}
        </div>

        {/* ── Funil + Gráfico ───────────────────────────────────── */}
        <div className={dashStyles.twoCol} style={anim(200)}>
          {/* Funil */}
          <div className={dashStyles.panel}>
            <div className={dashStyles.sectionTitle}>Funil de Conversão</div>
            <FunnelBar label="Alcance" value={totalAlcance} max={funnelMax} />
            <FunnelBar
              label="Cliques"
              value={totalCliques}
              max={funnelMax}
              conversionFrom={{
                label: "Alcance",
                rate: pct(totalCliques, totalAlcance),
              }}
            />
            <FunnelBar
              label="Page Views"
              value={totalPageViews}
              max={funnelMax}
              conversionFrom={{
                label: "Cliques",
                rate: pct(totalPageViews, totalCliques),
              }}
            />
            <FunnelBar
              label="Leads"
              value={totalLeads}
              max={funnelMax}
              conversionFrom={{
                label: "Page Views",
                rate: pct(totalLeads, totalPageViews),
              }}
            />
            {totalSQLs > 0 && (
              <FunnelBar
                label="SQLs"
                value={totalSQLs}
                max={funnelMax}
                conversionFrom={{
                  label: "Leads",
                  rate: pct(totalSQLs, totalLeads),
                }}
              />
            )}
            <div className={dashStyles.funnelStats}>
              <div>Lead rate: {pct(totalLeads, totalAlcance)} do alcance</div>
              {totalSQLs > 0 && (
                <div>SQL rate: {pct(totalSQLs, totalLeads)} dos leads</div>
              )}
            </div>
          </div>

          {/* Gráfico */}
          <div className={dashStyles.panel}>
            <div className={dashStyles.sectionTitle}>
              Investimento × Leads por Dia
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart
                data={chartData}
                margin={{ top: 4, right: 8, bottom: 0, left: -10 }}
              >
                <CartesianGrid stroke={C.gridLine} vertical={false} />
                <XAxis dataKey="Data" {...axisProps} />
                <YAxis
                  yAxisId="invest"
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                  {...axisProps}
                />
                <YAxis
                  yAxisId="leads"
                  orientation="right"
                  allowDecimals={false}
                  {...axisProps}
                />
                <Tooltip content={<GrowthTooltip />} />
                <Line
                  yAxisId="invest"
                  type="monotone"
                  dataKey="Investimento"
                  name="Investimento"
                  stroke={C.primary}
                  strokeWidth={2.5}
                  dot={{ fill: C.primary, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: C.primary, strokeWidth: 2, stroke: "#fff" }}
                />
                <Line
                  yAxisId="leads"
                  type="monotone"
                  dataKey="Leads"
                  name="Leads"
                  stroke={C.slate}
                  strokeWidth={2}
                  dot={{ fill: C.slate, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: C.slate, strokeWidth: 2, stroke: "#fff" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Tabela diária ──────────────────────────────────────── */}
        <div className={dashStyles.panel} style={anim(360)}>
          <div className={dashStyles.sectionTitle}>Detalhamento Diário</div>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dailyTable}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Investimento</th>
                  <th>Alcance</th>
                  <th>Leads</th>
                  <th>CPL</th>
                  <th>SQLs</th>
                </tr>
              </thead>
              <tbody>
                {datesSorted.map((r, i) => (
                  <tr key={i}>
                    <td>{r.Data}</td>
                    <td>{brl(r.Investimento)}</td>
                    <td>{r.Alcance.toLocaleString("pt-BR")}</td>
                    <td>{r.Leads}</td>
                    <td>{r.CPL}</td>
                    <td>{safeNum(r.SQLs) || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className={dashStyles.footer} style={anim(440)}>
          Dalton Lab · Growth Pack · {data.length} registros
        </div>
      </div>
    </div>
  );
}
