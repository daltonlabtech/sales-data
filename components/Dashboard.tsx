"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import styles from "./Dashboard.module.css";

export interface Lead {
  id: string;
  session_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  challenge: string | null;
  created_at: string;
  updated_at: string;
  job_title: string | null;
  company_size: string | null;
  annual_revenue: string | null;
  source: string | null;
  banned: boolean;
}

interface Props {
  leads: Lead[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

const normalizeTitle = (t: string | null): string => {
  if (!t) return "Sem cargo";
  const u = t.toLowerCase();
  if (u.includes("ceo") || u === "co") return "CEO";
  if (u.includes("diretor") || u.includes("sócio")) return "Diretor";
  if (u.includes("proprie")) return "Proprietário";
  if (u.includes("gerente")) return "Gerente";
  if (u.includes("consultor")) return "Consultor";
  if (u.includes("coordena")) return "Coordenador";
  if (u.includes("advog")) return "Advogado";
  if (u.includes("growth")) return "Growth";
  if (u.includes("sales") || u.includes("exec")) return "Sales";
  return "Outro";
};

const byDay = (leads: Lead[]) => {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const d = l.created_at.slice(5, 10);
    const label = `${d.slice(3, 5)}/${d.slice(0, 2)}`;
    map[label] = (map[label] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, total]) => ({ date, total }));
};

const byRevenue = (leads: Lead[]) => {
  const order = [
    "Até R$ 5M",
    "R$ 5M - R$ 20M",
    "R$ 20M - R$ 50M",
    "R$ 50M - R$ 150M",
    "Acima de R$ 150M",
    "N/D",
  ];
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const k = l.annual_revenue || "N/D";
    map[k] = (map[k] || 0) + 1;
  });
  return order
    .filter((k) => map[k])
    .map((k) => ({
      label: k
        .replace("Acima de R$ ", ">R$")
        .replace("Até R$ ", "<R$")
        .replace("R$ ", ""),
      total: map[k],
    }));
};

const bySize = (leads: Lead[]) => {
  const order = [
    "1-10 funcionários",
    "11-50 funcionários",
    "51-200 funcionários",
    "201-500 funcionários",
    "500+ funcionários",
    "N/D",
  ];
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const k = l.company_size || "N/D";
    map[k] = (map[k] || 0) + 1;
  });
  return order
    .filter((k) => map[k])
    .map((k) => ({ label: k.replace(" funcionários", ""), total: map[k] }));
};

const byCargo = (leads: Lead[]) => {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const k = normalizeTitle(l.job_title);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, total]) => ({ label, total }));
};

const bySource = (leads: Lead[]) => {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const k = l.source || "N/D";
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, total]) => ({ label, total }));
};

// ── Light mode color palette ──────────────────────────────────────────────────

const C = {
  text: "#1C1916",
  textMuted: "#A8A29E",
  primary: "#0284C7",
  border: "rgba(28, 25, 22, 0.09)",
  gridLine: "rgba(28, 25, 22, 0.07)",
};

// ── sub-components ────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
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
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        fontFamily: "var(--font-inter, sans-serif)",
      }}
    >
      <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 2 }}>
        {label}
      </div>
      <strong style={{ color: C.text }}>{payload[0].value} leads</strong>
    </div>
  );
};

const HBar = ({
  label,
  total,
  max,
}: {
  label: string;
  total: number;
  max: number;
}) => (
  <div className={styles.hbarWrap}>
    <div className={styles.hbarHeader}>
      <span className={styles.hbarLabel}>{label}</span>
      <span className={styles.hbarValue}>{total}</span>
    </div>
    <div className={styles.hbarTrack}>
      <div
        style={{
          background: C.primary,
          height: 4,
          borderRadius: 2,
          width: `${Math.round((total / max) * 100)}%`,
          transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  </div>
);

// ── types ─────────────────────────────────────────────────────────────────────

type Preset = "7d" | "30d" | "mes" | "custom" | "all";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "7d",     label: "7 dias"        },
  { key: "30d",    label: "30 dias"       },
  { key: "mes",    label: "Este mês"      },
  { key: "custom", label: "Personalizado" },
  { key: "all",    label: "Tudo"          },
];

