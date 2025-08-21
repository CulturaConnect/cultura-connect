import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { NewProjectButton } from "@/components/project/new-project-button";
import { ProjectsGrid } from "@/components/project/projects-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SponsorsSection from "@/components/layout/SponsorsSection";

const Index = () => {
  const [tab, setTab] = useState<"all" | "mine">("all");

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      {/* Header fixo opcional (fica colado no topo e não rola junto) */}
      <div className="sticky top-0 z-20 bg-white">
        <Header />
      </div>

      {/* Área scrollável que ocupa o resto da tela */}
      <div className="flex-1 min-h-screen px-4 pb-28 pt-2">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "all" | "mine")}
          className="pb-2"
        >
          <TabsList>
            <TabsTrigger value="mine">Meus projetos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>

        <ProjectsGrid filterBy={tab} />

        <NewProjectButton />
      </div>

      <footer className="bg-gray-100 w-full py-6 pb-32">
        <SponsorsSection showTitle={false} className="max-w-5xl mx-auto" />
      </footer>

      {/* BottomNavigation fixo no fundo da viewport */}
      <div className="sticky bottom-0 z-20 bg-white">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Index;
