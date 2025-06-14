import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Header } from '@/components/layout/header';
import { NewProjectButton } from '@/components/project/new-project-button';
import { ProjectsGrid } from '@/components/project/projects-grid';
import { useAuth } from '@/contexts/auth';

const Index = () => {
  const { user } = useAuth();

  const isCompany = user?.tipo === 'company';

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <ProjectsGrid />

      {isCompany && <NewProjectButton />}

      <BottomNavigation />
    </div>
  );
};

export default Index;
