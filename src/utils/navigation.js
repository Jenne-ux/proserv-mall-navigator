import { startPoint, escalatorPoint } from '../data/stores';

function getStoreEntrance(store) {
  return { x: store.entranceX, y: store.entranceY };
}

// Walkway centers
const WALKWAYS = {
  HORIZONTAL: {
    UPPER: 112,
    MAIN: 242,
    MIDDLE: 362,
    LOWER: 542
  },
  VERTICAL: {
    WEST: 207,
    WEST_CENTER: 315,
    CENTER: 487,
    EAST_CENTER: 635,
    EAST: 737
  }
};

function getCorrectWalkwayY(storeY) {
  if (storeY < 180) return WALKWAYS.HORIZONTAL.UPPER;
  if (storeY >= 180 && storeY < 310) return WALKWAYS.HORIZONTAL.MAIN;
  if (storeY >= 310 && storeY < 450) return WALKWAYS.HORIZONTAL.MIDDLE;
  return WALKWAYS.HORIZONTAL.LOWER;
}

function getCorrectSpineX(storeX, storeY) {
  if (storeY >= 240 && storeY <= 310) return storeX;
  const spines = [
    WALKWAYS.VERTICAL.WEST,
    WALKWAYS.VERTICAL.WEST_CENTER,
    WALKWAYS.VERTICAL.CENTER,
    WALKWAYS.VERTICAL.EAST_CENTER,
    WALKWAYS.VERTICAL.EAST
  ];
  
  let closest = spines[0];
  let minDist = Math.abs(storeX - closest);
  for (const spine of spines) {
    const dist = Math.abs(storeX - spine);
    if (dist < minDist) {
      minDist = dist;
      closest = spine;
    }
  }
  return closest;
}

function cleanPath(path) {
  if (path.length < 2) return path;
  const cleaned = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const prev = cleaned[cleaned.length - 1];
    const curr = path[i];
    const next = path[i + 1];
    const isCollinear = (prev.x === curr.x && curr.x === next.x) || 
                        (prev.y === curr.y && curr.y === next.y);
    if (!isCollinear) cleaned.push(curr);
  }
  cleaned.push(path[path.length - 1]);
  return cleaned;
}

// PATH FOR SECOND FLOOR
function generateGroundToEscalatorPath(start, store) {
  const path = [{ x: start.x, y: start.y }];
  
  // Determine which wing the store is in
  let isWestWing = false;
  let isEastWing = false;
  let isCentral = false;
  
  // Special handling for specific stores
  if (store.name === "Starbucks" || store.name === "Pizza Hut" || store.name === "Customer Service") {
    isWestWing = true;
  } else if (store.name === "Dunkin Donuts" || store.name === "Sushi Bar" || 
             store.name === "Gift Shop" || store.name === "Toy Kingdom" || 
             store.name === "Family Lounge" || store.name === "Kids Zone") {
    isEastWing = true;
  } else {
    // Default logic based on x coordinate
    isWestWing = store.x < 300;
    isEastWing = store.x > 700;
    isCentral = store.x >= 300 && store.x <= 700;
  }
  
  let currentX = start.x;
  let currentY = start.y;
  
  // STEP 1: From entrance (487, 585) move to LOWER walkway (y=542)
  if (currentY !== WALKWAYS.HORIZONTAL.LOWER) {
    path.push({ x: currentX, y: WALKWAYS.HORIZONTAL.LOWER });
    currentY = WALKWAYS.HORIZONTAL.LOWER;
  }
  
  // STEP 2: Move to appropriate spine based on wing
  if (isWestWing) {
    if (currentX !== WALKWAYS.VERTICAL.WEST_CENTER) {
      path.push({ x: WALKWAYS.VERTICAL.WEST_CENTER, y: currentY });
      currentX = WALKWAYS.VERTICAL.WEST_CENTER;
    }
  } 
  else if (isEastWing) {
    if (currentX !== WALKWAYS.VERTICAL.EAST_CENTER) {
      path.push({ x: WALKWAYS.VERTICAL.EAST_CENTER, y: currentY });
      currentX = WALKWAYS.VERTICAL.EAST_CENTER;
    }
  }
  else if (isCentral) {
    if (currentX !== WALKWAYS.VERTICAL.CENTER) {
      path.push({ x: WALKWAYS.VERTICAL.CENTER, y: currentY });
      currentX = WALKWAYS.VERTICAL.CENTER;
    }
  }
  
  // STEP 3: Move up to MAIN walkway (y=242)
  if (currentY !== WALKWAYS.HORIZONTAL.MAIN) {
    path.push({ x: currentX, y: WALKWAYS.HORIZONTAL.MAIN });
    currentY = WALKWAYS.HORIZONTAL.MAIN;
  }
  
  // STEP 4: Move to CENTER spine for escalator (only if not already there)
  if (currentX !== WALKWAYS.VERTICAL.CENTER) {
    path.push({ x: WALKWAYS.VERTICAL.CENTER, y: currentY });
    currentX = WALKWAYS.VERTICAL.CENTER;
  }
  
  // STEP 5: Move up to escalator (y=175)
  if (currentY !== escalatorPoint.y) {
    path.push({ x: currentX, y: escalatorPoint.y });
  }
  
  return cleanPath(path);
}

