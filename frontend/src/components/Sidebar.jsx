import { ChartColumnBig, SquareUser, PhoneForwarded, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { FaRegListAlt } from 'react-icons/fa';
import { LuFilePlus2 } from "react-icons/lu";
import { getData } from '@/context/userContext'

const Sidebar = () => {
  const { logout } = getData(); // Importa il metodo logout dal context dove è definito e centralizzato
  return (
    <div className='sidebar no-print hidden mt-10 fixed lg:block border-r-2 dark:bg-gray-800 bg-gray-50 border-gray-300 border-r-gray-500 dark:border-gray-600 0  p-10 space-y-2 h-screen z-10 '>
      <div className='text-center pt-10 px-3 space-y-2'>
        <NavLink to='/dashboard/profile' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full`}>
          <SquareUser />
          <span>Profilo</span>
        </NavLink>
        <NavLink to='/dashboard/your-blog' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full`}>
          <ChartColumnBig />
          <span>I Miei Blogs</span>
        </NavLink>
        <NavLink to='/dashboard/vista-tabellare' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full`}>
          <FaRegListAlt />
          <span>Lista Blogs</span>
        </NavLink>
        <NavLink to='/dashboard/rubrica' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full`}>
          <PhoneForwarded />
          <span>Rubrica</span>
        </NavLink>
        <NavLink to='/dashboard/write-blog' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full`}>
          <LuFilePlus2/>
          <span>Nuovo Blog</span>
        </NavLink>
        <hr className=" w-48 text-center border-1 border-gray-500 rounded-full" />
        <button
          onClick={logout}
          className="text-2xl bg-transparent flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-2xl w-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogOut />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
