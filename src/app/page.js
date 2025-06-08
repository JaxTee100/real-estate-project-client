'use client'
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


export default function Home() {
const router = useRouter();
  const { logout } = useAuthStore();
  async function handleLogout() {
    await logout();
    router.push("/login");
  }
  return (
    <div>
      <header className="flex items-center justify-between">
        <LogOut onClick={handleLogout}/>
          <h1>All Houses</h1>
          <Button onClick={() => router.push("/super-admin/products/add")}>
            Add New House
          </Button>
        </header>
    </div>
  );
}
