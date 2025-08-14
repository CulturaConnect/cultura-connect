import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Target,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  Paperclip,
  ArrowLeft,
  Briefcase,
  Eye,
  Heart,
  TrendingUp,
  Gift,
  DollarSign,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/api/projects/projects.queries";
import { useAuth } from "@/contexts/auth";
import { censurarDocumento } from "@/utils/helpers";
import EditProjectTab from "@/components/project/edit-project";
import { useState } from "react";
import { formatDateToPTBR } from "@/utils/date";

function getSegmentColor(segmento: string) {
  const colors: Record<string, string> = {
    musica: "bg-purple-100 text-purple-800 border-purple-200",
    teatro: "bg-red-100 text-red-800 border-red-200",
    danca: "bg-pink-100 text-pink-800 border-pink-200",
    artes: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return colors[segmento] || "bg-gray-100 text-gray-800 border-gray-200";
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const [tabs, setTabs] = useState<string>("details");
  const isOwner = user?.id === data?.company_id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br bg-white flex flex-col">
      <div className="w-full flex items-center justify-between p-4 border-b">
        <ArrowLeft
          className="size-5 text-gray-500 cursor-pointer mr-2"
          onClick={() => navigate("/")}
        />
        <h1 className="text-lg font-medium">Detalhes do Projeto</h1>
        <div className="w-5" />
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
        <Tabs
          value={tabs}
          defaultValue="details"
          className="space-y-8"
          onValueChange={setTabs}
        >
          <TabsList>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {isOwner && <TabsTrigger value="manage">Gerenciar</TabsTrigger>}
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            {/* Header */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
                <CardContent className="relative p-8">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        <img
                          src={data?.imagem_url || "/placeholder.svg"}
                          alt={data?.nome}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {data?.nome}
                          </h1>
                          <Badge
                            className={`${getSegmentColor(
                              data?.segmento
                            )} border`}
                          >
                            {data?.segmento.charAt(0).toUpperCase() +
                              data?.segmento.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-lg text-gray-600">{data?.resumo}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDateToPTBR(data?.inicio)} -{" "}
                            {formatDateToPTBR(data?.fim)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{data?.areas_execucao[0]?.cidade}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detalhes do Projeto */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="w-5 h-5 text-blue-600" />
                    Detalhes do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Objetivos Gerais e específicos
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.objetivos_gerais}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Metas</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.metas}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Retenção
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.modelo.retencao}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Apresentação
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.apresentacao}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Histórico
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.historico}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Descrição da Proposta
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.descricao_proposta}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Descrição da Contrapartida
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.descricao_contrapartida}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Justificativa
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data?.justificativa}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Localização */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Área de Execução
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {data?.areas_execucao.map((area, index) => (
                    <div key={index} className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">
                            Endereço:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {area.rua}, {area.numero}
                            {area.complemento && ` - ${area.complemento}`}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Bairro:
                          </span>
                          <p className="text-gray-600 mt-1">{area.bairro}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Cidade:
                          </span>
                          <p className="text-gray-600 mt-1">{area.cidade}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            CEP:
                          </span>
                          <p className="text-gray-600 mt-1">{area.cep}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Observações:
                        </span>
                        <p className="text-gray-600 mt-1">
                          {area?.observacoes}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {data?.modelo &&
              (data?.modelo.visao ||
                data?.modelo.missao ||
                data?.modelo.mercado ||
                data?.modelo.publico_alvo ||
                data?.modelo.proposta_valor ||
                data?.modelo.receita) && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      Modelo de Negócio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data?.modelo.visao && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              Visão
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.visao}
                          </p>
                        </div>
                      )}

                      {data?.modelo.missao && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-600" />
                            <h3 className="font-semibold text-gray-900">
                              Missão
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.missao}
                          </p>
                        </div>
                      )}

                      {data?.modelo.mercado && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <h3 className="font-semibold text-gray-900">
                              Mercado
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.mercado}
                          </p>
                        </div>
                      )}

                      {data?.modelo.publico_alvo && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            <h3 className="font-semibold text-gray-900">
                              Público Alvo
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.publico_alvo}
                          </p>
                        </div>
                      )}

                      {data?.modelo.proposta_valor && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">
                              Proposta de Valor
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.proposta_valor}
                          </p>
                        </div>
                      )}

                      {data?.modelo.receita && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <h3 className="font-semibold text-gray-900">
                              Receita
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {data?.modelo.receita}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cronograma */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Cronograma de Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {data?.cronograma_atividades.map((atividade, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">
                            {atividade.titulo}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {atividade.descricao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Equipe */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Equipe do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {data?.equipe.map((membro, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="./imagem.svg" />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                            {membro.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {membro.nome}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {membro.funcao}
                          </p>
                          <p className="text-xs text-gray-500">
                            CPF/CNPJ: {censurarDocumento(membro.cpf_cnpj)}
                          </p>
                        </div>
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Anexos */}
            {data?.anexos && data.anexos.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    Anexos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {data.anexos.map((anexo, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <a
                        href={anexo.arquivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {anexo.descricao ||
                          anexo.arquivo_url?.split("/").pop() ||
                          "Arquivo"}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isOwner && (
            <TabsContent value="manage">
              <EditProjectTab project={data} setInitialTab={setTabs} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
