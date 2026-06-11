import { MagnifyingGlass } from "@phosphor-icons/react";
import { MUNICIPIOS } from "../data/content";

interface Props {
  municipio: string;
  setMunicipio: (m: string) => void;
}

export default function Topbar({ municipio, setMunicipio }: Props) {
  return (
    <header className="topbar">
      <div className="tb-search">
        <MagnifyingGlass size={16} />
        <input
          type="search"
          placeholder="Buscá por nomenclatura, dirección o titular"
          aria-label="Buscar parcela"
        />
      </div>
      <label className="tb-muni">
        Municipio
        <select value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
          {MUNICIPIOS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <div className="tb-right">
        <span className="tb-live">
          <i />
          en vivo
        </span>
        <span className="tb-avatar" aria-hidden="true">
          CI
        </span>
      </div>
    </header>
  );
}
