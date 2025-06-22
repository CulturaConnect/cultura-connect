import Logo from './Logo';
import Spinner from '../ui/spinner';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      <div className="mt-8">
        <Spinner />
      </div>
    </div>
  );
}
