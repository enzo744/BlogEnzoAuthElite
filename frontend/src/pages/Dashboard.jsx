import React from 'react'
import { Outlet } from 'react-router-dom'
import { UserProvider } from "@/context/userContext";
import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from "@/components/ProtectedRoute";


const Dashboard = () => {
//   return (
//     <div className='flex'>
//         <Sidebar/>
//         <div className="flex-1">
//             <Outlet/>
//         </div>
//     </div>
//   )
// }
return (
    <UserProvider>
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
          {/* Navbar fissa in alto */}
          <Navbar />

          {/* Contenuto principale con Sidebar + Outlet */}
          <div className="flex flex-1 ">
            <Sidebar />

            <main className="flex-1 p-4 overflow-x-auto">
              <Outlet />
            </main>
          </div>

          {/* Footer (facoltativo nel dashboard) */}
          {/* <Footer /> */}
        </div>
      </ProtectedRoute>
    </UserProvider>
  );
};
export default Dashboard