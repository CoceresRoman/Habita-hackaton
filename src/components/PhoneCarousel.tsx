import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import WhatsappPhone from "./WhatsappPhone";
import PropertyPhone from "./PropertyPhone";

const PHONES = [
  {
    id: "whatsapp",
    component: WhatsappPhone,
    label: "Agente IA por WhatsApp",
    description: "Consultas sobre lotes, valuaciones y pre-calificación para crédito UVA.",
  },
  {
    id: "properties",
    component: PropertyPhone,
    label: "Explorador de propiedades",
    description: "Deslizá entre lotes, propiedades y alquileres verificados.",
  },
];

export default function PhoneCarousel() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (reduce) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % PHONES.length);
    }, 15000); // Swipe every 15 seconds

    return () => clearInterval(interval);
  }, [reduce]);

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      },
    }),
  };

  const ActivePhone = PHONES[activeIndex].component;

  return (
    <div className="phone-carousel">
      <div className="phone-carousel-track">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="phone-carousel-item"
          >
            <ActivePhone />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="phone-carousel-info">
        <div className="phone-carousel-dots">
          {PHONES.map((phone, i) => (
            <button
              key={phone.id}
              className={`phone-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={phone.label}
            />
          ))}
        </div>
        <motion.p
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="phone-carousel-label"
        >
          {PHONES[activeIndex].label}
        </motion.p>
      </div>
    </div>
  );
}
