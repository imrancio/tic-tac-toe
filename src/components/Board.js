import React from "react";
import Row from "./Row";

const Board = ({ rows, onClick, xColour, oColour }) => (
  <div>
    {rows.map((row, i) => (
      <Row
        key={i}
        rowIndex={i}
        cells={row}
        firstRow={i === 0}
        lastRow={i === rows.length - 1}
        onClick={onClick}
        xColour={xColour}
        oColour={oColour}
      />
    ))}
  </div>
);

export default Board;
