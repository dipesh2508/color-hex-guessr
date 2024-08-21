export function getRandomHexColor() {
    const hexCharacters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
      color += hexCharacters[Math.floor(Math.random() * 16)];
    }
    
    return color;
  }