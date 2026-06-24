/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

import { auth, db } from './firebase-config'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'

import {
  RiGoogleFill,
} from '@remixicon/react'

export default function App() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Login Status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    })
    return () => unsubscribe();
  }, []);

  // Ambil Data Chat
  useEffect(() => {
    if(!user) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataPesan = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(dataPesan)
    })

    return () => unsubscribe();
  }, [user]);

  // Fungsi Login
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
  }

  // Fungsi Submit Pesan
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(input.trim() === '') return;

    await addDoc(collection(db, "messages"), {
      text: input,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    })

    setInput('')
  }

  return (
    <>
      <div className="w-full md:min-h-dvh min-h-[100vh] bg-zinc-950 relative flex items-center">
        {!user ? (
          <LoginArea handleLogin={handleLogin}/>
        ) : (
          <MessageArea signOut={signOut} messages={messages} handleSubmit={handleSubmit} input={input} setInput={setInput} user={user}/> 
        )}
      </div>
    </>
  )
}

function LoginArea({handleLogin}) {
  return (
    <>
    <div className='absolute w-full h-full scale-125 bg-linear-to-tr from-zinc-950 via-zinc-400 to-zinc-950 
            from-[40%] via-[50%] to-[60%]
            bg-[length:300%_300%] animate-wave z-0 opacity-0'></div>
      <div className="w-full md:min-h-dvh min-h-[100vh] mx-auto z-20 backdrop-blur-3xl bg-[repeating-linear-gradient(45deg,transparent,transparent_30px,var(--color-zinc-900)_30px,var(--color-zinc-900)_31px)]">
        <div className='w-fit p-6 h-fit bg-zinc-800 fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center rounded-xl border border-x-zinc-300/15 border-y-zinc-400/15'>
        <h1 className='text-2xl text-white font-medium mb-4'>Sign In</h1>
          <button onClick={handleLogin} className="bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer py-2 px-4 rounded-full flex gap-2 border border-x-zinc-300/15 border-y-zinc-400/15 hover:border-zinc-300/40 transition-all group">
            <RiGoogleFill className='group-hover:scale-110 transition-all'/>
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  )
}

function MessageArea({signOut, messages, handleSubmit, input, setInput, user}) {
  const data = {
    text: "Haloo semuaa, kenalin gw konci gede panggil aja konde",
    displayName: "Konci Gede",
  }

  return (
    <>
      <div className="lg:w-full bg-zinc-900 w-[90%] lg:max-w-7xl h-[90dvh] mx-auto rounded-2xl border border-x-zinc-300/15 border-y-zinc-400/15 overflow-hidden flex flex-col">
        {/* Header */}
        <div className='w-full h-fit p-4 border-b border-b-zinc-700 bg-zinc-800/40 flex items-center justify-between md:justify-center'>
          <h1 className='text-white text-xl font-medium text-center font-mono'>Public Chat Room</h1>

          {/* Mobile */}
          <div className='justify-self-end flex gap-4 items-center md:hidden'>
              <button onClick={() => signOut(auth)} className='w-fit h-fit bg-red-500 text-white py-2 px-4 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 hover:bg-red-600 transition-all'>Logout</button>
              <div className='w-10 h-10 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 overflow-hidden'>
                <img src={user.photoURL} alt="" />
              </div>
          </div>
        </div>

        {/* Chat */}
        <div className='w-full overflow-y-auto flex flex-col gap-2 flex-1 px-4 pt-4'>
          <span className='font-mono text-xs text-white/40 text-center'>Welcome To Public Chat Room (by Rafif [Rafal])</span>
          <span className='font-mono text-xs text-white/40 text-center'>This is the top.</span>
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} user={user} text={msg.text} displayName={msg.displayName}/>
          ))}
        </div>

        {/* Menu */}
        <div className='w-full h-fit my-auto p-4 flex items-center gap-2'>
          {/* Form */}
          <form className='w-full gap-2 flex' onSubmit={handleSubmit}>
            <input value={input} onChange={((e) => setInput(e.target.value))} type="text" placeholder='Ketik Pesan' className='py-2 px-4 text-white rounded-full w-full md:w-1/4 border border-x-zinc-300/15 border-y-zinc-400/15 hover:border-zinc-300/40 transition-all focus:border-zinc-300 outline-0'/>
            <button type='submit' className='w-fit h-fit bg-blue-600 text-white py-2 px-4 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 hover:bg-blue-700 transition-all'>Send</button>
          </form>

          {/* Info Desktop */}
          <div className='justify-self-end hidden gap-4 items-center md:flex'>
              <button onClick={() => signOut(auth)} className='w-fit h-fit bg-red-500 text-white py-2 px-4 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 hover:bg-red-600 transition-all'>Logout</button>
              <div className='w-10 h-10 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 overflow-hidden'>
                <img src={user.photoURL} alt="" />
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Message({text, displayName, msg, user}) {

  const DEVELOPER_UID = '8NnFTylZykY1iSBMQfzKEFcu2HB3';
  const isDeveloper = msg.uid === DEVELOPER_UID;

  return (
    <>
      <div className={`flex flex-col gap-1 ${msg.uid === user.uid ? 'items-end' : 'items-start'}`}>
        <div className={`flex gap-2 items-center ${ msg.uid === user.uid ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className='w-4 h-4 rounded-full cursor-pointer border border-x-zinc-300/15 border-y-zinc-400/15 overflow-hidden'>
            <img src={msg.photoURL} alt="" />
          </div>
          <span className={`font-mono text-xs ${isDeveloper ? 'text-amber-400' : 'text-white'}`}>
            {msg.uid === user.uid ? 'You' : displayName}
          </span>
          {isDeveloper && (
            <span className='text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-sm font-mono font-bold uppercase tracking-wider animate-pulse'>
              [Developer]
            </span>
          )}
        </div>
        <div className={`w-fit h-fit py-2 px-4 text-white rounded-bl-full ${msg.uid === user.uid ? 'rounded-tl-full bg-blue-500' : 'rounded-tr-full '} ${isDeveloper ? 'bg-amber-400/40 border border-amber-400/80 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''} rounded-br-full border border-x-zinc-300/15 border-y-zinc-400/15`}>{text}</div>
      </div>
    </>
  )
}