// PATH FROM ESCALATOR TO SECOND FLOOR STORE
function generateEscalatorToStorePath(end, store) {
  const path = [{ x: escalatorPoint.x, y: escalatorPoint.y, isTransfer: true }];
  
  const targetWalkway = getCorrectWalkwayY(end.y);
  let targetSpine = getCorrectSpineX(end.x, end.y);
  
  // Special handling for specific stores
  if (store.name === "Starbucks" || store.name === "Pizza Hut") {
    targetSpine = WALKWAYS.VERTICAL.WEST;
  } else if (store.name === "Customer Service") {
    targetSpine = WALKWAYS.VERTICAL.WEST_CENTER;
  } else if (store.name === "Dunkin Donuts" || store.name === "Sushi Bar") {
    targetSpine = WALKWAYS.VERTICAL.EAST_CENTER;
  } else if (store.name === "Kids Zone") {
    targetSpine = WALKWAYS.VERTICAL.EAST_CENTER;
  } else if (store.name === "Gift Shop" || store.name === "Toy Kingdom") {
    targetSpine = WALKWAYS.VERTICAL.EAST;
  } else if (store.name === "Family Lounge") {
    targetSpine = WALKWAYS.VERTICAL.EAST_CENTER;
  }
  
  let currentX = escalatorPoint.x;
  let currentY = escalatorPoint.y;
  
  // Move to target walkway
  if (Math.abs(currentY - targetWalkway) > 3) {
    path.push({ x: currentX, y: targetWalkway });
    currentY = targetWalkway;
  }
  
  // Move to target spine
  if (Math.abs(currentX - targetSpine) > 3) {
    path.push({ x: targetSpine, y: currentY });
    currentX = targetSpine;
  }
  
  // Move to store entrance X
  if (Math.abs(currentX - end.x) > 3) {
    path.push({ x: end.x, y: currentY });
    currentX = end.x;
  }
  
  // Move to store entrance Y
  if (Math.abs(currentY - end.y) > 3) {
    path.push({ x: currentX, y: end.y });
  }
  
  return cleanPath(path);
}

