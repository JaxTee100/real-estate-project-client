'use client'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut } from 'lucide-react'
import React from 'react'
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const {logout} = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }
  return (
    <nav className='flex px-6 py-8 justify-between border border-red-500'>
        <div>
            <h1>Verified Interiors</h1>
        </div>
        <div className='flex space-x-6'>
            <h1>Username</h1>
            <LogOut onClick={handleLogout} className='text-slate-700 font-semibold hover:text-slate-500 cursor-pointer' />
        </div>
    </nav>
  )
}

export default Navbar