import React from "react";

export function renderWithLineBreaks(text: string): React.ReactNode {
  const lines = text.split(/\r?\n/);
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}