// PROPER PATH FOR GROUND FLOOR STORES
function generateGroundPath(start, end, store) {
  const path = [{ x: start.x, y: start.y }];
  
  // Special handling for Food Paradise - it's right in front of entrance
  if (store.name === "Food Paradise") {
    // Direct straight path from entrance to Food Paradise
    if (Math.abs(start.x - end.x) > 3) {
      path.push({ x: end.x, y: start.y });
    }
    if (Math.abs(start.y - end.y) > 3) {
      path.push({ x: end.x, y: end.y });
    }
    return cleanPath(path);
  }
  
  const startWalkway = getCorrectWalkwayY(start.y);
  const targetWalkway = getCorrectWalkwayY(end.y);
  let targetSpine = getCorrectSpineX(end.x, end.y);
  
  // Special handling for Customer Service on ground floor
  if (store.name === "Customer Service") {
    targetSpine = WALKWAYS.VERTICAL.WEST_CENTER;
  } else if (store.name === "Kids Zone") {
    targetSpine = WALKWAYS.VERTICAL.EAST_CENTER;
  }
  
  let currentX = start.x;
  let currentY = start.y;
  
  if (Math.abs(currentY - startWalkway) > 3) {
    path.push({ x: currentX, y: startWalkway });
    currentY = startWalkway;
  }
  
  if (Math.abs(currentX - targetSpine) > 3) {
    path.push({ x: targetSpine, y: currentY });
    currentX = targetSpine;
  }
  
  if (Math.abs(currentY - targetWalkway) > 3) {
    path.push({ x: currentX, y: targetWalkway });
    currentY = targetWalkway;
  }
  
  if (Math.abs(currentX - end.x) > 3) {
    path.push({ x: end.x, y: currentY });
    currentX = end.x;
  }
  
  if (Math.abs(currentY - end.y) > 3) {
    path.push({ x: currentX, y: end.y });
  }
  
  return cleanPath(path);
}

export function generatePath(store, currentFloor) {
  const start = { ...startPoint };
  const end = getStoreEntrance(store);
  const isSecondFloor = store.floor === 'second';
  
  if (isSecondFloor) {
    return { 
      groundPath: generateGroundToEscalatorPath(start, store),
      secondPath: generateEscalatorToStorePath(end, store),
      multiFloor: true 
    };
  } else {
    return { 
      groundPath: generateGroundPath(start, end, store),
      secondPath: [],
      multiFloor: false 
    };
  }
}

export function calculateDistanceFromPath(points) {
  let totalPixels = 0;
  for (let i = 1; i < points.length; i++) {
    totalPixels += Math.hypot(points[i].x - points[i-1].x, points[i].y - points[i-1].y);
  }
  return Math.round(totalPixels * 0.08);
}

export function calculateETA(distanceMeters, hasEscalator = false) {
  let minutes = distanceMeters / 78;
  if (hasEscalator) minutes += 0.5;
  return Math.ceil(minutes * 2) / 2;
}

