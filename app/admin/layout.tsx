import { AdminSidebar } from '../../components/AdminSidebar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout flex">
      <AdminSidebar />
      <div className="flex-1">
       
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
