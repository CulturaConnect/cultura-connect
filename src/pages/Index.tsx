import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Header } from '@/components/layout/header';
import { NewProjectButton } from '@/components/project/new-project-button';
import { ProjectsGrid } from '@/components/project/projects-grid';
import NewUserTour from '@/components/tour/NewUserTour';

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <NewUserTour />
      <Header />

      <ProjectsGrid />

      <NewProjectButton />

      <BottomNavigation />
    </div>
  );
};

export default Index;
