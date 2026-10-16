/**
 * Une las líneas de un texto con salto de línea SOLO en escritorio (xl), para respetar los cortes del diseño.
 * En celular y tablet el texto fluye y se ajusta al ancho disponible (mejor lectura sin zoom).
 */
export function DesktopLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}
        </span>
      ))}
    </>
  );
}
