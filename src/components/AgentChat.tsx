import { useEffect, useRef, useState, type FormEvent } from "react";
import { PaperPlaneRight, WhatsappLogo } from "@phosphor-icons/react";
import { AGENT_INTRO, AGENT_REPLIES, QUICK_REPLIES } from "../data/content";

interface Msg {
  role: "bot" | "user";
  text: string;
}

const intro: Msg[] = AGENT_INTRO.map((t) => ({ role: "bot", text: t }));

export default function AgentChat() {
  const [log, setLog] = useState<Msg[]>(intro);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const send = (userText: string, key?: string) => {
    if (!userText.trim()) return;
    const replies = (key && AGENT_REPLIES[key]) || [
      "Anoto tu consulta. Para responder con dato firme, la cruzo contra el Catastro y el Registro y te confirmo por acá.",
    ];
    setLog((l) => [...l, { role: "user", text: userText }]);
    setInput("");
    replies.forEach((text, i) => {
      setTimeout(() => setLog((l) => [...l, { role: "bot", text }]), 420 * (i + 1));
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="chat">
      <div className="chat-head">
        <span className="ava" aria-hidden="true"><WhatsappLogo size={22} weight="fill" /></span>
        <div>
          <h3>Agente HABITA</h3>
          <p>WhatsApp Business · responde sobre datos oficiales</p>
        </div>
      </div>

      <div className="chat-log" ref={logRef}>
        {log.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.text}</div>
        ))}
      </div>

      <div className="chat-quick">
        {QUICK_REPLIES.map((q) => (
          <button key={q.key} onClick={() => send(q.label, q.key)}>{q.label}</button>
        ))}
      </div>

      <form className="chat-input" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí un mensaje al agente"
          aria-label="Mensaje"
        />
        <button className="btn btn-primary" type="submit" aria-label="Enviar">
          <PaperPlaneRight size={16} weight="fill" />
        </button>
      </form>
    </div>
  );
}
