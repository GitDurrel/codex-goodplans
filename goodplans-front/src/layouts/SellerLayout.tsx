import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/seller/SellerSidebar";

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px,1fr]">
          <aside className="rounded-2xl bg-white shadow-sm border border-gray-200">
            <SellerSidebar />
          </aside>
          <main className="rounded-2xl bg-white shadow-sm border border-gray-200 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
