import React from "react";

const defaultBorder = "1px solid white";
const size = 8; // rem

const Cell = ({
  firstRow,
  lastRow,
  firstCol,
  lastCol,
  onClick,
  colIndex,
  rowIndex,
  player
}) => {
  const cellStyle = {
    borderLeft: firstCol ? "none" : defaultBorder,
    borderRight: lastCol ? "none" : defaultBorder,
    borderTop: firstRow ? "none" : defaultBorder,
    borderBottom: lastRow ? "none" : defaultBorder,
    height: `${size}rem`,
    width: `${size}rem`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: `${size * 0.5}rem`,
    color: player === "X" ? "#0E6EB8" : "#FE9A76"
  };
  const indexes = { colIndex, rowIndex };
  return (
    <div
      style={cellStyle}
      onClick={() => {
        if (!player) {
          onClick(indexes);
        }
      }}
    >
      {player}
    </div>
  );
};

export default Cell;
