'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xl shadow-zinc-950/10 hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-transparent',
            secondary: 'bg-[#8FA998] text-white shadow-lg shadow-[#8FA998]/20 hover:bg-[#6C8E77] border border-[#8FA998]/20',
            outline: 'bg-transparent border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white text-zinc-950 dark:text-white',
            ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white',
            glass: 'bg-white/10 dark:bg-zinc-900/50 backdrop-blur-md border border-white/20 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-white hover:bg-white/20 dark:hover:bg-zinc-800 transition-all'
        }

        const sizes = {
            sm: 'px-4 py-2 text-xs rounded-xl',
            md: 'px-6 py-3 text-sm rounded-2xl',
            lg: 'px-8 py-4 text-base rounded-2xl',
            xl: 'px-10 py-5 text-lg rounded-[2rem]'
        }

        return (
            <motion.button
                ref={ref as any}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none overflow-hidden group',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Shine Animation Overlay */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />

                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {leftIcon && <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity">{rightIcon}</span>}
                    </>
                )}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'
