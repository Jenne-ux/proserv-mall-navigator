import { startPoint, escalatorPoint } from '../data/stores';

function getStoreEntrance(store) {
  return { x: store.entranceX, y: store.entranceY };
}

// EXACT walkway centers - NEVER change these values
const WALKWAYS = {
  // Horizontal walkways (y coordinates)
  HORIZONTAL: {
    UPPER: 112,
    MAIN: 242,
    MIDDLE: 362,
    LOWER: 542
  },
  // Vertical spines (x coordinates)
  VERTICAL: {
    WEST: 207,
    WEST_CENTER: 315,
    CENTER: 487,
    EAST_CENTER: 635,
    EAST: 737
  }
};

// Get closest walkway Y level
function getClosestWalkwayY(y) {
  const levels = Object.values(WALKWAYS.HORIZONTAL);
  let closest = levels[0];
  let minDist = Math.abs(y - closest);
  for (const level of levels) {
    const dist = Math.abs(y - level);
    if (dist < minDist) {
      minDist = dist;
      closest = level;
    }
  }
  return closest;
}

// Get closest vertical spine X based on store position
function getCorrectSpineX(storeX, storeY) {
  // For stores on main concourse (y between 240-310), use direct X
  if (storeY >= 240 && storeY <= 310) {
    return storeX;
  }
  
  // For other stores, use nearest spine
  const spines = Object.values(WALKWAYS.VERTICAL);
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

// Get correct walkway level for store
function getCorrectWalkwayY(storeY) {
  // Determine which walkway level the store should connect to
  if (storeY < 180) return WALKWAYS.HORIZONTAL.UPPER;
  if (storeY >= 180 && storeY < 310) return WALKWAYS.HORIZONTAL.MAIN;
  if (storeY >= 310 && storeY < 450) return WALKWAYS.HORIZONTAL.MIDDLE;
  return WALKWAYS.HORIZONTAL.LOWER;
}

// Clean path by removing redundant points
function cleanPath(path) {
  if (path.length < 2) return path;
  
  const cleaned = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const prev = cleaned[cleaned.length - 1];
    const curr = path[i];
    const next = path[i + 1];
    
    // Remove point if it's collinear (same x or same y as both neighbors)
    const isCollinear = (prev.x === curr.x && curr.x === next.x) || 
                        (prev.y === curr.y && curr.y === next.y);
    
    if (!isCollinear) {
      cleaned.push(curr);
    }
  }
  cleaned.push(path[path.length - 1]);
  return cleaned;
}

// Generate path that STAYS ON WALKWAYS ONLY
function generateCleanPath(start, end) {
  const path = [];
  path.push({ x: start.x, y: start.y });
  
  const directDistance = Math.hypot(start.x - end.x, start.y - end.y);
  
  // For very close stores (within 30 pixels), go directly
  if (directDistance < 30) {
    path.push({ x: end.x, y: end.y });
    return cleanPath(path);
  }
  
  // Determine correct walkway level for destination
  const targetWalkway = getCorrectWalkwayY(end.y);
  const currentWalkway = getCorrectWalkwayY(start.y);
  
  // Determine correct spine for destination
  const targetSpine = getCorrectSpineX(end.x, end.y);
  
  let currentX = start.x;
  let currentY = start.y;
  
  // Step 1: Move to current walkway level
  if (Math.abs(currentY - currentWalkway) > 3) {
    path.push({ x: currentX, y: currentWalkway });
    currentY = currentWalkway;
  }
  
  // Step 2: Move horizontally to target spine
  if (Math.abs(currentX - targetSpine) > 3) {
    path.push({ x: targetSpine, y: currentY });
    currentX = targetSpine;
  }
  
  // Step 3: Move vertically to target walkway level
  if (Math.abs(currentY - targetWalkway) > 3) {
    path.push({ x: currentX, y: targetWalkway });
    currentY = targetWalkway;
  }
  
  // Step 4: Move horizontally to store entrance X
  if (Math.abs(currentX - end.x) > 3) {
    path.push({ x: end.x, y: currentY });
    currentX = end.x;
  }
  
  // Step 5: Move vertically to store entrance Y
  if (Math.abs(currentY - end.y) > 3) {
    path.push({ x: currentX, y: end.y });
  }
  
  // If no movement happened, add destination
  if (path.length === 1) {
    path.push({ x: end.x, y: end.y });
  }
  
  return cleanPath(path);
}

