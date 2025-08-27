import SubNavBar from '@/components/SubNavBar';

export default function AyurvedicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SubNavBar />
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}
