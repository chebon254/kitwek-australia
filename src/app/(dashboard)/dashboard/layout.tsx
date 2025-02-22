import Navbar from '@/components/Navbar/Navbar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="bg-white text-[#2C2C2C] navbar-text" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-6">
          {children}
        </div>
      </main>
    </div>
  );
}