import { Business } from "@/types/business";

export const mockBusinesses: Business[] = [
  {
    id: "biz-001",
    name: "The Craft Kitchen",
    type: "restaurant",
    websiteUrl: "https://thecraftkitchen.com",
    description:
      "A farm-to-table restaurant celebrating local ingredients with innovative seasonal menus. We partner with Austin-area farmers to bring the freshest, most sustainable dining experience.",
    tagline: "From Local Farms to Your Table",
    location: { lat: 30.2672, lng: -97.7431 },
    address: "412 Congress Ave, Austin, TX 78701",
    priceRange: "$$",
    rating: 4.6,
    establishedYear: 2019,
    monthlyRevenue: 85000,
    avgCustomersPerDay: 120,
    icp: {
      ageRange: [25, 45],
      incomeRange: [50000, 120000],
      interests: [
        "farm to table",
        "craft cocktails",
        "date night",
        "local food",
        "seasonal dining",
      ],
      visitFrequency: "weekly",
      priceSensitivity: "medium",
    },
    products: [
      {
        id: "p-001",
        name: "Heirloom Tomato Bruschetta",
        category: "Appetizers",
        price: 12,
        description:
          "Local heirloom tomatoes with basil, burrata, and aged balsamic on sourdough",
        isPopular: true,
      },
      {
        id: "p-002",
        name: "Smoked Beet Carpaccio",
        category: "Appetizers",
        price: 14,
        description:
          "House-smoked beets with goat cheese mousse, candied pecans, and arugula",
      },
      {
        id: "p-003",
        name: "Farm Egg Flatbread",
        category: "Appetizers",
        price: 11,
        description:
          "Wood-fired flatbread with farm eggs, truffle cream, and wild mushrooms",
      },
      {
        id: "p-004",
        name: "Pan-Seared Hill Country Trout",
        category: "Mains",
        price: 26,
        description:
          "Locally caught trout with brown butter, capers, roasted fingerlings",
        isPopular: true,
      },
      {
        id: "p-005",
        name: "Grass-Fed Ribeye",
        category: "Mains",
        price: 34,
        description:
          "12oz grass-fed ribeye with chimichurri, grilled asparagus, and duck fat potatoes",
      },
      {
        id: "p-006",
        name: "Mushroom & Truffle Risotto",
        category: "Mains",
        price: 22,
        description:
          "Arborio rice with wild mushrooms, black truffle, and aged parmesan",
      },
      {
        id: "p-007",
        name: "Pecan-Crusted Chicken",
        category: "Mains",
        price: 24,
        description:
          "Free-range chicken breast with pecan crust, honey mustard glaze, and seasonal vegetables",
      },
      {
        id: "p-008",
        name: "Seasonal Harvest Bowl",
        category: "Mains",
        price: 18,
        description:
          "Rotating selection of roasted seasonal vegetables with ancient grains and tahini dressing",
      },
      {
        id: "p-009",
        name: "Lavender Creme Brulee",
        category: "Desserts",
        price: 10,
        description: "Classic creme brulee infused with Texas lavender",
      },
      {
        id: "p-010",
        name: "Chocolate Pecan Tart",
        category: "Desserts",
        price: 12,
        description:
          "Dark chocolate ganache tart with candied Texas pecans and whiskey caramel",
      },
      {
        id: "p-011",
        name: "Craft Old Fashioned",
        category: "Drinks",
        price: 14,
        description:
          "Small-batch bourbon with house-made bitters, orange peel, and luxardo cherry",
        isPopular: true,
      },
      {
        id: "p-012",
        name: "Seasonal Spritz",
        category: "Drinks",
        price: 12,
        description:
          "Rotating seasonal cocktail with local fruit infusions and prosecco",
      },
    ],
  },
  {
    id: "biz-002",
    name: "Byte & Brew",
    type: "cafe",
    websiteUrl: "https://byteandbrew.co",
    description:
      "A tech-themed specialty coffee shop and coworking space where innovation meets caffeine. Featuring high-speed WiFi, standing desks, and drinks named after programming languages.",
    tagline: "Code. Caffeinate. Create.",
    location: { lat: 30.2711, lng: -97.7404 },
    address: "200 E 6th St, Austin, TX 78701",
    priceRange: "$",
    rating: 4.4,
    establishedYear: 2021,
    monthlyRevenue: 42000,
    avgCustomersPerDay: 180,
    icp: {
      ageRange: [20, 35],
      incomeRange: [40000, 150000],
      interests: [
        "technology",
        "remote work",
        "specialty coffee",
        "startups",
        "coworking",
      ],
      visitFrequency: "daily",
      priceSensitivity: "low",
    },
    products: [
      {
        id: "p-101",
        name: "The Python Pour-Over",
        category: "Coffee",
        price: 6,
        description:
          "Single-origin Ethiopian pour-over with notes of blueberry and dark chocolate",
        isPopular: true,
      },
      {
        id: "p-102",
        name: "Java Chip Frappe",
        category: "Coffee",
        price: 7,
        description:
          "Blended espresso with chocolate chips, milk, and whipped cream",
      },
      {
        id: "p-103",
        name: "The Rust Latte",
        category: "Coffee",
        price: 6,
        description: "Double shot oat milk latte with cinnamon and orange zest",
      },
      {
        id: "p-104",
        name: "Node.js Nitro Cold Brew",
        category: "Coffee",
        price: 5,
        description: "Nitrogen-infused cold brew with a creamy cascade",
        isPopular: true,
      },
      {
        id: "p-105",
        name: "Binary Breakfast Sandwich",
        category: "Food",
        price: 9,
        description:
          "Egg, bacon, cheddar, and avocado on a toasted everything bagel",
      },
      {
        id: "p-106",
        name: "The Stack Overflow",
        category: "Food",
        price: 12,
        description:
          "Triple-stacked pancakes with maple syrup, berries, and whipped cream",
      },
      {
        id: "p-107",
        name: "Debug Danish",
        category: "Pastries",
        price: 4,
        description: "Fresh-baked cheese danish with seasonal fruit compote",
      },
      {
        id: "p-108",
        name: "Algorithm Almond Croissant",
        category: "Pastries",
        price: 5,
        description:
          "Butter croissant filled with almond cream and toasted almonds",
      },
      {
        id: "p-109",
        name: "Kernel Kombucha",
        category: "Drinks",
        price: 5,
        description: "House-brewed kombucha in rotating flavors",
      },
      {
        id: "p-110",
        name: "Matcha.init()",
        category: "Drinks",
        price: 6,
        description: "Ceremonial grade matcha with oat milk and honey",
        isNew: true,
      },
    ],
  },
  {
    id: "biz-003",
    name: "Green Groove",
    type: "cafe",
    websiteUrl: "https://greengroove.health",
    description:
      "Your neighborhood health bar serving superfood smoothies, acai bowls, and plant-based snacks. Every ingredient is organic, locally sourced when possible, and designed to fuel your active lifestyle.",
    tagline: "Fuel Your Best Self",
    location: { lat: 30.2639, lng: -97.7502 },
    address: "1401 S 1st St, Austin, TX 78704",
    priceRange: "$$",
    rating: 4.7,
    establishedYear: 2020,
    monthlyRevenue: 35000,
    avgCustomersPerDay: 95,
    icp: {
      ageRange: [22, 40],
      incomeRange: [45000, 100000],
      interests: [
        "fitness",
        "health",
        "organic food",
        "yoga",
        "sustainability",
      ],
      visitFrequency: "weekly",
      priceSensitivity: "medium",
    },
    products: [
      {
        id: "p-201",
        name: "Green Machine Smoothie",
        category: "Smoothies",
        price: 10,
        description:
          "Spinach, kale, banana, mango, chia seeds, and coconut water",
        isPopular: true,
      },
      {
        id: "p-202",
        name: "Berry Blast Smoothie",
        category: "Smoothies",
        price: 10,
        description:
          "Mixed berries, acai, Greek yogurt, flax seeds, and almond milk",
      },
      {
        id: "p-203",
        name: "Tropical Thunder",
        category: "Smoothies",
        price: 11,
        description:
          "Pineapple, passion fruit, turmeric, ginger, and coconut milk",
        isNew: true,
      },
      {
        id: "p-204",
        name: "Protein Power Bowl",
        category: "Bowls",
        price: 14,
        description:
          "Acai base with granola, banana, peanut butter, hemp seeds, and honey",
        isPopular: true,
      },
      {
        id: "p-205",
        name: "Dragon Fruit Dream Bowl",
        category: "Bowls",
        price: 15,
        description:
          "Pitaya base with coconut flakes, kiwi, strawberry, and bee pollen",
      },
      {
        id: "p-206",
        name: "Avocado Toast Deluxe",
        category: "Snacks",
        price: 12,
        description:
          "Sourdough with smashed avocado, everything seasoning, microgreens, and a poached egg",
      },
      {
        id: "p-207",
        name: "Energy Bites (6pc)",
        category: "Snacks",
        price: 7,
        description:
          "Date, oat, and dark chocolate energy balls with adaptogenic mushrooms",
      },
      {
        id: "p-208",
        name: "Cold-Pressed Juice Flight",
        category: "Drinks",
        price: 16,
        description:
          "Four 4oz samples of our daily cold-pressed juice selection",
      },
    ],
  },
];
