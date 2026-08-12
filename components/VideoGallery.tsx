"use client"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { Play } from "lucide-react"

interface VideoGalleryProps {
  videos: string[]
  title?: string
  subtitle?: string
}

function VideoItem({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      videoRef.current.muted = false 
      setIsPlaying(true)
    }
  }

  // Adding #t=0.001 forces browsers to load the first frame as the poster
  const videoSrcWithFrame = src.includes("#") ? src : `${src}#t=0.001`

  return (
    <div className="relative w-full h-full group cursor-pointer bg-[#000]" onClick={!isPlaying ? handlePlay : undefined}>
      <video
        ref={videoRef}
        src={videoSrcWithFrame}
        className="w-full h-full object-cover transition-opacity duration-500"
        controls={isPlaying}
        playsInline
        preload="metadata"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] bg-[#C8963E]/90 hover:bg-[#C8963E] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform group-hover:scale-110 border-2 border-white/20">
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function VideoGallery({ videos, title = "Video Showcase", subtitle = "Watch our process in action" }: VideoGalleryProps) {
  if (!videos || videos.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F4] border-t border-[#DDD8CF]">
      <div className="sec-wrap">
        <div className="text-center mb-12">
          <p className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-[#C8963E] mb-3">
            {subtitle}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#16261A]">
            {title}
          </h2>
          <div className="w-10 h-[2px] bg-[#C8963E] mx-auto mt-4" />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {videos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-black shadow-lg border border-[#DDD8CF]"
              style={{ width: '100%', maxWidth: '380px', aspectRatio: '4/5' }}
            >
              <VideoItem src={src} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
