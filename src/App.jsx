/* eslint-disable no-unused-vars */
import {
  RiGoogleFill,
} from '@remixicon/react'

export default function App() {

  return (
    <>
      <div className="w-full md:min-h-dvh min-h-[100vh] bg-zinc-950 relative">
          <LoginArea/>
      </div>
    </>
  )
}

function LoginArea() {
  return (
    <>
    <div className='absolute w-full h-full scale-125 bg-linear-to-tr from-zinc-950 via-zinc-400 to-zinc-950 
            from-[40%] via-[50%] to-[60%]
            bg-[length:300%_300%] animate-wave z-0 opacity-0'></div>
      <div className="w-full md:min-h-dvh min-h-[100vh] mx-auto z-20 backdrop-blur-3xl bg-[repeating-linear-gradient(45deg,transparent,transparent_30px,var(--color-zinc-900)_30px,var(--color-zinc-900)_31px)]">
        <div className='w-fit p-6 h-fit bg-zinc-800 fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center rounded-xl border border-x-zinc-300/15 border-y-zinc-400/15'>
        <h1 className='text-2xl text-white font-medium mb-4'>Sign In</h1>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer py-2 px-4 rounded-full flex gap-2 border border-x-zinc-300/15 border-y-zinc-400/15 hover:border-zinc-300/40 transition-all group">
            <RiGoogleFill className='group-hover:scale-110 transition-all'/>
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  )
}
