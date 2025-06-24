import { useEffect, useState } from 'react';
import Joyride, { Step } from 'react-joyride';

const steps: Step[] = [
  {
    target: '#search-input',
    content: 'Use a busca para encontrar projetos rapidamente.',
  },
  {
    target: '#new-project-button',
    content: 'Clique aqui para criar um novo projeto.',
  },
  {
    target: '#bottom-navigation',
    content: 'Use este menu para navegar pela aplicação.',
  },
];

export default function NewUserTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('joyrideCompleted');
    if (!completed) {
      setRun(true);
    }
  }, []);

  const handleCallback = ({ status }: { status: string }) => {
    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem('joyrideCompleted', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
      }}
      locale={{ back: 'Voltar', last: 'Finalizar', next: 'Próximo', skip: 'Pular' }}
      callback={handleCallback}
    />
  );
}