// DIRECTIONS WITH PROPER NAVIGATION
export function generateDirections(store, needsEscalator) {
  const directions = [];
  
  if (needsEscalator) {
    // Determine store location with specific handling
    let wing = "";
    let turnDirection = "";
    let section = "";
    
    // Special handling for each store
    switch(store.name) {
      case "Starbucks":
        wing = "West Wing";
        turnDirection = "LEFT";
        section = "upper section";
        break;
      case "Pizza Hut":
        wing = "West Wing";
        turnDirection = "LEFT";
        section = "lower section";
        break;
      case "Customer Service":
        wing = "West Wing";
        turnDirection = "LEFT";
        section = "main concourse";
        break;
      case "Dunkin Donuts":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "middle section";
        break;
      case "Sushi Bar":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "lower section";
        break;
      case "Kids Zone":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "east center area";
        break;
      case "Gift Shop":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "middle section";
        break;
      case "Toy Kingdom":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "upper section";
        break;
      case "Family Lounge":
        wing = "East Wing";
        turnDirection = "RIGHT";
        section = "lower section";
        break;
      default:
        // Default logic
        if (store.x < 300) {
          wing = "West Wing";
          turnDirection = "LEFT";
        } else if (store.x > 700) {
          wing = "East Wing";
          turnDirection = "RIGHT";
        } else {
          wing = "Central Area";
          turnDirection = "straight";
        }
        
        if (store.y < 180) section = "upper section";
        else if (store.y > 400) section = "lower section";
        else section = "middle section";
    }
    
    // ============ GROUND FLOOR DIRECTIONS ============
    directions.push({
      step: 1,
      floor: "ground",
      instruction: "📍 Start at Main Entrance",
      detail: "You are standing at the main entrance of ProServ Mall.",
      icon: "📍"
    });
    
    directions.push({
      step: 2,
      floor: "ground",
      instruction: "⬆️ Walk straight onto the main concourse",
      detail: "Enter through the main doors and walk straight ahead about 5 meters.",
      icon: "⬆️"
    });
    
    // Direction based on store wing
    if (wing === "West Wing") {
      directions.push({
        step: 3,
        floor: "ground",
        instruction: "⬅️ Turn LEFT and walk toward the West Wing",
        detail: "Take a left turn and walk along the lower corridor toward the west side.",
        icon: "⬅️",
        action: "left"
      });
      
      directions.push({
        step: 4,
        floor: "ground",
        instruction: "⬆️ Walk straight along the West Wing lower corridor",
        detail: "Continue walking straight. You'll pass the lower level stores.",
        icon: "⬆️"
      });
    } 
    else if (wing === "East Wing") {
      directions.push({
        step: 3,
        floor: "ground",
        instruction: "➡️ Turn RIGHT and walk toward the East Wing",
        detail: "Take a right turn and walk along the lower corridor toward the east side.",
        icon: "➡️",
        action: "right"
      });
      
      directions.push({
        step: 4,
        floor: "ground",
        instruction: "⬆️ Walk straight along the East Wing lower corridor",
        detail: "Continue walking straight. You'll pass the lower level stores.",
        icon: "⬆️"
      });
    }
    else {
      // For central stores
      directions.push({
        step: 3,
        floor: "ground",
        instruction: "⬆️ Continue straight ahead toward the center",
        detail: "Keep walking straight through the main concourse toward the center of the mall.",
        icon: "⬆️"
      });
    }
    
    // For all stores, continue to escalator
    directions.push({
      step: (wing === "Central Area") ? 4 : 5,
      floor: "ground",
      instruction: "⬆️ Walk straight to the escalator",
      detail: "Continue straight. The escalator is located in the center of the mall.",
      icon: "⬆️"
    });
    
    directions.push({
      step: (wing === "Central Area") ? 5 : 6,
      floor: "ground",
      instruction: "🪜 Take the escalator UP to the Second Floor",
      detail: "Board the escalator going up. Hold the handrail. The ride takes about 30 seconds.",
      icon: "🪜"
    });
    
    // ============ SECOND FLOOR DIRECTIONS ============
    let stepNum = (wing === "Central Area") ? 6 : 7;
    
    directions.push({
      step: stepNum,
      floor: "second",
      instruction: "📍 Step off the escalator onto the Second Floor",
      detail: "You have arrived on the second floor.",
      icon: "📍"
    });
    
    stepNum++;
    
    if (wing === "West Wing") {
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: "⬅️ Turn LEFT toward the West Wing",
        detail: "Take a left turn from the escalator. Walk toward the west side of the mall.",
        icon: "⬅️",
        action: "left"
      });
      
      stepNum++;
      
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: `⬆️ Walk straight to the ${section} of West Wing`,
        detail: `Continue walking straight to reach the ${section} where ${store.name} is located.`,
        icon: "⬆️"
      });
      
      stepNum++;
      
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: `🎯 ${store.name} is on your LEFT`,
        detail: `Look for ${store.icon} ${store.name} on your left side. You have arrived.`,
        icon: store.icon,
        action: "left"
      });
      
    } 
    else if (wing === "East Wing") {
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: "➡️ Turn RIGHT toward the East Wing",
        detail: "Take a right turn from the escalator. Walk toward the east side of the mall.",
        icon: "➡️",
        action: "right"
      });
      
      stepNum++;
      
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: `⬆️ Walk straight to the ${section} of East Wing`,
        detail: `Continue walking straight to reach the ${section} where ${store.name} is located.`,
        icon: "⬆️"
      });
      
      stepNum++;
      
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: `🎯 ${store.name} is on your RIGHT`,
        detail: `Look for ${store.icon} ${store.name} on your right side. You have arrived.`,
        icon: store.icon,
        action: "right"
      });
      
    }
    else {
      // For central stores
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: "⬆️ Continue straight ahead from the escalator",
        detail: `Stay straight. ${store.name} is located directly ahead in the ${section}.`,
        icon: "⬆️"
      });
      
      stepNum++;
      
      directions.push({
        step: stepNum,
        floor: "second",
        instruction: `🎯 ${store.name} is straight ahead`,
        detail: `Look for ${store.icon} ${store.name} straight ahead. You have arrived.`,
        icon: store.icon
      });
    }
    
    stepNum++;
    
    directions.push({
      step: stepNum,
      floor: "second",
      instruction: `✅ Arrive at ${store.name}`,
      detail: `You have successfully reached ${store.name}.`,
      icon: "✅"
    });
    
  } else {
    // Ground floor directions
    // Special handling for Food Paradise
    if (store.name === "Food Paradise") {
      directions.push({
        step: 1,
        floor: "ground",
        instruction: "📍 Start at Main Entrance",
        detail: "You are at the main entrance of ProServ Mall.",
        icon: "📍"
      });
      
      directions.push({
        step: 2,
        floor: "ground",
        instruction: "⬆️ Walk straight ahead",
        detail: "Food Paradise is directly in front of you, straight ahead from the entrance.",
        icon: "⬆️"
      });
      
      directions.push({
        step: 3,
        floor: "ground",
        instruction: "🎯 Food Paradise is straight ahead",
        detail: "Look for 🍔 Food Paradise directly in front of you. You have arrived.",
        icon: "🍔"
      });
      
      directions.push({
        step: 4,
        floor: "ground",
        instruction: "✅ Arrive at Food Paradise",
        detail: "You have successfully reached Food Paradise.",
        icon: "✅"
      });
      
      return directions;
    }
    
    const isWestWing = store.name === "Customer Service" || store.x < 250;
    const isEastWing = store.name === "Kids Zone" || store.x > 700;
    
    directions.push({
      step: 1,
      floor: "ground",
      instruction: "📍 Start at Main Entrance",
      detail: "You are at the main entrance of ProServ Mall.",
      icon: "📍"
    });
    
    if (isWestWing) {
      directions.push({
        step: 2,
        floor: "ground",
        instruction: "⬅️ Turn LEFT toward the West Wing",
        detail: "Take a left turn and walk along the west corridor.",
        icon: "⬅️",
        action: "left"
      });
      
      directions.push({
        step: 3,
        floor: "ground",
        instruction: `⬆️ Walk straight to ${store.name}`,
        detail: `Continue walking straight. ${store.name} will be on your left.`,
        icon: "⬆️"
      });
      
      directions.push({
        step: 4,
        floor: "ground",
        instruction: `🎯 ${store.name} is on your LEFT`,
        detail: `Look for ${store.icon} ${store.name} on your left side.`,
        icon: store.icon,
        action: "left"
      });
      
    } 
    else if (isEastWing) {
      directions.push({
        step: 2,
        floor: "ground",
        instruction: "➡️ Turn RIGHT toward the East Wing",
        detail: "Take a right turn and walk along the east corridor.",
        icon: "➡️",
        action: "right"
      });
      
      directions.push({
        step: 3,
        floor: "ground",
        instruction: `⬆️ Walk straight to ${store.name}`,
        detail: `Continue walking straight. ${store.name} will be on your right.`,
        icon: "⬆️"
      });
      
      directions.push({
        step: 4,
        floor: "ground",
        instruction: `🎯 ${store.name} is on your RIGHT`,
        detail: `Look for ${store.icon} ${store.name} on your right side.`,
        icon: store.icon,
        action: "right"
      });
      
    }
    else {
      directions.push({
        step: 2,
        floor: "ground",
        instruction: "⬆️ Walk straight ahead",
        detail: `${store.name} is straight ahead.`,
        icon: "⬆️"
      });
      
      directions.push({
        step: 3,
        floor: "ground",
        instruction: `🎯 ${store.name} is ahead`,
        detail: `Look for ${store.icon} ${store.name} straight ahead.`,
        icon: store.icon
      });
    }
    
    directions.push({
      step: directions.length + 1,
      floor: "ground",
      instruction: `✅ Arrive at ${store.name}`,
      detail: `You have successfully reached ${store.name}.`,
      icon: "✅"
    });
  }
  
  return directions;
}

