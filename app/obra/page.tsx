import { ROUTES } from '@/lib/constant';
import { redirect } from 'next/navigation';

export default function ObraPage() {
  redirect(ROUTES.projects.path);
}