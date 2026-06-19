"use client";

import { useScrollReveal } from "./useScrollReveal";

export default function Reveal({ children, delay = 0 }) {
    const [ref, visible] = useScrollReveal();

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}