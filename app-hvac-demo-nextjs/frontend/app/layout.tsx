import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'SolidFrame AI - Enterprise Automation',
    description: 'SolidFrame AI builds intelligent automation systems for forward-thinking enterprises.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} font-sans`}>{children}</body>
        </html>
    )
}
