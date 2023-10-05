import NavigationTabs from "@/components/NavigationTabs";

export default async function Home() {
  return (
    <main>
      {/* @ts-expect-error */}
      <NavigationTabs />
    </main>
  );
}
