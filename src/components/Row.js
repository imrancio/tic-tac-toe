import React from "react";
import Cell from "./Cell";

const rowStyle = {
  display: "flex",
  justifyContent: "center"
};

const Row = ({
  cells,
  firstRow,
  lastRow,
  onClick,
  rowIndex,
  xColour,
  oColour
}) => (
  <div style={rowStyle}>
    {cells.map((col, i) => (
      <Cell
        key={i}
        colIndex={i}
        rowIndex={rowIndex}
        firstRow={firstRow}
        lastRow={lastRow}
        firstCol={i === 0}
        lastCol={i === cells.length - 1}
        onClick={onClick}
        player={col}
        xColour={xColour}
        oColour={oColour}
      />
    ))}
  </div>
);

export default Row;
