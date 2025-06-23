import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Header } from '@/components/layout/header';
import { NewProjectButton } from '@/components/project/new-project-button';
import { ProjectsGrid } from '@/components/project/projects-grid';

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />

      <ProjectsGrid />

      <NewProjectButton />

      <BottomNavigation />
    </div>
  );
};

export default Index;
