import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

// ── WhatsApp sessions data ────────────────────────────────────────────────────
const SESSIONS = [
  { id: "5511977776666", name: "Teste Deploy", hasHuman: false, outcome: "teste" },
  { id: "5511978023028", name: "Diego (Oliveiras Tech)", hasHuman: false, outcome: "teste" },
  { id: "5561981420390", name: "Marcelo", hasHuman: false, outcome: "bug_multiplo", bug: true },
  { id: "556181420390",  name: "Barraquinha Hot Dog", hasHuman: true, outcome: "engajou", exchanges: 6 },
  { id: "5521999182828", name: "Múltiplos nomes", hasHuman: false, outcome: "bug_multiplo", bug: true },
  { id: "5563981156932", name: "Gabriel", hasHuman: false, outcome: "silencio" },
  { id: "5541999724316", name: "Gilson", hasHuman: false, outcome: "silencio" },
  { id: "556381156932",  name: "Abençoada", hasHuman: true, outcome: "hostil", exchanges: 1 },
  { id: "5549984212320", name: "Ezequiel (1ª msg)", hasHuman: false, outcome: "silencio" },
  { id: "554984212320",  name: "Ezequiel (PAINEL LED)", hasHuman: true, outcome: "engajou", exchanges: 7 },
  { id: "5511974602032", name: "Fruschein", hasHuman: true, outcome: "minimo", exchanges: 1 },
  { id: "5511972711819", name: "Marcos", hasHuman: false, outcome: "silencio" },
  { id: "5511932247219", name: "Leandro", hasHuman: false, outcome: "silencio" },
  { id: "5522997447786", name: "Rafael", hasHuman: false, outcome: "silencio" },
  { id: "5519999699553", name: "Auditoria e Qualidade", hasHuman: true, outcome: "contexto", exchanges: 1 },
  { id: "5519999026230", name: "Bruno Gusson", hasHuman: true, outcome: "contexto", exchanges: 2 },
  { id: "351925603382",  name: "nortonrioa", hasHuman: true, outcome: "minimo", exchanges: 1 },
  { id: "5522998067015", name: "Fernando Grimmer", hasHuman: false, outcome: "silencio" },
  { id: "5516993166545", name: "Vitor Berardi", hasHuman: false, outcome: "silencio" },
  { id: "555599868666",  name: "Ezequiel (teste?)", hasHuman: false, outcome: "silencio" },
  { id: "5533988033258", name: "Fernando (Cidade Futuro)", hasHuman: false, outcome: "silencio" },
  { id: "21970221444",   name: "Fabio Figueira", hasHuman: false, outcome: "silencio" },
  { id: "5562981861609", name: "Pablo Alves", hasHuman: false, outcome: "silencio" },
  { id: "5573991456250", name: "Lucas Conceição", hasHuman: false, outcome: "silencio" },
  { id: "5581989455595", name: "Ana Cláudia", hasHuman: false, outcome: "silencio" },
];

const REAL_SESSIONS = SESSIONS.filter(s => s.outcome !== "teste");
const OUTCOME_LABELS = {
  silencio: "Silêncio",
  minimo: "Resposta mínima",
  engajou: "Engajou",
  contexto: "Contexto / Imprevisto",
  hostil: "Hostil",
  bug_multiplo: "Bug (disparo múltiplo)",
};
const OUTCOME_ORDER = ["silencio", "engajou", "minimo", "contexto", "hostil", "bug_multiplo"];

