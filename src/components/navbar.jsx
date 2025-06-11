'use client'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut } from 'lucide-react'
import React from 'react'
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const {user, logout} = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }
  return (
    <nav className='flex px-6 py-8 justify-between items-center'>
        <div>
            <h1 className='text-xl tracking-wide font-semibold '>VERIFIED HOMES</h1>
        </div>
        <div className='flex space-x-6'>
            <h1>{user?.name}</h1>
            <LogOut onClick={handleLogout} className='text-slate-700 font-semibold hover:text-slate-500 cursor-pointer' />
        </div>
    </nav>
  )
}

export default Navbar