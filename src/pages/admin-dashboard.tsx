import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminMetrics } from '@/api/dashboard/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Header } from '@/components/layout/header';

export default function AdminDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics,
  });

  const pieColors = ['#0ea5e9', '#059669', '#eab308', '#ef4444'];

  if (!metrics) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Nenhum dado encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            Os dados do dashboard não estão disponíveis.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4 pt-4 pb-20">
      <Header showSearch={false} />

      <Card>
        <CardHeader>
          <CardTitle>Total de Projetos</CardTitle>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center text-4xl font-bold">
          {metrics.totalProjects}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Projetos por Status</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.projectsByStatus}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribuição</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.projectsByStatus}
                dataKey="count"
                nameKey="status"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {metrics.projectsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
}
