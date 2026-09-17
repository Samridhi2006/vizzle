import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0E0C0A] flex items-center justify-center p-4">
      <SignInModal isOpen={true} onClose={() => navigate(-1)} />
    </div>
  );
}
