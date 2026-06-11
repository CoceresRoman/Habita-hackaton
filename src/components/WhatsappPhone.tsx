import { useEffect, useRef, useState } from "react";
import { Phone, VideoCamera, DotsThreeVertical, Plus, Microphone } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { WHATSAPP_DEMO } from "../data/content";

export default function WhatsappPhone() {
  const reduce = useReducedMotion();
  const total = WHATSAPP_DEMO.length;
  const [shown, setShown] = useState(reduce ? total : 0);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setShown(0);
      setTyping(false);
      let t = 700;
      WHATSAPP_DEMO.forEach((m, i) => {
        if (m.side === "in") {
          timers.current.push(setTimeout(() => !cancelled && setTyping(true), t));
          t += 850;
          timers.current.push(
            setTimeout(() => {
              if (cancelled) return;
              setTyping(false);
              setShown(i + 1);
            }, t)
          );
          t += 550;
        } else {
          timers.current.push(setTimeout(() => !cancelled && setShown(i + 1), t));
          t += 950;
        }
      });
      // loop after a pause
      timers.current.push(setTimeout(() => !cancelled && run(), t + 3200));
    };
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
  }, [reduce]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [shown, typing, reduce]);

  return (
    <div className="phone" role="img" aria-label="Conversación de WhatsApp con el agente de HABITA resolviendo una consulta sobre un lote">
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="wa-head">
          <div className="wa-ava" aria-hidden="true">H</div>
          <div className="wa-who">
            <b>HABITA</b>
            <span>en línea</span>
          </div>
          <div className="wa-actions" aria-hidden="true">
            <VideoCamera size={17} weight="fill" />
            <Phone size={16} weight="fill" />
            <DotsThreeVertical size={18} weight="bold" />
          </div>
        </div>

        <div className="wa-body" ref={bodyRef}>
          <div className="wa-day" aria-hidden="true">hoy</div>
          {WHATSAPP_DEMO.slice(0, shown).map((m, i) => (
            <div key={i} className={`wa-msg ${m.side}`}>
              {m.text}
              <span className="wa-time">{m.time}</span>
            </div>
          ))}
          {typing && (
            <div className="wa-msg in wa-typing" aria-hidden="true">
              <i /><i /><i />
            </div>
          )}
        </div>

        <div className="wa-input" aria-hidden="true">
          <Plus size={18} />
          <span>Mensaje</span>
          <Microphone size={17} weight="fill" />
        </div>
      </div>
    </div>
  );
}