// Simple directions for quick display
export function getSimpleDirections(store, needsEscalator) {
  const directions = [];
  
  directions.push("📍 Start at Main Entrance");
  
  if (needsEscalator) {
    // Special handling for East Wing stores
    if (store.name === "Dunkin Donuts" || store.name === "Sushi Bar" || 
        store.name === "Gift Shop" || store.name === "Toy Kingdom" || 
        store.name === "Family Lounge" || store.name === "Kids Zone") {
      directions.push("➡️ Turn RIGHT toward East Wing");
      directions.push("⬆️ Walk straight to escalator");
      directions.push("🪜 Take escalator UP");
      directions.push("➡️ Turn RIGHT to East Wing");
      directions.push(`🎯 ${store.name} is on your RIGHT`);
    } 
    else if (store.name === "Starbucks" || store.name === "Pizza Hut" || store.name === "Customer Service") {
      directions.push("⬅️ Turn LEFT toward West Wing");
      directions.push("⬆️ Walk straight to escalator");
      directions.push("🪜 Take escalator UP");
      directions.push("⬅️ Turn LEFT to West Wing");
      directions.push(`🎯 ${store.name} is on your LEFT`);
    }
    else {
      directions.push("⬆️ Walk straight to escalator");
      directions.push("🪜 Take escalator UP");
      directions.push(`🎯 ${store.name} is straight ahead`);
    }
  } else {
    // Special handling for Food Paradise
    if (store.name === "Food Paradise") {
      directions.push("⬆️ Walk straight ahead");
      directions.push("🎯 Food Paradise is straight ahead");
    } else if (store.name === "Customer Service" || store.x < 250) {
      directions.push(`⬅️ Turn LEFT to West Wing`);
      directions.push(`🎯 ${store.name} is on your LEFT`);
    } else if (store.name === "Kids Zone" || store.x > 700) {
      directions.push(`➡️ Turn RIGHT to East Wing`);
      directions.push(`🎯 ${store.name} is on your RIGHT`);
    } else {
      directions.push(`⬆️ Walk straight ahead`);
      directions.push(`🎯 ${store.name} is ahead`);
    }
  }
  
  directions.push(`✅ Arrive at ${store.name}`);
  return directions;
}

export function createSmoothPath(points, stepsPerSegment = 20) {
  if (!points || points.length < 2) return points || [];
  const smoothPoints = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    const steps = Math.min(Math.max(Math.ceil(distance / 2), 10), 25);
    
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      smoothPoints.push({
        x: Math.round(start.x + dx * t),
        y: Math.round(start.y + dy * t),
        isTransfer: start.isTransfer || end.isTransfer || false
      });
    }
  }
  
  return smoothPoints;
}

export function generateQRData(store) {
  return {
    url: `https://proserv-mall.com/navigate?store=${encodeURIComponent(store.name)}&floor=${store.floor}`,
    store: store.name,
    floor: store.floor,
    category: store.category
  };
}