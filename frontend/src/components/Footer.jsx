import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'
import { ArrowLeft, BookOpen } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/*  info */}
        <div className='mb-6 md:mb-0'>
            <Link to='/' className='flex gap-3 items-center'>
              {/* <img src={Logo} alt="" className='w-32'/> */}
              <BookOpen className="h-8 w-8 text-orange-600" />
              <ArrowLeft className="h-8 w-8 text-orange-600"/>
              {/* <h1 className='text-2xl font-semibold'>Torna alla Home</h1> */}
            </Link>
            <p className='mt-2'>Condivisione di approfondimenti, tutorial e idee sullo sviluppo web e sulla tecnologia.</p>
            <p className='mt-2 text-sm'>123 Blog St, Style City, NY 10001</p>
            <p className='text-sm'>Email: support@blog.com</p>
            <p className='text-sm'>Phone: (123) 456-7890</p>
        </div>
        {/* customer service link */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Quick Links</h3>
            <ul className='mt-2 text-sm space-y-2'>
                <li>Home</li>
                <li>Blogs</li>
                <li>About Us</li>
                {/* <li>Contact Us</li> */}
                <li>FAQs</li>
            </ul>
        </div>
        {/* social media links */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Follow Us</h3>
            <div className='flex space-x-4 mt-2'>
                <FaFacebook/>
                <FaInstagram/>
                <FaTwitterSquare/>
                <FaPinterest/>
            </div>
        </div>
        {/* newsletter subscription */}
        <div>
            <h3 className='text-xl font-semibold'>Rimani aggiornato</h3>
            <p className='mt-2 text-sm'>Iscriviti per ricevere informazioni e altro ancora</p>
            <form action="" className='mt-4 flex'>
                <input 
                type="email" 
                placeholder='Your email address'
                className='w-full p-2 rounded-l-md  text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                />
                <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>Iscriviti</button>
            </form>
        </div>
      </div>
      {/* bottom section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Blog</span>. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer