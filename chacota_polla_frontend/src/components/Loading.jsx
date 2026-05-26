import React from "react";

export default function Loading({ text = "Cargando..." }) {
  return <div className="loading">{text}</div>;
}