const RAW_LEADS = [
  { id: "2066", name: "Victor Vieira da Silva", email: "victorvieiraa03@gmail.com", phone: "21965609670", company_name: "Victor Estrategista", created_at: "2026-02-13T04:00:11.996Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2071", name: "Michael Antonio Fonseca Mendes", email: "michael.mendes@cleanlab.website", phone: "351917804506", company_name: "Brisas Inquebráveis unipessoal LDA", created_at: "2026-02-13T18:00:16.231Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2100", name: "João Silva", email: "joao.silva@empresa.com", phone: "11987654321", company_name: "Tech Solutions Ltda", created_at: "2026-02-14T04:24:31.971Z", job_title: "Growth Advisor", company_size: "500+ funcionários", annual_revenue: "Acima de R$ 150M" },
  { id: "2111", name: "Gilson Strechar", email: "gilson@exactaonline.com.br", phone: "5541999724316", company_name: "Group Legacy", created_at: "2026-02-15T00:22:26.217Z", job_title: "Diretor", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2112", name: "Abençoada", email: null, phone: "556381156932", company_name: null, created_at: "2026-02-15T00:36:09.683Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2114", name: "João Macedo", email: "motamacedo@gmail.com", phone: "5511999162028", company_name: "Motamacedo Engenharia Ltda", created_at: "2026-02-15T03:34:52.423Z", job_title: "Proprietário", company_size: "1-10 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2116", name: "Thiago Ravell Santos Furtado", email: "thiagoravell@hotmail.com", phone: "5521999679920", company_name: "Ravell advogados", created_at: "2026-02-15T06:13:29.210Z", job_title: "Advogados", company_size: "1-10 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2121", name: "Ezequiel", email: "brasilsomluz@yahoo.com.br", phone: "5549984212320", company_name: "Brasil som luz", created_at: "2026-02-16T02:28:19.627Z", job_title: "Ceo", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2122", name: "Ezequiel | PAINEL DE LED", email: "brasilsomluz@yahoo.com.br", phone: "554984212320", company_name: null, created_at: "2026-02-16T02:28:46.964Z", job_title: "CEO", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2128", name: "FRUSCHEIN", email: "fruschein@granarteproducoes.com.br", phone: "5511974602032", company_name: "Granarte gastronomia", created_at: "2026-02-16T04:12:10.423Z", job_title: "Ceo", company_size: "11-50 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2130", name: "Marcos Cardoso Talarico", email: "marcos.talarico@sd.tur.br", phone: "5511972711819", company_name: "SD", created_at: "2026-02-16T16:59:25.044Z", job_title: "CEo", company_size: "11-50 funcionários", annual_revenue: "R$ 20M - R$ 50M" },
  { id: "2137", name: "Leonardo Lima", email: "leolima89@gmail.com", phone: "5551991199261", company_name: "Ludco", created_at: "2026-02-17T05:18:26.785Z", job_title: "Coordenador de Marketing", company_size: "1-10 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2138", name: "Lúcia Pinheiro", email: "saeduc@saeduc.com", phone: "5511979711977", company_name: "Saeduc", created_at: "2026-02-17T12:40:52.786Z", job_title: "CEO", company_size: "1-10 funcionários", annual_revenue: "Acima de R$ 150M" },
  { id: "2139", name: "Leandro Santos Nunes", email: "leandro@topchairs.com.br", phone: "5511932247219", company_name: "Topchairs", created_at: "2026-02-17T13:00:23.855Z", job_title: "Diretor", company_size: "11-50 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2140", name: "Rafael Valente", email: "rafaelvalentekk@gmail.com", phone: "5522997447786", company_name: "Bfriends", created_at: "2026-02-17T15:35:17.690Z", job_title: "CO", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2141", name: "Daniel Chioccarello", email: "daniel.chioccarello@prosperacsx.com", phone: "5511919434444", company_name: "Grupo Próspera", created_at: "2026-02-17T18:47:24.950Z", job_title: "Proprietario", company_size: "1-10 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2142", name: "Auditoria e Qualidade", email: null, phone: "5519999699553", company_name: null, created_at: "2026-02-17T21:17:37.951Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2144", name: "nortonrioa", email: null, phone: "351925603382", company_name: null, created_at: "2026-02-17T21:19:55.431Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2145", name: "Bruno Gusson", email: null, phone: "5519999026230", company_name: null, created_at: "2026-02-17T21:19:55.444Z", job_title: null, company_size: null, annual_revenue: null },
  { id: "2147", name: "fernandoalmeidagv@hotmail.com", email: "cidadefuturo@hotmail.com", phone: "5533988033258", company_name: null, created_at: "2026-02-17T22:34:34.480Z", job_title: "Diretor sócio", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2148", name: "Fernando Grimmer", email: "financeiro@redflag.com.br", phone: "5522998067015", company_name: null, created_at: "2026-02-17T22:38:22.715Z", job_title: "Consultor", company_size: "51-200 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2149", name: "Vitor Eduardo Berardi", email: "vit.berardi@gmail.com", phone: "5516993166545", company_name: null, created_at: "2026-02-17T22:39:16.836Z", job_title: "Gerente", company_size: "11-50 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2150", name: "Ezequiel", email: "teste@teste.com.br", phone: "555599868666", company_name: null, created_at: "2026-02-17T22:39:53.524Z", job_title: "Estudante", company_size: "11-50 funcionários", annual_revenue: "R$ 20M - R$ 50M" },
  { id: "2152", name: "Pablo Alves", email: "pablohsalves@redecorp.co", phone: "5562981861609", company_name: null, created_at: "2026-02-17T22:40:50.492Z", job_title: "DevOps", company_size: "51-200 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2153", name: "Fabio vaz figueira", email: "fabio970221444@gmail.com", phone: "21970221444", company_name: null, created_at: "2026-02-17T22:40:50.511Z", job_title: "Ceo", company_size: "11-50 funcionários", annual_revenue: "R$ 5M - R$ 20M" },
  { id: "2155", name: "Pedro Vieira Maximimo", email: "pedro.vieir347@gmail.com", phone: "5522997692531", company_name: "Vecta AI", created_at: "2026-02-18T01:31:19.483Z", job_title: "CEO", company_size: "1-10 funcionários", annual_revenue: "Até R$ 5M" },
  { id: "2158", name: "Lucas Conceição", email: "ronisson.conceicao@ailos.coop.br", phone: "5573991456250", company_name: null, created_at: "2026-02-18T15:32:42.363Z", job_title: "Ds", company_size: "500+ funcionários", annual_revenue: "Acima de R$ 150M" },
  { id: "2160", name: "ana Cláudia cabral", email: "anaclaudia@gmail.com", phone: "5581989455595", company_name: null, created_at: "2026-02-18T20:00:52.289Z", job_title: "Ceo", company_size: "11-50 funcionários", annual_revenue: "Até R$ 5M" },
];

const normalizeTitle = (t) => {
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
  return "Outro";
};

const byDay = () => {
  const map = {};
  RAW_LEADS.forEach((l) => {
    const d = l.created_at.slice(5, 10);
    const label = `${d.slice(3, 5)}/${d.slice(0, 2)}`;
    map[label] = (map[label] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).map(([date, total]) => ({ date, total }));
};

const byRevenue = () => {
  const order = ["Até R$ 5M", "R$ 5M - R$ 20M", "R$ 20M - R$ 50M", "Acima de R$ 150M", "N/D"];
  const map = {};
  RAW_LEADS.forEach((l) => { const k = l.annual_revenue || "N/D"; map[k] = (map[k] || 0) + 1; });
  return order.filter((k) => map[k]).map((k) => ({
    label: k.replace("Acima de R$ ", ">R$").replace("Até R$ ", "<R$").replace("R$ ", ""),
    total: map[k]
  }));
};

const bySize = () => {
  const order = ["1-10 funcionários", "11-50 funcionários", "51-200 funcionários", "500+ funcionários", "N/D"];
  const map = {};
  RAW_LEADS.forEach((l) => { const k = l.company_size || "N/D"; map[k] = (map[k] || 0) + 1; });
  return order.filter((k) => map[k]).map((k) => ({ label: k.replace(" funcionários", ""), total: map[k] }));
};

const byCargo = () => {
  const map = {};
  RAW_LEADS.forEach((l) => { const k = normalizeTitle(l.job_title); map[k] = (map[k] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, total]) => ({ label, total }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#000", color: "#fff", padding: "8px 14px", fontFamily: "monospace", fontSize: 12 }}>
      <div style={{ opacity: 0.5, fontSize: 10, marginBottom: 2 }}>{label}</div>
      <strong>{payload[0].value} leads</strong>
    </div>
  );
};

const HBar = ({ label, total, max }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontFamily: "monospace", fontSize: 12 }}>
      <span>{label}</span><strong>{total}</strong>
    </div>
    <div style={{ background: "#e8e8e8", height: 5 }}>
      <div style={{ background: "#000", height: 5, width: `${Math.round((total / max) * 100)}%`, transition: "width 0.8s ease" }} />
    </div>
  </div>
);

export default function Dashboard() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 60); }, []);

  const dayData = byDay();
  const revData = byRevenue();
  const sizeData = bySize();
  const cargoData = byCargo();
  const sizeMax = Math.max(...sizeData.map(d => d.total));
  const cargoMax = Math.max(...cargoData.map(d => d.total));
  const qualified = RAW_LEADS.filter(l => l.email && l.company_size && l.annual_revenue).length;

  // funil WhatsApp
  const REAL_SESSIONS = SESSIONS.filter(s => s.outcome !== "teste");
  const total_wpp = REAL_SESSIONS.length;
  const responderam = REAL_SESSIONS.filter(s => s.hasHuman).length;
  const engajaram = REAL_SESSIONS.filter(s => s.outcome === "engajou").length;
  const funnelSteps = [
    { label: "Sessões iniciadas", n: total_wpp },
    { label: "Responderam", n: responderam },
    { label: "Engajamento real", n: engajaram },
  ];

  // desfechos
  const outcomeCounts = {};
  REAL_SESSIONS.forEach(s => { outcomeCounts[s.outcome] = (outcomeCounts[s.outcome]||0)+1; });
  const outcomeData = OUTCOME_ORDER.filter(k => outcomeCounts[k]).map(k => ({ label: OUTCOME_LABELS[k], total: outcomeCounts[k] }));
  const outcomeMax = Math.max(...outcomeData.map(d => d.total));
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const S = {
    page: { minHeight: "100vh", background: "#f4f3ef", opacity: vis ? 1 : 0, transition: "opacity 0.6s ease", fontFamily: "monospace" },
    header: { background: "#fff", borderBottom: "3px solid #000", padding: "24px 40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" },
    logo: { fontSize: 9, letterSpacing: "0.22em", opacity: 0.35, textTransform: "uppercase", marginBottom: 6 },
    title: { fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" },
    meta: { textAlign: "right", fontSize: 10, opacity: 0.35, lineHeight: 2 },
    body: { padding: "32px 40px", maxWidth: 1080 },
    kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#000", marginBottom: 32 },
    kpiCard: { background: "#fff", padding: "24px 22px" },
    kpiLabel: { fontSize: 9, letterSpacing: "0.14em", opacity: 0.38, textTransform: "uppercase", marginBottom: 8, display: "block" },
    kpiValue: { fontFamily: "Georgia, serif", fontSize: 44, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", display: "block" },
    kpiSub: { fontSize: 10, opacity: 0.4, marginTop: 6, display: "block" },
    panel: { background: "#fff", border: "1px solid #000", padding: "24px" },
    sec: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 18 },
    row: { display: "grid", gap: 20, marginBottom: 20 },
    tag: { fontSize: 9, letterSpacing: "0.1em", background: "#f0efe9", padding: "2px 8px", color: "#666" },
  };

  return (
    <div style={S.page}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.logo}>Dalton Lab</div>
          <div style={S.title}>Painel de Leads</div>
        </div>
        <div style={S.meta}>
          <div>{today}</div>
          <div>13 – 18 FEV 2026</div>
        </div>
      </div>

      <div style={S.body}>

        {/* KPIs */}
        <div style={S.kpiGrid}>
          {[
            { label: "Total de Leads", value: RAW_LEADS.length, sub: "últimos 6 dias" },
            { label: "Qualificados", value: qualified, sub: "e-mail + tamanho + receita" },
            { label: "Taxa de qualif.", value: `${Math.round((qualified / RAW_LEADS.length) * 100)}%`, sub: "leads com dados completos" },
            { label: "Pico diário", value: 14, sub: "17 fev — maior volume" },
          ].map(k => (
            <div key={k.label} style={S.kpiCard}>
              <span style={S.kpiLabel}>{k.label}</span>
              <span style={S.kpiValue}>{k.value}</span>
              <span style={S.kpiSub}>{k.sub}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ ...S.panel, marginBottom: 20 }}>
          <div style={S.sec}>Volume por Dia</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={dayData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid stroke="#f0f0ee" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "monospace", fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontFamily: "monospace", fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#000" strokeWidth={2.5} dot={{ fill: "#000", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row: Revenue + Size */}
        <div style={{ ...S.row, gridTemplateColumns: "1fr 1fr" }}>
          <div style={S.panel}>
            <div style={S.sec}>Faturamento Anual</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={revData} margin={{ top: 0, right: 0, bottom: 0, left: -28 }} barSize={32}>
                <XAxis dataKey="label" tick={{ fontFamily: "monospace", fontSize: 9.5, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontFamily: "monospace", fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f3ef" }} />
                <Bar dataKey="total" fill="#000" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={S.panel}>
            <div style={S.sec}>Tamanho da Empresa</div>
            <div style={{ marginTop: 4 }}>
              {sizeData.map(d => <HBar key={d.label} {...d} max={sizeMax} />)}
            </div>
          </div>
        </div>

        {/* Row: Cargo + Recentes */}
        <div style={{ ...S.row, gridTemplateColumns: "1fr 1.7fr" }}>
          <div style={S.panel}>
            <div style={S.sec}>Cargo / Função</div>
            <div style={{ marginTop: 4 }}>
              {cargoData.map(d => <HBar key={d.label} {...d} max={cargoMax} />)}
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.sec}>Leads Recentes</div>
            {RAW_LEADS.slice().reverse().slice(0, 7).map((l, i) => (
              <div key={l.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: i < 6 ? "1px solid #f0f0ee" : "none"
              }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{l.name}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.4 }}>
                    {normalizeTitle(l.job_title)}{l.company_name ? ` · ${l.company_name}` : ""}
                  </div>
                </div>
                <span style={S.tag}>
                  {new Date(l.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Funnel + Outcomes */}
        <div style={{ ...S.row, gridTemplateColumns: "1fr 1.7fr" }}>

          <div style={S.panel}>
            <div style={S.sec}>Funil WhatsApp</div>
            <div style={{ marginTop: 8 }}>
              {funnelSteps.map((step, i) => {
                const pct = Math.round((step.n / total_wpp) * 100);
                return (
                  <div key={step.label} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "monospace", fontSize: 12 }}>
                      <span style={{ opacity: 0.6 }}>{step.label}</span>
                      <span style={{ fontWeight: 700 }}>{step.n} <span style={{ opacity: 0.35, fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ background: "#e8e8e8", height: 8 }}>
                      <div style={{ background: i === 0 ? "#000" : i === 1 ? "#555" : "#999", height: 8, width: `${pct}%`, transition: "width 0.8s ease" }} />
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <div style={{ fontSize: 10, opacity: 0.3, fontFamily: "monospace", marginTop: 4, textAlign: "right" }}>
                        ↓ {funnelSteps[i+1].n} seguiram ({Math.round((funnelSteps[i+1].n/step.n)*100)}%)
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 14, marginTop: 4, fontFamily: "monospace", fontSize: 10, opacity: 0.45, lineHeight: 2 }}>
                <div>Resposta: <strong style={{ opacity: 1 }}>{Math.round((responderam/total_wpp)*100)}%</strong></div>
                <div>Engajamento real: <strong style={{ opacity: 1 }}>{Math.round((engajaram/total_wpp)*100)}%</strong></div>
              </div>
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.sec}>Desfecho das Conversas</div>
            <div style={{ marginTop: 4 }}>
              {outcomeData.map(d => <HBar key={d.label} label={d.label} total={d.total} max={outcomeMax} />)}
            </div>
            <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 12, marginTop: 10, fontFamily: "monospace", fontSize: 10, opacity: 0.35, lineHeight: 2 }}>
              <div>⚠ 2 sessões com bug de disparo múltiplo identificadas</div>
              <div>⚠ Logs de tool_call salvos como mensagem no banco</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 9, letterSpacing: "0.16em", opacity: 0.2, paddingTop: 24, textTransform: "uppercase" }}>
          Dalton Lab · Uso Interno · {RAW_LEADS.length} registros
        </div>

      </div>
    </div>
  );
}