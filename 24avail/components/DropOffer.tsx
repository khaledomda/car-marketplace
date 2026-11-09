"use client";
import { useState } from "react";
import { ApplyForm } from "./ApplyForm";

export function DropOffer({ title, sub, cta, labels, close }: { title: string; sub: string; cta: string; close: string; labels: Parameters<typeof ApplyForm>[0]["labels"] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="offer drop" onClick={() => setOpen(true)}>
        <h4 className="display">{title}</h4>
        <p>{sub}</p>
        <span className="btn btn-clay btn-sm" style={{ marginTop: 10 }}>{cta}</span>
      </button>
      {open && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setOpen(false)} role="dialog" aria-modal="true" aria-label={title}>
          <div className="modal">
            <div className="card-h"><h3 className="display">{title}</h3><button className="x" onClick={() => setOpen(false)} aria-label={close}>✕</button></div>
            <div className="card-b"><p className="muted" style={{ marginTop: 0 }}>{sub}</p><ApplyForm kind="advertiser" labels={labels} /></div>
          </div>
        </div>
      )}
    </>
  );
}