// ── main component ────────────────────────────────────────────────────────────

export default function Dashboard({ leads }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const [preset, setPreset] = useState<Preset>("custom");
  const [customStart, setCustomStart] = useState("2026-02-13");
  const [customEnd, setCustomEnd]     = useState("");

  const anim = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  });

  // ── filtered leads ─────────────────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    if (preset === "all") return leads;

    const now = new Date();
    let start: Date;
    let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (preset === "7d") {
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (preset === "30d") {
      start = new Date(now);
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
    } else if (preset === "mes") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      if (!customStart && !customEnd) return leads;
      start = customStart ? new Date(customStart + "T00:00:00") : new Date(0);
      end   = customEnd   ? new Date(customEnd   + "T23:59:59") : end;
    }

    return leads.filter(l => {
      const d = new Date(l.created_at);
      return d >= start && d <= end;
    });
  }, [leads, preset, customStart, customEnd]);

  // ── derived data ───────────────────────────────────────────────────────────

  const qualified = filteredLeads.filter(
    (l) => l.email && l.company_size && l.annual_revenue
  ).length;
  const peakDay = byDay(filteredLeads).reduce(
    (a, b) => (b.total > a.total ? b : a),
    { date: "—", total: 0 }
  );

  const dayData    = byDay(filteredLeads);
  const revData    = byRevenue(filteredLeads);
  const sizeData   = bySize(filteredLeads);
  const cargoData  = byCargo(filteredLeads);
  const sourceData = bySource(filteredLeads);

  const sizeMax   = Math.max(...sizeData.map((d) => d.total), 1);
  const cargoMax  = Math.max(...cargoData.map((d) => d.total), 1);
  const sourceMax = Math.max(...sourceData.map((d) => d.total), 1);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dateRange = (() => {
    if (!filteredLeads.length) return "";
    const dates = filteredLeads.map((l) => l.created_at).sort();
    const fmt = (d: string) =>
      new Date(d)
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .toUpperCase();
    return `${fmt(dates[0])} → ${fmt(dates[dates.length - 1])}`;
  })();

  const axisProps = {
    axisLine: false as const,
    tickLine: false as const,
    tick: {
      fontFamily: "var(--font-inter, sans-serif)",
      fontSize: 11,
      fill: C.textMuted,
    },
  };

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header} style={anim(0)}>
        <div className={styles.title}>Painel de Leads</div>
        <div className={styles.meta}>
          <div>{today}</div>
          {dateRange && <div>{dateRange}</div>}
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────── */}
      <div className={styles.filterBar} style={anim(40)}>
        <div className={styles.filterChips}>
          {PRESETS.map(p => (
            <button
              key={p.key}
              className={`${styles.chip} ${preset === p.key ? styles.chipActive : ""}`}
              onClick={() => setPreset(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset === "custom" && (
          <div className={styles.dateInputs}>
            <input
              type="date"
              className={styles.dateInput}
              value={customStart}
              max={customEnd || undefined}
              onChange={e => setCustomStart(e.target.value)}
            />
            <span className={styles.dateSep}>→</span>
            <input
              type="date"
              className={styles.dateInput}
              value={customEnd}
              min={customStart || undefined}
              onChange={e => setCustomEnd(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className={styles.body}>

        {filteredLeads.length === 0 ? (
          <div className={styles.emptyState}>
            Nenhum lead no período selecionado.
          </div>
        ) : (
          <>
            {/* ── KPIs ─────────────────────────────────────────────── */}
            <div className={styles.kpiGrid} style={anim(120)}>
              {[
                {
                  label: "Total de Leads",
                  value: filteredLeads.length,
                  sub: preset === "all" ? "todos os registros" : "no período filtrado",
                },
                {
                  label: "Qualificados",
                  value: qualified,
                  sub: "e-mail + tamanho + receita",
                },
                {
                  label: "Taxa de qualif.",
                  value: filteredLeads.length
                    ? `${Math.round((qualified / filteredLeads.length) * 100)}%`
                    : "—",
                  sub: "com dados completos",
                },
                {
                  label: "Pico diário",
                  value: peakDay.total || "—",
                  sub: peakDay.date !== "—" ? `${peakDay.date} · maior volume` : "sem dados",
                },
              ].map((k) => (
                <div key={k.label} className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{k.label}</span>
                  <span className={styles.kpiValue}>{k.value}</span>
                  <span className={styles.kpiSub}>{k.sub}</span>
                </div>
              ))}
            </div>

            {/* ── Volume por Dia ───────────────────────────────────── */}
            <div className={styles.panel} style={anim(200)}>
              <div className={styles.sectionTitle}>Volume por Dia</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={dayData}
                  margin={{ top: 4, right: 8, bottom: 0, left: -22 }}
                >
                  <CartesianGrid
                    stroke={C.gridLine}
                    vertical={false}
                  />
                  <XAxis dataKey="date" {...axisProps} />
                  <YAxis allowDecimals={false} {...axisProps} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={C.primary}
                    strokeWidth={2.5}
                    dot={{ fill: C.primary, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: C.primary, strokeWidth: 2, stroke: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── Faturamento + Tamanho ────────────────────────────── */}
            <div className={styles.twoCol} style={anim(280)}>
              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Faturamento Anual</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={revData}
                    margin={{ top: 0, right: 0, bottom: 0, left: -26 }}
                    barSize={28}
                  >
                    <XAxis
                      dataKey="label"
                      {...axisProps}
                      tick={{ ...axisProps.tick, fontSize: 9.5 }}
                    />
                    <YAxis allowDecimals={false} {...axisProps} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(28, 25, 22, 0.04)" }}
                    />
                    <Bar
                      dataKey="total"
                      fill={C.primary}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Tamanho da Empresa</div>
                <div style={{ marginTop: 4 }}>
                  {sizeData.map((d) => (
                    <HBar key={d.label} {...d} max={sizeMax} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Cargo + Origem ───────────────────────────────────── */}
            <div className={styles.twoCol} style={anim(360)}>
              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Cargo / Função</div>
                <div style={{ marginTop: 4 }}>
                  {cargoData.map((d) => (
                    <HBar key={d.label} {...d} max={cargoMax} />
                  ))}
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Origem do Lead</div>
                <div style={{ marginTop: 4 }}>
                  {sourceData.map((d) => (
                    <HBar key={d.label} {...d} max={sourceMax} />
                  ))}
                </div>
                {sourceData.length > 0 && (
                  <div className={styles.sourceNote}>
                    {sourceData.map((d) => (
                      <div key={d.label}>
                        {d.label}:{" "}
                        <strong style={{ color: C.text }}>
                          {filteredLeads.length
                            ? Math.round((d.total / filteredLeads.length) * 100)
                            : 0}
                          %
                        </strong>{" "}
                        do total
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Leads Recentes ───────────────────────────────────── */}
            <div className={styles.panel} style={anim(440)}>
              <div className={styles.sectionTitle}>Leads Recentes</div>
              <div className={styles.leadsList}>
                {filteredLeads.slice(0, 10).map((l) => (
                  <div key={l.id} className={styles.leadRow}>
                    <div>
                      <div className={styles.leadName}>{l.name || "—"}</div>
                      <div className={styles.leadMeta}>
                        {normalizeTitle(l.job_title)}
                        {l.company_name ? ` · ${l.company_name}` : ""}
                      </div>
                    </div>
                    <div className={styles.leadRight}>
                      <span className={styles.tag}>
                        {new Date(l.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                      {l.source && (
                        <div className={styles.leadSource}>{l.source}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────── */}
            <div className={styles.footer} style={anim(520)}>
              Dalton Lab · Uso Interno · {filteredLeads.length} registros
              {preset !== "all" && " (filtrado)"}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
