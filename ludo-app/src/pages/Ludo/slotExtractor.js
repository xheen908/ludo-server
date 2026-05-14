export const extractSlotsFromLabels = (boardLayout, labels) => {
    const startPositions = {
      red: [],
      blue: [],
      green: [],
      yellow: []
    };
  
    const endSlots = {
      red: [],
      blue: [],
      green: [],
      yellow: []
    };
  
    boardLayout.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        // Überprüfen, ob das Feld ein Label hat
        const labelKey = `${rowIndex}-${colIndex}`;
        const labelData = labels[labelKey];
  
        if (labelData) {
          const position = [colIndex - 5, 0.01, rowIndex - 5]; // Position aus Layout berechnen
  
          // Zuordnung basierend auf dem Label
          switch (labelData.text) {
            // Startfelder
            case "S":
              if (labelData.rotation === 0) startPositions.red.push(position);
              else if (labelData.rotation === Math.PI) startPositions.blue.push(position);
              else if (labelData.rotation === -Math.PI / 2) startPositions.green.push(position);
              else if (labelData.rotation === Math.PI / 2) startPositions.yellow.push(position);
              break;
  
            // Endslots
            case "W":
            case "X":
            case "Y":
            case "Z":
              if (labelData.rotation === 0) endSlots.red.push(position);
              else if (labelData.rotation === Math.PI) endSlots.blue.push(position);
              else if (labelData.rotation === -Math.PI / 2) endSlots.green.push(position);
              else if (labelData.rotation === Math.PI / 2) endSlots.yellow.push(position);
              break;
  
            default:
              break;
          }
        }
      });
    });
  
    return { startPositions, endSlots };
  };
  