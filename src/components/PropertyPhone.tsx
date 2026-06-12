import { useState, useEffect } from "react";
import { Heart, X, MapPin, Ruler, House } from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const PROPERTIES = [
  {
    id: 1,
    type: "Lote",
    title: "Lote en Posadas Centro",
    location: "Posadas, Misiones",
    price: "USD 45.000",
    size: "450 m²",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    type: "Alquiler",
    title: "Depto 2 amb Av. Corrientes",
    location: "Posadas, Misiones",
    price: "$180.000/mes",
    size: "58 m²",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=500&fit=crop",
  },
  {
    id: 3,
    type: "Propiedad",
    title: "Casa 3 dormitorios",
    location: "Oberá, Misiones",
    price: "USD 85.000",
    size: "180 m²",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=500&fit=crop",
  },
  {
    id: 4,
    type: "Lote",
    title: "Terreno con vista al río",
    location: "Eldorado, Misiones",
    price: "USD 32.000",
    size: "800 m²",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=500&fit=crop",
  },
];

export default function PropertyPhone() {
  const reduce = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProperty = PROPERTIES[currentIndex % PROPERTIES.length];

  useEffect(() => {
    if (reduce) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        // Alternate between like and pass
        const newDirection = Math.random() > 0.3 ? "right" : "left";
        handleSwipe(newDirection);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, reduce]);

  const handleSwipe = (dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const variants = {
    enter: {
      scale: 0.95,
      opacity: 0,
    },
    center: {
      scale: 1,
      x: 0,
      rotate: 0,
      opacity: 1,
    },
    exit: (dir: "left" | "right" | null) => ({
      x: dir === "left" ? -300 : dir === "right" ? 300 : 0,
      rotate: dir === "left" ? -15 : dir === "right" ? 15 : 0,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="phone property-phone" role="img" aria-label="App de propiedades estilo Tinder">
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen prop-screen">
        <div className="prop-head">
          <House size={18} weight="fill" />
          <span>HABITA</span>
          <span className="prop-badge">Propiedades</span>
        </div>

        <div className="prop-cards">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentIndex}
              className="prop-card"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85)), url(${currentProperty.image})`,
              }}
            >
              <span className="prop-type">{currentProperty.type}</span>
              <div className="prop-info">
                <h3>{currentProperty.title}</h3>
                <p className="prop-loc">
                  <MapPin size={12} weight="fill" /> {currentProperty.location}
                </p>
                <div className="prop-meta">
                  <span><Ruler size={12} /> {currentProperty.size}</span>
                  <span className="prop-price">{currentProperty.price}</span>
                </div>
              </div>

              {direction && (
                <div className={`prop-stamp ${direction === "right" ? "like" : "nope"}`}>
                  {direction === "right" ? "ME INTERESA" : "PASO"}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="prop-actions">
          <button
            className="prop-btn nope"
            onClick={() => handleSwipe("left")}
            aria-label="Pasar"
          >
            <X size={24} weight="bold" />
          </button>
          <button
            className="prop-btn like"
            onClick={() => handleSwipe("right")}
            aria-label="Me interesa"
          >
            <Heart size={24} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