// Generate escalator path
function generateEscalatorPath(start, end) {
  const path = [];
  path.push({ x: start.x, y: start.y });
  
  const escalatorSpine = WALKWAYS.VERTICAL.CENTER;
  const escalatorWalkway = WALKWAYS.HORIZONTAL.MAIN;
  const currentWalkway = getCorrectWalkwayY(start.y);
  
  let currentX = start.x;
  let currentY = start.y;
  
  // Move to current walkway level
  if (Math.abs(currentY - currentWalkway) > 3) {
    path.push({ x: currentX, y: currentWalkway });
    currentY = currentWalkway;
  }
  
  // Move to escalator spine
  if (Math.abs(currentX - escalatorSpine) > 3) {
    path.push({ x: escalatorSpine, y: currentY });
    currentX = escalatorSpine;
  }
  
  // Move to escalator walkway level
  if (Math.abs(currentY - escalatorWalkway) > 3) {
    path.push({ x: currentX, y: escalatorWalkway });
    currentY = escalatorWalkway;
  }
  
  // Move to escalator Y position
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
    const groundToEscalator = generateEscalatorPath(start, escalatorPoint);
    const transferPoint = { x: escalatorPoint.x, y: escalatorPoint.y, isTransfer: true };
    const escalatorToStore = generateCleanPath(escalatorPoint, end);
    
    return { 
      groundPath: groundToEscalator, 
      secondPath: [transferPoint, ...escalatorToStore], 
      multiFloor: true 
    };
  } else {
    return { groundPath: generateCleanPath(start, end), secondPath: [], multiFloor: false };
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

// Simple text directions
export function getSimpleDirections(store, needsEscalator) {
  const directions = [];
  const distance = Math.round(Math.hypot(startPoint.x - store.entranceX, startPoint.y - store.entranceY) * 0.08);
  
  directions.push("Start at Main Entrance");
  
  if (needsEscalator) {
    directions.push("Walk straight to Central Atrium");
    directions.push("Take escalator up to Second Floor");
    
    if (store.name === "Pizza Hut") {
      directions.push("Pizza Hut is straight ahead on your left");
    } else if (store.name === "Sushi Bar") {
      directions.push("Sushi Bar is straight ahead on your right");
    } else if (store.x < 300) {
      directions.push(`Walk to West Wing - ${store.name} is on your left`);
    } else if (store.x > 700) {
      directions.push(`Walk to East Wing - ${store.name} is on your right`);
    } else {
      directions.push(`${store.name} is straight ahead`);
    }
  } else {
    if (store.name === "Customer Service") {
      directions.push("Customer Service is directly ahead");
    } else if (store.name === "Kids Zone") {
      directions.push("Kids Zone is directly ahead on your right");
    } else if (store.name === "Book Nook") {
      directions.push("Walk right to East Wing");
      directions.push("Book Nook is on your left");
    } else if (store.name === "Shoe Store") {
      directions.push("Walk right to East Wing");
      directions.push("Shoe Store is on your right");
    } else if (store.name === "Jewelry") {
      directions.push("Walk left to West Wing");
      directions.push("Jewelry is on your left");
    } else if (store.name === "Watches") {
      directions.push("Walk left to West Wing");
      directions.push("Watches is on your right");
    } else if (store.name === "TechZone") {
      directions.push("Walk left to West Wing");
      directions.push("TechZone is on your left");
    } else if (store.x < 250) {
      directions.push(`Walk left to West Wing`);
      directions.push(`${store.name} is ${distance}m ahead on your left`);
    } else if (store.x > 700) {
      directions.push(`Walk right to East Wing`);
      directions.push(`${store.name} is ${distance}m ahead on your right`);
    } else {
      directions.push(`${store.name} is straight ahead, ${distance}m away`);
    }
  }
  
  directions.push(`Arrive at ${store.name}`);
  return directions;
}

export function generateDirections(store, needsEscalator) {
  const directions = [];
  const distance = Math.round(Math.hypot(startPoint.x - store.entranceX, startPoint.y - store.entranceY) * 0.08);
  
  directions.push({
    step: 1,
    instruction: "Start at Main Entrance",
    detail: "You are at the main entrance of ProServ Mall.",
    icon: "📍"
  });
  
  if (needsEscalator) {
    directions.push({
      step: 2,
      instruction: "Walk straight to Central Atrium",
      detail: "Continue straight ahead to the central atrium.",
      icon: "⬆️"
    });
    
    directions.push({
      step: 3,
      instruction: "Take escalator up to Second Floor",
      detail: "Use the escalator in the center of the atrium.",
      icon: "🪜"
    });
    
    directions.push({
      step: 4,
      instruction: `${store.name} is on your ${store.x < 487 ? 'left' : 'right'}`,
      detail: `${store.name} is approximately ${Math.round(distance * 0.6)}m ahead.`,
      icon: store.icon
    });
  } else {
    if (store.name === "Customer Service") {
      directions.push({
        step: 2,
        instruction: "Customer Service is directly ahead",
        detail: "Just 5 meters straight ahead.",
        icon: "🎫"
      });
    } else if (store.name === "Kids Zone") {
      directions.push({
        step: 2,
        instruction: "Kids Zone is ahead on your right",
        detail: "About 8 meters straight, then look right.",
        icon: "🎪"
      });
    } else if (store.x < 300) {
      directions.push({
        step: 2,
        instruction: `Walk left to West Wing`,
        detail: `Take the left corridor. ${store.name} is ${distance}m ahead on your ${store.x < 400 ? 'left' : 'right'}.`,
        icon: "⬅️"
      });
    } else if (store.x > 700) {
      directions.push({
        step: 2,
        instruction: `Walk right to East Wing`,
        detail: `Take the right corridor. ${store.name} is ${distance}m ahead on your ${store.x < 600 ? 'left' : 'right'}.`,
        icon: "➡️"
      });
    } else {
      directions.push({
        step: 2,
        instruction: `${store.name} is straight ahead`,
        detail: `Continue straight. ${store.name} is ${distance}m ahead.`,
        icon: "⬆️"
      });
    }
  }
  
  directions.push({
    step: directions.length + 1,
    instruction: `Arrive at ${store.name}`,
    detail: `You have reached ${store.name}.`,
    icon: "✅"
  });
  
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
        isTransfer: start.isTransfer || end.isTransfer
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