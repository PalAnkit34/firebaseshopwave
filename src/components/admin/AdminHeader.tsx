'use client'
import { Search, Bell, User } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none lg:hidden">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="relative mx-4 lg:mx-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-500" />
          </span>
          <input className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600" type="text" placeholder="Search" />
        </div>
      </div>
      <div className="flex items-center">
        <button className="flex mx-4 text-gray-600 focus:outline-none">
          <Bell className="w-6 h-6" />
        </button>
        <div className="relative">
            <div className="flex items-center gap-2">
                <User className="w-6 h-6" />
                <span>Admin</span>
            </div>
        </div>
      </div>
    </header>
  )
}
