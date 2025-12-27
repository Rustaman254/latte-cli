"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

interface SpltTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  variant?: "reveal" | "fade" | "slide"
}

export function SpltText({ text, className = "", delay = 0, stagger = 0.02, variant = "reveal" }: SpltTextProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const variants = {
    hidden: {
      y: variant === "reveal" ? "100%" : 0,
      opacity: variant === "fade" ? 0 : 1,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay + i * stagger,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  return (
    <span ref={ref} className={`inline-block overflow-hidden py-[0.1em] -my-[0.1em] ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="inline-block whitespace-pre splt-char"
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}
