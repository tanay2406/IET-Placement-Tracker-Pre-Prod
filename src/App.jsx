import { useState } from 'react'
import { motion } from 'framer-motion'
import BatchData from './components/BatchData'
import Header from './components/Header'
import Footer from './components/Footer'
import { ArrowUpRight } from 'lucide-react'

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null)

  return (
    <>
<div className="relative font-['Poppins'] bg-grid-black/[0.2] z-10 min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-indigo-900 text-white flex flex-col
">
        
        <section className='z-30 bg-cover min-h-screen' style={{
          /*backgroundImage: "url('/gridNew.png')",*/
        }}>

          {/* Header */}
          <div className='px-4 py-6 md:py-10 '>
            <Header showToolTip={true}/>
          </div>

          <main className="my-6 md:my-12 mt-6 flex-grow flex flex-col items-center justify-center text-center px-4">
            {/* Heading */}
           <motion.h1
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-3xl md:text-6xl font-bold mb-3 text-white"
>
  IET DAVV Placements
</motion.h1>

            {/* Sub-Heading */}
            <motion.p
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="text-lg md:text-lg mb-2 text-blue-100 leading-tight"
>
  Company-wise IET DAVV Indore Placement Data — 2026 Batch Onwards



        
        {/* news thing */}

</motion.p>
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  whileHover={{ scale: 1.03 }}
  className="relative mt-8 cursor-pointer group max-w-2xl mx-auto"
>

  {/* Glow */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
    from-purple-600 via-blue-600 to-indigo-600 
    blur-xl opacity-40 group-hover:opacity-70 
    animate-pulse transition-all duration-500" />

  <div className="relative overflow-hidden px-8 py-6 rounded-2xl 
    bg-gradient-to-r from-purple-900/60 via-blue-900/60 to-indigo-900/60
    backdrop-blur-md border border-white/10
    shadow-2xl text-center">

    {/* Limited Badge */}
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="inline-block mb-3 bg-red-500/20 border border-red-500 
      text-red-400 px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
    >
      🔥 Only Limited Free Slots
    </motion.div>

    <h3 className="text-lg md:text-xl font-bold text-white">
      1-on-1 Placement Consultation
    </h3>

    <p className="text-blue-200 text-sm mt-1">
      Talk directly with 2026 seniors and clear all your placement doubts.
    </p>

    <motion.div
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="mt-3 flex justify-center"
    >
      <span className="text-blue-300 flex items-center gap-2 font-medium">
        Book Your Free Session Now
      </span>
    </motion.div>

  </div>
</motion.div>




                    
            {/* Improved Batch Links */}
            <div className="mt-8 md:mt-12 w-full flex flex-col sm:flex-row items-center gap-5 justify-center">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(59, 130, 246, 0.1)" 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBatch('2026')}
                className={`relative cursor-pointer px-8 py-3 rounded-xl flex items-center gap-3 
                  backdrop-blur-sm transition-colors duration-300
                  ${selectedBatch === '2026' 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'} 
                  border-2 shadow-lg shadow-black/10`}
              >
                <span className="text-base font-medium">2026 Batch</span>
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowUpRight className={`w-5 h-5 ${selectedBatch === '2026' ? 'text-blue-200' : 'text-gray-400'}`}/>
                </motion.div>
              </motion.button>

            </div>
            
            {selectedBatch && <BatchData batch={selectedBatch} />}
          
            {/* <img src='heroSection.png' className='w-full sm:w-[80%] mt-20 rounded-sm sm:rounded-lg shadow-[0_0px_20px_#FFFFFF4D]'/> */}
           
          </main>

          {/* Footer */}
          <Footer />
        </section>

      </div>
    </>
    
  )
}

