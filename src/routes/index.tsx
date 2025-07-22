import { createFileRoute } from '@tanstack/react-router';
import { WelcomeMessage } from '@/components/WelcomeMessage';

export const Route = createFileRoute('/')({
  component: WelcomeMessage,
}); 