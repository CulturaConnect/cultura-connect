import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Header } from '@/components/layout/header';
import { NewProjectButton } from '@/components/project/new-project-button';
import { ProjectsGrid } from '@/components/project/projects-grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const Index = () => {
  const [tab, setTab] = useState<'all' | 'mine'>('all');

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as 'all' | 'mine')}
        className="px-4"
      >
        <TabsList>
          <TabsTrigger value="mine">Meus projetos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>
      </Tabs>

      <ProjectsGrid filterBy={tab} />

      <NewProjectButton />

      <BottomNavigation />
    </div>
  );
};

export default Index;
