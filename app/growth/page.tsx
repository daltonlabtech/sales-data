import GrowthDashboard, { GrowthRow } from "@/components/GrowthDashboard";

async function getGrowthData(): Promise<GrowthRow[]> {
  const res = await fetch(process.env.GROWTH_API_URL!, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Falha ao buscar growth data: ${res.status}`);
  return res.json();
}

export default async function GrowthPage() {
  const data = await getGrowthData();
  return <GrowthDashboard data={data} />;
}
