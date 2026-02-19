import Dashboard, { Lead } from "@/components/Dashboard";

async function getLeads(): Promise<Lead[]> {
  const res = await fetch(process.env.API_URL!, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Falha ao buscar leads: ${res.status}`);
  return res.json();
}

export default async function Home() {
  const leads = await getLeads();
  return <Dashboard leads={leads} />;
}
