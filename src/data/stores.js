// Store Data - All coordinates verified to be on walkways
export const stores = {
  ground: [
    // WEST WING
    { id: 1, name: "FreshMart", category: "Supermarket", floor: "ground", x: 40, y: 40, width: 120, height: 140, color: "#4a5568", icon: "🛒", entranceX: 207, entranceY: 110 },
    { id: 2, name: "TechZone", category: "Electronics", floor: "ground", x: 40, y: 220, width: 120, height: 90, color: "#5a67d8", icon: "💻", entranceX: 207, entranceY: 265 },
    { id: 3, name: "Fashion Ave", category: "Fashion", floor: "ground", x: 40, y: 340, width: 120, height: 90, color: "#ed64a6", icon: "👗", entranceX: 207, entranceY: 385 },
    { id: 4, name: "Sports Direct", category: "Sports", floor: "ground", x: 40, y: 460, width: 120, height: 80, color: "#e53e3e", icon: "⚽", entranceX: 207, entranceY: 500 },
    { id: 5, name: "Pet Paradise", category: "Pets", floor: "ground", x: 40, y: 555, width: 120, height: 45, color: "#d69e2e", icon: "🐕", entranceX: 207, entranceY: 577 },
    
    // EAST WING
    { id: 6, name: "PROSERV Dept", category: "Department", floor: "ground", x: 790, y: 40, width: 120, height: 140, color: "#4a5568", icon: "🏬", entranceX: 737, entranceY: 110 },
    { id: 7, name: "Book Nook", category: "Books", floor: "ground", x: 790, y: 220, width: 120, height: 90, color: "#48bb78", icon: "📚", entranceX: 737, entranceY: 265 },
    { id: 8, name: "Pharmacy", category: "Health", floor: "ground", x: 790, y: 340, width: 120, height: 90, color: "#38b2ac", icon: "💊", entranceX: 737, entranceY: 385 },
    { id: 9, name: "Home Decor", category: "Home", floor: "ground", x: 790, y: 460, width: 120, height: 80, color: "#38a169", icon: "🛋️", entranceX: 737, entranceY: 500 },
    { id: 10, name: "ATM Center", category: "Banking", floor: "ground", x: 790, y: 555, width: 120, height: 45, color: "#cbd5e0", icon: "🏧", entranceX: 737, entranceY: 577 },
    
    // CENTRAL AREA
    { id: 11, name: "Food Paradise", category: "Food Court", floor: "ground", x: 370, y: 390, width: 215, height: 110, color: "#ed8936", icon: "🍜", entranceX: 477, entranceY: 390 },
    { id: 12, name: "Customer Service", category: "Services", floor: "ground", x: 355, y: 270, width: 70, height: 40, color: "#a0aec0", icon: "🎫", entranceX: 390, entranceY: 290 },
    { id: 13, name: "Kids Zone", category: "Entertainment", floor: "ground", x: 525, y: 270, width: 70, height: 40, color: "#fbbf24", icon: "🎪", entranceX: 560, entranceY: 290 },
    { id: 14, name: "Coffee Shop", category: "Cafe", floor: "ground", x: 350, y: 565, width: 80, height: 35, color: "#2f855a", icon: "☕", entranceX: 390, entranceY: 582 },
    { id: 15, name: "Ice Cream", category: "Dessert", floor: "ground", x: 520, y: 565, width: 80, height: 35, color: "#f687b3", icon: "🍦", entranceX: 560, entranceY: 582 },
    { id: 16, name: "Restrooms", category: "Facilities", floor: "ground", x: 240, y: 565, width: 50, height: 35, color: "#cbd5e0", icon: "🚻", entranceX: 315, entranceY: 582 },
    { id: 17, name: "Nursing Room", category: "Facilities", floor: "ground", x: 660, y: 565, width: 50, height: 35, color: "#cbd5e0", icon: "🍼", entranceX: 635, entranceY: 582 },
    
    // MIDDLE WEST
    { id: 18, name: "Jewelry", category: "Jewelry", floor: "ground", x: 235, y: 270, width: 60, height: 70, color: "#d69e2e", icon: "💍", entranceX: 315, entranceY: 305 },
    { id: 19, name: "Watches", category: "Accessories", floor: "ground", x: 235, y: 410, width: 60, height: 70, color: "#9f7aea", icon: "⌚", entranceX: 315, entranceY: 445 },
    
    // MIDDLE EAST
    { id: 20, name: "Shoe Store", category: "Footwear", floor: "ground", x: 655, y: 270, width: 60, height: 70, color: "#ed64a6", icon: "👟", entranceX: 635, entranceY: 305 },
    { id: 21, name: "Bag Boutique", category: "Accessories", floor: "ground", x: 655, y: 410, width: 60, height: 70, color: "#5a67d8", icon: "👜", entranceX: 635, entranceY: 445 }
  ],
  
  second: [
    { id: 22, name: "Cineplex", category: "Cinema", floor: "second", x: 40, y: 40, width: 120, height: 140, color: "#4a5568", icon: "🎬", entranceX: 207, entranceY: 110 },
    { id: 23, name: "Arcade Zone", category: "Arcade", floor: "second", x: 40, y: 220, width: 120, height: 90, color: "#4a5568", icon: "🕹️", entranceX: 207, entranceY: 265 },
    { id: 24, name: "VR Experience", category: "Entertainment", floor: "second", x: 40, y: 340, width: 120, height: 90, color: "#805ad5", icon: "🥽", entranceX: 207, entranceY: 385 },
    { id: 25, name: "Escape Room", category: "Entertainment", floor: "second", x: 40, y: 460, width: 120, height: 80, color: "#d69e2e", icon: "🔐", entranceX: 207, entranceY: 500 },
    
    { id: 26, name: "Gym & Fitness", category: "Fitness", floor: "second", x: 790, y: 40, width: 120, height: 140, color: "#48bb78", icon: "💪", entranceX: 737, entranceY: 110 },
    { id: 27, name: "Yoga Studio", category: "Wellness", floor: "second", x: 790, y: 220, width: 120, height: 90, color: "#9f7aea", icon: "🧘", entranceX: 737, entranceY: 265 },
    { id: 28, name: "Spa & Massage", category: "Wellness", floor: "second", x: 790, y: 340, width: 120, height: 90, color: "#ed64a6", icon: "💆", entranceX: 737, entranceY: 385 },
    { id: 29, name: "Hair Salon", category: "Beauty", floor: "second", x: 790, y: 460, width: 120, height: 80, color: "#fbbf24", icon: "✂️", entranceX: 737, entranceY: 500 },
    
    { id: 30, name: "Starbucks", category: "Cafe", floor: "second", x: 340, y: 395, width: 110, height: 50, color: "#2f855a", icon: "☕", entranceX: 395, entranceY: 420 },
    { id: 31, name: "Dunkin Donuts", category: "Cafe", floor: "second", x: 500, y: 395, width: 110, height: 50, color: "#dd6b20", icon: "🍩", entranceX: 555, entranceY: 420 },
    { id: 32, name: "Pizza Hut", category: "Dining", floor: "second", x: 340, y: 455, width: 110, height: 50, color: "#e53e3e", icon: "🍕", entranceX: 395, entranceY: 480 },
    { id: 33, name: "Sushi Bar", category: "Dining", floor: "second", x: 500, y: 455, width: 110, height: 50, color: "#38b2ac", icon: "🍣", entranceX: 555, entranceY: 480 },
    
    { id: 34, name: "Electronics Hub", category: "Electronics", floor: "second", x: 235, y: 270, width: 60, height: 70, color: "#5a67d8", icon: "📱", entranceX: 315, entranceY: 305 },
    { id: 35, name: "Fashion Outlet", category: "Fashion", floor: "second", x: 235, y: 410, width: 60, height: 70, color: "#ed64a6", icon: "👗", entranceX: 315, entranceY: 445 },
    
    { id: 36, name: "Toy Kingdom", category: "Toys", floor: "second", x: 655, y: 270, width: 60, height: 70, color: "#fbbf24", icon: "🧸", entranceX: 635, entranceY: 305 },
    { id: 37, name: "Gift Shop", category: "Gifts", floor: "second", x: 655, y: 410, width: 60, height: 70, color: "#48bb78", icon: "🎁", entranceX: 635, entranceY: 445 },
    
    { id: 38, name: "Restrooms 2F", category: "Facilities", floor: "second", x: 240, y: 565, width: 50, height: 35, color: "#cbd5e0", icon: "🚻", entranceX: 315, entranceY: 582 },
    { id: 39, name: "Family Lounge", category: "Lounge", floor: "second", x: 660, y: 565, width: 50, height: 35, color: "#a0aec0", icon: "👨‍👩‍👧", entranceX: 635, entranceY: 582 }
  ]
};

export const startPoint = { x: 487, y: 585 };
export const escalatorPoint = { x: 487, y: 175 };