import {
  Bar,
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminMetrics } from "@/api/dashboard/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { formatDateToPTBR } from "@/utils/date";

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: getAdminMetrics,
  });

  const pieColors = ["#0ea5e9", "#059669", "#eab308", "#ef4444"];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
          <CardContent>
            Por favor, aguarde enquanto os dados são carregados.
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Projetos</CardTitle>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center text-3xl font-bold">
            {metrics.totalProjects}
          </CardContent>
        </Card>

        {metrics.totalUsers !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle>Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center text-3xl font-bold">
              {metrics.totalUsers}
            </CardContent>
          </Card>
        )}

        {metrics.totalCompanies !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle>Total de Empresas</CardTitle>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center text-3xl font-bold">
              {metrics.totalCompanies}
            </CardContent>
          </Card>
        )}
      </div>

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

      {metrics.projectsBySegment && (
        <Card>
          <CardHeader>
            <CardTitle>Projetos por Segmento</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.projectsBySegment}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {metrics.projectsBySegment.map((entry, index) => (
                    <Cell
                      key={`seg-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {metrics.usersByType && (
        <Card>
          <CardHeader>
            <CardTitle>Usuários por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.usersByType}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {metrics.usersByType.map((entry, index) => (
                    <Cell
                      key={`user-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {metrics.projectsByMonth && (
        <Card>
          <CardHeader>
            <CardTitle>Projetos</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.projectsByMonth}>
                <XAxis
                  dataKey="month"
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return "Data Inválida";
                    return formatDateToPTBR(new Date(value));
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label: string) => {
                    const date = new Date(label);
                    if (isNaN(date.getTime())) return "Data Inválida";
                    return formatDateToPTBR(date);
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <BottomNavigation />
    </div>
  );
}
