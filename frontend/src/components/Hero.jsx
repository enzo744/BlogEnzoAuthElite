import blogAbout from '../assets/blog-about.avif'
import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { getData } from '@/context/userContext'

const Hero = () => {
    const {user} = getData()
  // const navigate = useNavigate()
  return (
    <div className='px-4 md:px-0 bg-sky-50 dark:bg-gray-700'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center h-[600px] my-10 md:my-0'>
        {/* text section */}
        <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 ">Welcome, {user ? " " + user.username : ""}</h1>
        <p className="text-lg md:text-xl opacity-80 mb-6">
          Resta aggiornato con articoli approfonditi, tutorial e approfondimenti su sviluppo web, marketing digitale e innovazioni tecnologiche.
        </p>
        <div className="flex space-x-4">
          <Link to={"/dashboard/write-blog"}><Button className="text-lg ">Crea un blog</Button></Link>
          <Link to={"/about"}><Button variant="outline" className="border-white px-6 py-3 text-lg">Altre Info</Button></Link>
        </div>
      </div>
        {/* image section */}
        <div className=' flex items-center justify-center '>
            <img src={blogAbout} alt="" className='md:h-[550px] md:w-[550px] object-scale-down'/>
        </div>
      </div>
    </div>
  );
};

export default Hero;