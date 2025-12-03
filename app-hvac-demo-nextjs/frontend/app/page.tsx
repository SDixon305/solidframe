import styles from './landing.module.css'
import Link from 'next/link'

export default function Home() {
    return (
        <div className={styles.landingWrapper}>
            <div className={styles.backgroundGlow}></div>

            <header className={styles.glassHeader}>
                <div className={styles.container}>
                    <div className={styles.logo}>SolidFrame<span className={styles.highlight}>.ai</span></div>
                    <nav className={styles.nav}>
                        <Link href="#solutions">Solutions</Link>
                        <Link href="#about">About</Link>
                        <Link href="#contact" className={`${styles.btnPrimary} ${styles.small}`}>Contact Us</Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>Intelligent Automation Systems</div>
                            <h1 className={styles.h1}>Building the <span className={styles.textGradient}>Future of Work</span>.</h1>
                            <p className={styles.heroSub}>We deploy custom AI agents that automate complex workflows, reduce operational
                                overhead, and drive revenue growth.</p>
                            <div className="cta-group">
                                <Link href="/hvac" className={styles.btnPrimary}>View HVAC Solution</Link>
                                <Link href="#contact" className={styles.btnSecondary}>Partner With Us</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>&copy; 2025 SolidFrame.ai. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
