import React from 'react'

function ErrorPage({status}) {
  return (
    <div className='relative flex items-center justify-center h-[100vh]'>
        <span 
        style={{
            fontFamily: "poppins"
        }} 
        className='font-bold font-sans text-3xl'>ERROR CODE : {status}</span>
    </div>
  )
}

export default ErrorPage