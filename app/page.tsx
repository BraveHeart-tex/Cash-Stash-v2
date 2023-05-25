import getCurrentUser from './actions/getCurrentUser';
import Dashboard from './components/Dashboard';

export default async function Home() {
  const currentUser = await getCurrentUser();
  return (
    <main>
      <Dashboard user={currentUser} />
    </main>
  );
}
