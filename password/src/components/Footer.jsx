import React from 'react'

const Footer = () => {
  return (
    <div>
        <div className='bg-purple-900 flex flex-col justify-center items-center fixed bottom-0 w-full'>
            <div className=" logo font-bold text-white text-2xl hover:scale-110 transition duration-300 cursor-pointer">
                <h1>
                    <span className='text-green-600'> &lt;</span> 
                        VΛULT
                    <span className='text-green-700'>X/&gt;</span>
                </h1>
            </div>
            <p className="text-white mt-2">
                Created by Pranav, Goldi & Ujjwal
            </p>
        </div>
    </div>
  )
}

export default Footer
