/**
 * Demonstration dataset for QR4Menu.
 *
 * Venue names, neighbourhoods and cuisines are real Surat establishments, used
 * illustratively so the product demos against recognisable content instead of
 * "Restaurant 1".
 *
 * Ratings, review counts, opening hours, price bands and menu prices are
 * GENERATED SAMPLE FIGURES. They are not sourced from these businesses and must
 * not be presented as their real data. Phone numbers are deliberately omitted
 * for the same reason. Every record carries `isSampleData: true`, and the
 * discovery pages surface that to the reader.
 */

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=72&auto=format&fit=crop`;

export type SeedDish = {
  name: string;
  desc: string;
  price: number;
  veg: boolean;
  spicy?: boolean;
  special?: boolean;
};

export type SeedVenue = {
  name: string;
  slug: string;
  area: string;
  cuisine: string;
  tagline: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3 | 4;
  hours: string;
  cover: string;
  featured?: boolean;
  categories: { name: string; items: SeedDish[] }[];
};

export const SURAT_VENUES: SeedVenue[] = [
  {
    name: 'Sasumaa',
    slug: 'sasumaa-vesu',
    area: 'Vesu',
    cuisine: 'Gujarati Thali',
    tagline: 'Unlimited Gujarati thali, served the old way',
    description:
      'A full Kathiyawadi and Gujarati thali house in Vesu, where the servers keep circling until you turn your plate over. Rotla, three shaak, dal, kadhi and a sweet come as standard, and the farsan changes with the day.',
    tags: ['Thali', 'Pure Veg', 'Family dining', 'Unlimited'],
    rating: 4.4, reviewCount: 1860, priceRange: 2,
    hours: 'Daily 11:00 – 15:30, 19:00 – 23:00',
    cover: IMG('photo-1585937421612-70a008356fbe'),
    featured: true,
    categories: [
      { name: 'The Thali', items: [
        { name: 'Gujarati Thali', desc: 'Unlimited — four shaak, dal, kadhi, rotla, rice, farsan, sweet', price: 420, veg: true, special: true },
        { name: 'Kathiyawadi Thali', desc: 'Sev tameta, lasan chutney, bajra rotla, chaas', price: 460, veg: true, special: true },
        { name: 'Mini Thali', desc: 'Two shaak, dal, rice, four rotli', price: 280, veg: true },
      ]},
      { name: 'Farsan', items: [
        { name: 'Khaman Dhokla', desc: 'Steamed, tempered with mustard and curry leaf', price: 120, veg: true },
        { name: 'Patra', desc: 'Colocasia leaf rolls, sesame, jaggery', price: 140, veg: true },
        { name: 'Fafda with Papaya Sambharo', desc: 'Fried gram-flour strips, warm chutney', price: 110, veg: true },
      ]},
      { name: 'Sweets', items: [
        { name: 'Shrikhand', desc: 'Hung curd, saffron, cardamom', price: 130, veg: true },
        { name: 'Ghari', desc: 'The Surti classic, mawa and dry fruit', price: 90, veg: true, special: true },
        { name: 'Jalebi with Rabdi', desc: 'Served warm', price: 160, veg: true },
      ]},
    ],
  },
  {
    name: 'Kansaar',
    slug: 'kansaar-ghod-dod-road',
    area: 'Ghod Dod Road',
    cuisine: 'Gujarati Thali',
    tagline: 'Gujarati and Rajasthani thali since the nineties',
    description:
      'One of the long-standing thali addresses on Ghod Dod Road. The kitchen leans Rajasthani on weekends, and the winter menu brings undhiyu and ponk out for the season.',
    tags: ['Thali', 'Pure Veg', 'Rajasthani', 'Seasonal'],
    rating: 4.3, reviewCount: 2410, priceRange: 2,
    hours: 'Daily 11:30 – 15:00, 19:00 – 22:45',
    cover: IMG('photo-1631515243349-e0cb75fb8d3a'),
    featured: true,
    categories: [
      { name: 'Thali', items: [
        { name: 'Rajwadi Thali', desc: 'Seven items, seasonal shaak, two sweets', price: 480, veg: true, special: true },
        { name: 'Gujarati Thali', desc: 'Daily rotation, unlimited', price: 400, veg: true },
      ]},
      { name: 'Winter Special', items: [
        { name: 'Undhiyu', desc: 'Surti undhiyu, muthiya, purple yam — December to February', price: 260, veg: true, special: true },
        { name: 'Ponk Vada', desc: 'Tender jowar, lasan chutney', price: 180, veg: true },
      ]},
      { name: 'Breads', items: [
        { name: 'Bajra Rotla with Gud', desc: 'Pearl millet, jaggery, white butter', price: 90, veg: true },
        { name: 'Thepla', desc: 'Methi thepla, chundo on the side', price: 80, veg: true },
      ]},
    ],
  },
  {
    name: 'Jaani Locho',
    slug: 'jaani-locho-surat',
    area: 'Ghod Dod Road',
    cuisine: 'Surti Street Food',
    tagline: 'Locho, the way Surat argues about it',
    description:
      'Locho is a Surat invention — a soft, deliberately under-set gram flour batter, scooped rather than cut, buried in butter, sev and raw onion. This is one of the counters the city sends visitors to.',
    tags: ['Street food', 'Surti', 'Breakfast', 'Pure Veg'],
    rating: 4.6, reviewCount: 3240, priceRange: 1,
    hours: 'Daily 07:30 – 12:00, 16:00 – 21:30',
    cover: IMG('photo-1596797038530-2c107229654b'),
    featured: true,
    categories: [
      { name: 'Locho', items: [
        { name: 'Butter Locho', desc: 'Loaded with butter, sev, onion, green chutney', price: 90, veg: true, special: true },
        { name: 'Cheese Locho', desc: 'Grated cheese folded through while hot', price: 120, veg: true },
        { name: 'Plain Locho', desc: 'As it comes off the tray', price: 70, veg: true },
      ]},
      { name: 'With It', items: [
        { name: 'Surti Khaman', desc: 'Soft, soaked, sev on top', price: 80, veg: true },
        { name: 'Masala Chaas', desc: 'Cumin, coriander, black salt', price: 40, veg: true },
        { name: 'Kadak Chai', desc: 'Boiled long, served in a glass', price: 25, veg: true },
      ]},
    ],
  },
  {
    name: 'Gopal Locho',
    slug: 'gopal-locho-surat',
    area: 'Nanpura',
    cuisine: 'Surti Street Food',
    tagline: 'Khaman, locho and sev khamani from the morning counter',
    description:
      'A farsan counter that opens early and works through the morning rush. Sev khamani here is crumbled fine and heaped with pomegranate, which is the version Surat defends.',
    tags: ['Street food', 'Farsan', 'Breakfast', 'Budget'],
    rating: 4.5, reviewCount: 2180, priceRange: 1,
    hours: 'Daily 07:00 – 13:00, 16:30 – 21:00',
    cover: IMG('photo-1606491956689-2ea866880c84'),
    categories: [
      { name: 'Farsan Counter', items: [
        { name: 'Sev Khamani', desc: 'Crumbled khaman, pomegranate, sev, coconut', price: 100, veg: true, special: true },
        { name: 'Locho', desc: 'Butter, sev, onion', price: 85, veg: true },
        { name: 'Khaman', desc: 'Steamed, sweet-sour tempering', price: 70, veg: true },
        { name: 'Idada', desc: 'White, savoury, black pepper', price: 80, veg: true },
      ]},
    ],
  },
  {
    name: 'Barbeque Nation',
    slug: 'barbeque-nation-piplod',
    area: 'Piplod',
    cuisine: 'BBQ & Grill',
    tagline: 'Live grills at the table, buffet through the evening',
    description:
      'Table-grill buffet with a rotating kebab list and a dessert counter. Weekend evenings book out early, and the veg grill runs the same length as the non-veg one.',
    tags: ['Buffet', 'Grill', 'Group dining', 'Bar'],
    rating: 4.2, reviewCount: 5620, priceRange: 3,
    hours: 'Daily 12:00 – 15:30, 18:30 – 23:00',
    cover: IMG('photo-1504674900247-0877df9cc836'),
    featured: true,
    categories: [
      { name: 'On the Grill', items: [
        { name: 'Mutton Seekh Kebab', desc: 'Minced mutton, green chilli, grilled at the table', price: 480, veg: false, spicy: true, special: true },
        { name: 'Cajun Spiced Potato', desc: 'The one everyone asks to be refilled', price: 260, veg: true, special: true },
        { name: 'Paneer Tikka', desc: 'Hung curd marinade, capsicum, onion', price: 340, veg: true },
        { name: 'Prawn Balchao', desc: 'Goan-style, hot', price: 520, veg: false, spicy: true },
      ]},
      { name: 'Buffet', items: [
        { name: 'Weekday Lunch', desc: 'Starters, main course, dessert counter', price: 799, veg: true },
        { name: 'Weekend Dinner', desc: 'Extended grill and dessert selection', price: 1099, veg: true },
      ]},
    ],
  },
  {
    name: 'The Grand Bhagwati',
    slug: 'the-grand-bhagwati-surat',
    area: 'Dumas Road',
    cuisine: 'Multi-cuisine',
    tagline: 'Hotel dining, banquets and an all-day coffee shop',
    description:
      'The TGB property on Dumas Road runs a multi-cuisine restaurant alongside its banquet halls. The buffet is the draw at lunch; the à la carte leans North Indian in the evening.',
    tags: ['Hotel', 'Buffet', 'Multi-cuisine', 'Banquet'],
    rating: 4.3, reviewCount: 4120, priceRange: 3,
    hours: 'Daily 07:00 – 23:30',
    cover: IMG('photo-1517248135467-4c7edcad34c4'),
    categories: [
      { name: 'North Indian', items: [
        { name: 'Paneer Lababdar', desc: 'Tomato and cashew gravy, kasuri methi', price: 420, veg: true },
        { name: 'Dal Bukhara', desc: 'Black lentils, overnight on low heat', price: 390, veg: true, special: true },
        { name: 'Subz Dum Biryani', desc: 'Sealed handi, saffron, fried onion', price: 460, veg: true },
      ]},
      { name: 'Continental', items: [
        { name: 'Penne Arrabbiata', desc: 'Chilli, garlic, tomato', price: 380, veg: true, spicy: true },
        { name: 'Grilled Cottage Cheese Steak', desc: 'Herb butter, sautéed vegetables', price: 440, veg: true },
      ]},
    ],
  },
  {
    name: 'Mocha',
    slug: 'mocha-ghod-dod-road',
    area: 'Ghod Dod Road',
    cuisine: 'Cafe & Bakery',
    tagline: 'Long-sitting coffee house with a full kitchen',
    description:
      'Low seating, shisha on the terrace and a kitchen that runs well past midnight on weekends. The coffee list is longer than the food menu, which is the point.',
    tags: ['Cafe', 'Late night', 'Work-friendly', 'Desserts'],
    rating: 4.1, reviewCount: 2740, priceRange: 2,
    hours: 'Daily 10:00 – 01:00',
    cover: IMG('photo-1559339352-11d035aa65de'),
    featured: true,
    categories: [
      { name: 'Coffee', items: [
        { name: 'Turkish Coffee', desc: 'Ground fine, served with the grounds', price: 260, veg: true, special: true },
        { name: 'Irish Cold Brew', desc: 'Sixteen-hour brew, cream float', price: 290, veg: true },
        { name: 'Flat White', desc: 'Double ristretto, microfoam', price: 220, veg: true },
      ]},
      { name: 'Plates', items: [
        { name: 'Nachos Grande', desc: 'Salsa, jalapeño, cheese sauce', price: 340, veg: true, spicy: true },
        { name: 'Peri Peri Fries', desc: 'Skin on, house peri masala', price: 240, veg: true, spicy: true },
        { name: 'Mississippi Mud Pie', desc: 'Warm, with vanilla ice cream', price: 310, veg: true, special: true },
      ]},
    ],
  },
  {
    name: 'Starbucks VR Surat',
    slug: 'starbucks-vr-surat',
    area: 'Dumas Road',
    cuisine: 'Cafe & Bakery',
    tagline: 'Mall-floor coffee, consistent and quick',
    description:
      'The VR Surat outlet on Dumas Road. Predictable in the way people want a coffee chain to be predictable, with the India-only beverages that do not appear elsewhere.',
    tags: ['Cafe', 'Coffee chain', 'Quick', 'Mall'],
    rating: 4.2, reviewCount: 1980, priceRange: 3,
    hours: 'Daily 11:00 – 23:00',
    cover: IMG('photo-1481931098730-318b6f776db0'),
    categories: [
      { name: 'Espresso', items: [
        { name: 'Cappuccino', desc: 'Signature espresso roast', price: 275, veg: true },
        { name: 'Caffè Americano', desc: 'Espresso, hot water', price: 245, veg: true },
        { name: 'Cold Brew', desc: 'Twenty-hour steep, served black', price: 320, veg: true, special: true },
      ]},
      { name: 'Bakery', items: [
        { name: 'Almond Croissant', desc: 'Frangipane, flaked almonds', price: 290, veg: true },
        { name: 'Chocolate Chip Cookie', desc: 'Baked in-store', price: 180, veg: true },
      ]},
    ],
  },
  {
    name: 'Huber & Holly',
    slug: 'huber-and-holly-adajan',
    area: 'Adajan',
    cuisine: 'Desserts',
    tagline: 'Chocolate-first dessert counter',
    description:
      'Thick shakes, brownies and a chocolate wall that does most of the selling. Portions are built to share, whatever the menu says.',
    tags: ['Desserts', 'Chocolate', 'Shakes', 'Takeaway'],
    rating: 4.4, reviewCount: 1520, priceRange: 2,
    hours: 'Daily 11:00 – 23:30',
    cover: IMG('photo-1563805042-7684c019e1cb'),
    categories: [
      { name: 'Shakes', items: [
        { name: 'Nutella Thickshake', desc: 'Served with a spoon, not a straw', price: 320, veg: true, special: true },
        { name: 'Ferrero Rocher Shake', desc: 'Hazelnut, dark chocolate', price: 340, veg: true },
      ]},
      { name: 'Plated', items: [
        { name: 'Molten Chocolate Cake', desc: 'Warm centre, vanilla scoop', price: 280, veg: true, special: true },
        { name: 'Brownie Sundae', desc: 'Double chocolate brownie, three scoops', price: 360, veg: true },
      ]},
    ],
  },
  {
    name: 'The Belgian Waffle Co.',
    slug: 'belgian-waffle-co-vesu',
    area: 'Vesu',
    cuisine: 'Desserts',
    tagline: 'Waffles made to order, twenty ways',
    description:
      'A small counter with a long board. The half-and-half waffle exists because nobody could choose, and it now outsells both halves individually.',
    tags: ['Desserts', 'Waffles', 'Takeaway', 'Quick'],
    rating: 4.3, reviewCount: 1140, priceRange: 1,
    hours: 'Daily 11:00 – 23:00',
    cover: IMG('photo-1567620905732-2d1ec7ab7445'),
    categories: [
      { name: 'Waffles', items: [
        { name: 'Death by Chocolate', desc: 'Dark, milk and white chocolate', price: 220, veg: true, special: true },
        { name: 'Half & Half', desc: 'Two chocolates, one waffle', price: 240, veg: true },
        { name: 'Red Velvet Waffle', desc: 'Cream cheese drizzle', price: 250, veg: true },
      ]},
    ],
  },
  {
    name: 'La Pino’z Pizza',
    slug: 'la-pinoz-pizza-adajan',
    area: 'Adajan',
    cuisine: 'Pizza & Italian',
    tagline: 'Late-night pizza, oversized by design',
    description:
      'The reason the ten-inch is called a personal pizza here is optimism. Delivery runs well past midnight, which is most of the business.',
    tags: ['Pizza', 'Late night', 'Delivery', 'Group dining'],
    rating: 4.0, reviewCount: 3360, priceRange: 2,
    hours: 'Daily 11:00 – 03:00',
    cover: IMG('photo-1513104890138-7c749659a591'),
    categories: [
      { name: 'Pizza', items: [
        { name: 'Paneer Makhani Pizza', desc: 'Makhani base, paneer, onion, capsicum', price: 340, veg: true, special: true },
        { name: 'Peri Peri Paneer', desc: 'Hot, with extra peri seasoning', price: 360, veg: true, spicy: true },
        { name: 'Margherita', desc: 'Mozzarella, basil, San Marzano base', price: 240, veg: true },
      ]},
      { name: 'Sides', items: [
        { name: 'Garlic Breadsticks', desc: 'Served with dip', price: 140, veg: true },
        { name: 'Cheesy Dip', desc: 'Extra', price: 40, veg: true },
      ]},
    ],
  },
  {
    name: 'Sanskruti',
    slug: 'sanskruti-adajan',
    area: 'Adajan',
    cuisine: 'Gujarati Thali',
    tagline: 'Pure veg thali and Punjabi mains under one roof',
    description:
      'Families come for the thali, groups order Punjabi à la carte, and both work. The kitchen keeps the chaas coming without being asked.',
    tags: ['Thali', 'Pure Veg', 'Punjabi', 'Family dining'],
    rating: 4.2, reviewCount: 1670, priceRange: 2,
    hours: 'Daily 11:00 – 15:00, 18:30 – 23:00',
    cover: IMG('photo-1596040033229-a9821ebd058d'),
    categories: [
      { name: 'Thali', items: [
        { name: 'Sanskruti Special Thali', desc: 'Unlimited, seasonal shaak, two sweets', price: 440, veg: true, special: true },
        { name: 'Punjabi Thali', desc: 'Two sabzi, dal makhani, naan, rice', price: 420, veg: true },
      ]},
      { name: 'Punjabi', items: [
        { name: 'Paneer Tikka Masala', desc: 'Char-grilled paneer, onion-tomato gravy', price: 380, veg: true },
        { name: 'Dal Makhani', desc: 'Slow-cooked, finished with cream', price: 320, veg: true },
        { name: 'Malai Kofta', desc: 'Cashew gravy, mild', price: 360, veg: true },
      ]},
    ],
  },
  {
    name: 'Spice Villa',
    slug: 'spice-villa-athwalines',
    area: 'Athwalines',
    cuisine: 'North Indian',
    tagline: 'Tandoor kitchen with a courtyard',
    description:
      'A tandoor-led kitchen that does most of its work after eight. Ask for the kebab platter if the table cannot agree.',
    tags: ['Tandoor', 'North Indian', 'Dinner', 'Outdoor seating'],
    rating: 4.1, reviewCount: 980, priceRange: 3,
    hours: 'Daily 12:00 – 15:30, 19:00 – 23:30',
    cover: IMG('photo-1552566626-52f8b828add9'),
    categories: [
      { name: 'From the Tandoor', items: [
        { name: 'Achari Paneer Tikka', desc: 'Pickling spices, mustard oil', price: 380, veg: true, spicy: true, special: true },
        { name: 'Tandoori Broccoli', desc: 'Cheese and garlic marinade', price: 340, veg: true },
        { name: 'Mushroom Galouti', desc: 'Served on ulte tawe ka paratha', price: 360, veg: true },
      ]},
      { name: 'Mains', items: [
        { name: 'Kadhai Paneer', desc: 'Freshly pounded kadhai masala', price: 400, veg: true, spicy: true },
        { name: 'Yellow Dal Tadka', desc: 'Ghee, garlic, red chilli', price: 280, veg: true },
      ]},
    ],
  },
  {
    name: 'The Chocolate Room',
    slug: 'the-chocolate-room-city-light',
    area: 'City Light',
    cuisine: 'Cafe & Bakery',
    tagline: 'Hot chocolate, fondue and long afternoons',
    description:
      'Dessert café that keeps its tables through the afternoon. The fondue is a two-person minimum in practice.',
    tags: ['Cafe', 'Desserts', 'Chocolate', 'Family dining'],
    rating: 4.0, reviewCount: 1310, priceRange: 2,
    hours: 'Daily 10:30 – 23:30',
    cover: IMG('photo-1565557623262-b51c2513a641'),
    categories: [
      { name: 'Chocolate', items: [
        { name: 'Classic Hot Chocolate', desc: 'Belgian couverture, whole milk', price: 240, veg: true, special: true },
        { name: 'Chocolate Fondue', desc: 'Fruit, marshmallow, brownie chunks', price: 520, veg: true, special: true },
      ]},
      { name: 'Food', items: [
        { name: 'Pesto Panini', desc: 'Basil pesto, cheese, grilled', price: 280, veg: true },
        { name: 'Waffle with Ice Cream', desc: 'Belgian waffle, two scoops', price: 260, veg: true },
      ]},
    ],
  },
  {
    name: 'Coffee Culture',
    slug: 'coffee-culture-vesu',
    area: 'Vesu',
    cuisine: 'Cafe & Bakery',
    tagline: 'All-day café with a working crowd',
    description:
      'Power points at most tables and a menu long enough to justify staying. Breakfast runs until noon, which in Vesu means it runs until one.',
    tags: ['Cafe', 'Work-friendly', 'Breakfast', 'Wi-Fi'],
    rating: 4.1, reviewCount: 1490, priceRange: 2,
    hours: 'Daily 08:30 – 00:00',
    cover: IMG('photo-1445116572660-236099ec97a0'),
    categories: [
      { name: 'Breakfast', items: [
        { name: 'Shakshuka', desc: 'Baked eggs, tomato, sourdough', price: 340, veg: false, spicy: true, special: true },
        { name: 'Avocado Toast', desc: 'Multigrain, chilli flakes, lime', price: 320, veg: true },
        { name: 'Masala Omelette', desc: 'Three eggs, buttered pav', price: 220, veg: false, spicy: true },
      ]},
      { name: 'Coffee', items: [
        { name: 'Pour Over', desc: 'Single origin, changes weekly', price: 260, veg: true },
        { name: 'Vietnamese Cold Coffee', desc: 'Condensed milk, dark roast', price: 280, veg: true, special: true },
      ]},
    ],
  },
  {
    name: 'Surti Rasoi',
    slug: 'surti-rasoi-katargam',
    area: 'Katargam',
    cuisine: 'Surti Street Food',
    tagline: 'Undhiyu, ponk and the winter list',
    description:
      'A neighbourhood kitchen that comes into its own between November and February, when the Surti winter menu is the only reason to book ahead.',
    tags: ['Surti', 'Seasonal', 'Pure Veg', 'Takeaway'],
    rating: 4.5, reviewCount: 860, priceRange: 2,
    hours: 'Daily 10:00 – 22:00',
    cover: IMG('photo-1601050690597-df0568f70950'),
    categories: [
      { name: 'Winter', items: [
        { name: 'Surti Undhiyu', desc: 'Purple yam, muthiya, green garlic, clay pot', price: 280, veg: true, special: true },
        { name: 'Ponk Bhel', desc: 'Tender jowar, sev, lime', price: 160, veg: true },
        { name: 'Ubadiyu', desc: 'Steamed in an earthen pot, winter only', price: 300, veg: true, special: true },
      ]},
      { name: 'All Year', items: [
        { name: 'Surti Sev Khamani', desc: 'Pomegranate, coconut, sev', price: 110, veg: true },
        { name: 'Rassawala Khaman', desc: 'Soaked in sweet-sour water', price: 100, veg: true },
      ]},
    ],
  },
  {
    name: 'Ghadiyali Chowk Chaat',
    slug: 'ghadiyali-chowk-chaat',
    area: 'Chauta Bazaar',
    cuisine: 'Surti Street Food',
    tagline: 'Evening chaat counter in the old city',
    description:
      'The old-city chaat trade works on turnover, not tables. Stand, eat, move on. Peak is between seven and nine.',
    tags: ['Street food', 'Chaat', 'Budget', 'Evening'],
    rating: 4.4, reviewCount: 2050, priceRange: 1,
    hours: 'Daily 16:00 – 23:00',
    cover: IMG('photo-1610192244261-3f33de3f55e4'),
    categories: [
      { name: 'Chaat', items: [
        { name: 'Sev Puri', desc: 'Six puris, three chutneys, fine sev', price: 80, veg: true, special: true },
        { name: 'Dahi Puri', desc: 'Chilled curd, pomegranate', price: 90, veg: true },
        { name: 'Ragda Pattice', desc: 'White pea ragda, potato patty', price: 100, veg: true, spicy: true },
        { name: 'Pav Bhaji', desc: 'Butter-heavy, extra pav on request', price: 140, veg: true },
      ]},
    ],
  },
  {
    name: 'Mango Tree',
    slug: 'mango-tree-pal',
    area: 'Pal',
    cuisine: 'Multi-cuisine',
    tagline: 'Garden seating, wood-fired kitchen',
    description:
      'Outdoor tables under actual trees, which in a Surat summer means the kitchen does most of its trade after sunset.',
    tags: ['Outdoor seating', 'Multi-cuisine', 'Dinner', 'Group dining'],
    rating: 4.2, reviewCount: 1220, priceRange: 3,
    hours: 'Daily 12:00 – 15:00, 18:30 – 23:30',
    cover: IMG('photo-1414235077428-338989a2e8c0'),
    categories: [
      { name: 'Wood Fired', items: [
        { name: 'Margherita', desc: 'Ninety seconds in the wood oven', price: 380, veg: true },
        { name: 'Truffle Mushroom Pizza', desc: 'Truffle oil, three mushrooms', price: 520, veg: true, special: true },
      ]},
      { name: 'Asian', items: [
        { name: 'Thai Green Curry', desc: 'Coconut, basil, jasmine rice', price: 420, veg: true, spicy: true },
        { name: 'Burnt Garlic Fried Rice', desc: 'Wok-tossed, spring onion', price: 320, veg: true },
      ]},
    ],
  },
  {
    name: 'Kailash Dhaba',
    slug: 'kailash-dhaba-udhna',
    area: 'Udhna',
    cuisine: 'North Indian',
    tagline: 'Highway dhaba hours, city kitchen',
    description:
      'Charpai seating, tandoor at the front, and a kitchen that does not close until the last table leaves. Portions assume you skipped lunch.',
    tags: ['Dhaba', 'Late night', 'North Indian', 'Budget'],
    rating: 4.3, reviewCount: 1780, priceRange: 1,
    hours: 'Daily 11:00 – 02:00',
    cover: IMG('photo-1589301760014-d929f3979dbc'),
    categories: [
      { name: 'Dhaba Mains', items: [
        { name: 'Dal Tadka', desc: 'Double tadka, served in the karahi', price: 220, veg: true, special: true },
        { name: 'Paneer Bhurji', desc: 'Crumbled, onion, capsicum', price: 260, veg: true, spicy: true },
        { name: 'Aloo Paratha', desc: 'Two, with white butter and curd', price: 140, veg: true },
      ]},
      { name: 'Tandoor', items: [
        { name: 'Tandoori Roti', desc: 'Plain or buttered', price: 30, veg: true },
        { name: 'Lachha Paratha', desc: 'Layered, crisp', price: 60, veg: true },
      ]},
    ],
  },
  {
    name: 'Saffron Terrace',
    slug: 'saffron-terrace-piplod',
    area: 'Piplod',
    cuisine: 'North Indian',
    tagline: 'Rooftop dining above Piplod',
    description:
      'A rooftop that only makes sense from November onward, and is worth the wait when it does. Reservations are effectively mandatory on weekends.',
    tags: ['Rooftop', 'Fine dining', 'Dinner', 'Reservations'],
    rating: 4.4, reviewCount: 740, priceRange: 4,
    hours: 'Daily 19:00 – 23:45',
    cover: IMG('photo-1424847651672-bf20a4b0982b'),
    featured: true,
    categories: [
      { name: 'Small Plates', items: [
        { name: 'Beetroot Galouti', desc: 'Smoked beetroot, mint chutney, warqi paratha', price: 480, veg: true, special: true },
        { name: 'Burrata Chaat', desc: 'Burrata, tamarind, pomegranate, papdi', price: 620, veg: true, special: true },
      ]},
      { name: 'Mains', items: [
        { name: 'Nalli Nihari', desc: 'Eight-hour braise, ulte tawe ka paratha', price: 780, veg: false },
        { name: 'Subz Nizami Handi', desc: 'Sealed handi, saffron, cashew', price: 560, veg: true },
      ]},
    ],
  },
  {
    name: 'Green Leaf South Indian',
    slug: 'green-leaf-south-indian-varachha',
    area: 'Varachha',
    cuisine: 'South Indian',
    tagline: 'Dosa counter running from breakfast',
    description:
      'Batter ground on site and a griddle that never fully cools. The ghee roast is the order; everything else is a variation on it.',
    tags: ['South Indian', 'Breakfast', 'Pure Veg', 'Budget'],
    rating: 4.3, reviewCount: 1930, priceRange: 1,
    hours: 'Daily 07:00 – 22:30',
    cover: IMG('photo-1630383249896-424e482df921'),
    categories: [
      { name: 'Dosa', items: [
        { name: 'Ghee Roast Dosa', desc: 'Thin, crisp, generous ghee', price: 160, veg: true, special: true },
        { name: 'Mysore Masala Dosa', desc: 'Red chutney lining, potato masala', price: 180, veg: true, spicy: true },
        { name: 'Rava Onion Dosa', desc: 'Semolina batter, onion, curry leaf', price: 170, veg: true },
      ]},
      { name: 'Steamed', items: [
        { name: 'Idli Sambar', desc: 'Three idli, sambar, two chutneys', price: 110, veg: true },
        { name: 'Filter Coffee', desc: 'Tumbler and dabara', price: 60, veg: true, special: true },
      ]},
    ],
  },
  {
    name: 'Wok & Roll',
    slug: 'wok-and-roll-althan',
    area: 'Althan',
    cuisine: 'Chinese',
    tagline: 'Indo-Chinese, cooked hot and fast',
    description:
      'A small kitchen with two burners on full for most of the evening. The Schezwan here is genuinely hot, which the menu does mention.',
    tags: ['Chinese', 'Delivery', 'Spicy', 'Quick'],
    rating: 4.0, reviewCount: 1410, priceRange: 1,
    hours: 'Daily 11:30 – 23:30',
    cover: IMG('photo-1534939561126-855b8675edd7'),
    categories: [
      { name: 'Wok', items: [
        { name: 'Schezwan Noodles', desc: 'House chilli paste, hot', price: 220, veg: true, spicy: true, special: true },
        { name: 'Chilli Paneer Dry', desc: 'Capsicum, onion, soy', price: 260, veg: true, spicy: true },
        { name: 'Hakka Noodles', desc: 'Wok-tossed, mild', price: 200, veg: true },
      ]},
      { name: 'Starters', items: [
        { name: 'Veg Manchurian Dry', desc: 'Eight pieces, spring onion', price: 240, veg: true },
        { name: 'Crispy Corn', desc: 'Salt, pepper, curry leaf', price: 220, veg: true },
      ]},
    ],
  },
  {
    name: 'Bhagat Farsan Mart',
    slug: 'bhagat-farsan-mart-rander',
    area: 'Rander',
    cuisine: 'Surti Street Food',
    tagline: 'Farsan by weight, from six in the morning',
    description:
      'A counter, a set of scales and a queue. Nothing is plated; everything is wrapped. Sold out by mid-morning on Sundays.',
    tags: ['Farsan', 'Takeaway', 'Breakfast', 'Budget'],
    rating: 4.6, reviewCount: 1240, priceRange: 1,
    hours: 'Daily 06:00 – 11:30, 16:00 – 20:00',
    cover: IMG('photo-1497644083578-611b798c60f3'),
    categories: [
      { name: 'By Weight (250g)', items: [
        { name: 'Khaman', desc: 'Soft, sev on request', price: 90, veg: true },
        { name: 'Fafda', desc: 'With papaya sambharo', price: 100, veg: true, special: true },
        { name: 'Ganthiya', desc: 'Thick cut, black pepper', price: 95, veg: true },
        { name: 'Patra', desc: 'Sliced, tempered', price: 120, veg: true },
      ]},
    ],
  },
  {
    name: 'Ghari House',
    slug: 'ghari-house-majura-gate',
    area: 'Majura Gate',
    cuisine: 'Desserts',
    tagline: 'Surat’s own sweet, made for Chandani Padvo',
    description:
      'Ghari is Surat’s claim in the mithai argument — a ghee-rich, mawa-filled disc eaten by the kilo on Chandani Padvo. This counter makes it year-round.',
    tags: ['Mithai', 'Surti', 'Takeaway', 'Festive'],
    rating: 4.5, reviewCount: 1680, priceRange: 2,
    hours: 'Daily 08:00 – 22:00',
    cover: IMG('photo-1554118811-1e0d58224f24'),
    categories: [
      { name: 'Ghari (per kg)', items: [
        { name: 'Mawa Ghari', desc: 'The standard, heavy on ghee', price: 720, veg: true, special: true },
        { name: 'Pista Ghari', desc: 'Pistachio filling', price: 880, veg: true },
        { name: 'Badam Ghari', desc: 'Almond, less sweet', price: 900, veg: true },
      ]},
      { name: 'Other Mithai', items: [
        { name: 'Sutarfeni', desc: 'Spun, with pistachio', price: 640, veg: true },
        { name: 'Mohanthal', desc: 'Gram flour, cardamom', price: 700, veg: true },
      ]},
    ],
  },
];

export const CUISINES = [
  { name: 'Gujarati Thali', slug: 'gujarati-thali', blurb: 'Unlimited plates, seasonal shaak, and a server who will not let you leave hungry.' },
  { name: 'Surti Street Food', slug: 'surti-street-food', blurb: 'Locho, khaman, sev khamani and the winter undhiyu run — the food Surat is actually known for.' },
  { name: 'Cafe & Bakery', slug: 'cafe-and-bakery', blurb: 'Long tables, working crowds and coffee lists longer than the food menu.' },
  { name: 'North Indian', slug: 'north-indian', blurb: 'Tandoor kitchens and slow gravies, mostly after eight in the evening.' },
  { name: 'South Indian', slug: 'south-indian', blurb: 'Batter ground on site, griddles that never fully cool, filter coffee in a dabara.' },
  { name: 'Desserts', slug: 'desserts', blurb: 'Ghari, waffles, thickshakes and the chocolate counters in between.' },
  { name: 'Pizza & Italian', slug: 'pizza-and-italian', blurb: 'Wood-fired and late-night both, depending on the postcode.' },
  { name: 'Chinese', slug: 'chinese', blurb: 'Indo-Chinese cooked hot and fast, with Schezwan that means it.' },
  { name: 'BBQ & Grill', slug: 'bbq-and-grill', blurb: 'Table grills and buffet counters, built for groups that cannot agree.' },
  { name: 'Multi-cuisine', slug: 'multi-cuisine', blurb: 'Hotel dining rooms and garden kitchens that cover every table at once.' },
];

export const SEED_IMAGES = { IMG };

export type SeedPost = {
  slug: string;
  type: 'BLOG' | 'GUIDE' | 'LANDING';
  title: string;
  h1: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  cover: string;
  author: string;
  bodyMd: string;
};

export const SEED_POSTS: SeedPost[] = [
  {
    slug: 'how-to-create-a-digital-menu',
    type: 'GUIDE',
    title: 'How to Create a Digital Menu for Your Restaurant',
    h1: 'How to create a digital menu for your restaurant',
    excerpt:
      'Structure the categories, write descriptions that sell, price where the eye lands, and put the code where hands already are.',
    metaTitle: 'How to Create a Digital Menu for Your Restaurant (2026 Guide)',
    metaDescription:
      'Step-by-step guide to building a digital restaurant menu: category structure, descriptions, pricing, photography and QR placement.',
    tags: ['Getting started', 'Menu design', 'QR codes'],
    cover: IMG('photo-1495474472287-4d71bcdd2085'),
    author: 'QR4Menu Editorial',
    bodyMd: `A digital menu is your menu on a web page, opened by scanning a code at the table. It costs nothing to reprint and it can be corrected between two orders.

## Start with the category structure

Most menus need between four and eight categories. Fewer than four and diners scroll past everything. More than eight and the category bar becomes its own navigation problem.

A structure that works for most full-service kitchens:

- Starters or farsan
- Main course
- Breads and rice
- Beverages
- Desserts

Put the category people order from most at the top. For a café that is coffee, not food. For a thali house it is the thali, and everything else is a footnote.

## Write descriptions that do work

A description earns its place by answering a question the name leaves open. "Butter Chicken" needs no explanation in Ludhiana and a full one in Lisbon. "Locho" needs one almost everywhere outside Surat.

Three rules:

1. Lead with the ingredient that decides the order.
2. Keep it under fifteen words. Diners scan, they do not read.
3. Say what is unusual, not what is obvious.

## Price where the eye lands

Prices set flush against the item name invite line-by-line comparison shopping. Prices placed after the description, in the same weight as the body text, read as information rather than as a bill.

Dot leaders — the row of dots running from the dish name to the price — are a printed-menu convention for a reason. They let the eye travel across without the column of figures becoming the first thing scanned.

## Mark dietary information properly

Vegetarian and spice indicators are the most-used feature of any menu in India. Mark every item, not just the ones you think need it. An unmarked item reads as "nobody checked", which is worse than a wrong mark.

## Photograph selectively

A photograph next to every item makes a menu feel like a delivery app. Photograph the six dishes you want to sell and leave the rest as text.

## Put the code where hands already are

Table stickers work. Stickers on the table surface work better than tents because they survive being moved. Menus printed with the code in the corner suit venues keeping a physical menu as well.

Test the scan yourself, at the table, in your dining room's actual lighting, before printing a hundred.`,
  },
  {
    slug: 'benefits-of-qr-menu-for-restaurants',
    type: 'BLOG',
    title: 'QR Menus: What They Actually Change for a Restaurant',
    h1: 'QR menus: what they actually change for a restaurant',
    excerpt:
      'Beyond hygiene — the operational reasons restaurants keep QR menus long after the reason they adopted them stopped applying.',
    metaTitle: 'QR Menus: Real Benefits for Restaurants and Cafes',
    metaDescription:
      'The practical case for QR menus: instant price changes, no reprinting cost, out-of-stock control, and menu analytics.',
    tags: ['Operations', 'QR codes', 'Costs'],
    cover: IMG('photo-1517686469429-8bdb88b9f907'),
    author: 'QR4Menu Editorial',
    bodyMd: `Most restaurants first adopted QR menus for hygiene reasons. Most kept them for reasons that have nothing to do with hygiene.

## Price changes stop being an event

A printed menu makes every price change a batch decision. You wait until enough changes accumulate to justify a reprint. That delay is a real cost when onion doubles in a fortnight, and it is the reason so many menus carry prices the kitchen stopped honouring months ago.

## Out-of-stock is handled at the source

Marking a dish unavailable takes one tap and every diner sees it at once. Servers stop apologising for the same dish forty times a night, and the table stops feeling that the menu is a work of fiction.

> A menu that is wrong about what is available teaches diners to ask the server instead of reading. Once that habit forms, the menu has stopped working.

## The menu becomes measurable

A printed menu tells you nothing about what people looked at. A digital one tells you which categories get opened and which items hold attention — which is the input you need before redesigning it.

## Reprinting cost goes to zero

For a fifty-seat restaurant reprinting quarterly, laminated menus run into real money each year. The digital version costs nothing to change, and the printed code behind it never needs reissuing.

## What QR menus do not fix

They do not replace a server's recommendation. They do not work for diners without a smartphone, and every dining room has some. A slow-loading menu is worse than a printed one, because the diner is now waiting and annoyed rather than just reading.

Keep a few printed copies. Make sure the page loads in under two seconds on mobile data. Both of those are cheaper than the alternative.`,
  },
  {
    slug: 'surat-food-guide',
    type: 'BLOG',
    title: 'Eating in Surat: A Guide for People Who Live There',
    h1: 'Eating in Surat: a guide for people who live there',
    excerpt:
      'Locho, khaman, ghari and the winter undhiyu run — what the city actually eats, by neighbourhood and by season.',
    metaTitle: 'Surat Food Guide: Locho, Undhiyu, Ghari & Where to Eat',
    metaDescription:
      'A guide to eating in Surat by neighbourhood and season: Surti street food, Gujarati thali, winter undhiyu and ponk, and the ghari tradition.',
    tags: ['Surat', 'City guide', 'Surti food', 'Seasonal'],
    cover: IMG('photo-1596797038530-2c107229654b'),
    author: 'QR4Menu Editorial',
    bodyMd: `Surat has a reputation for eating well that it did not manufacture. The city runs on farsan counters that open at six, a thali trade that assumes you did not eat breakfast, and a winter menu that briefly makes every other city look under-supplied.

## Locho is the local argument

Locho is a Surat invention and it exists nowhere else in the same form. It is gram flour batter deliberately left under-set, so it never firms into khaman. It is scooped, not cut, then buried in butter, sev and raw onion.

Every Surti has a counter they defend. The disagreement is not about which is best in any measurable sense; it is about which one they grew up standing at.

## Farsan runs on a morning clock

The farsan trade is a morning business. Khaman, fafda, ganthiya and patra are made in the early hours, sold by weight, and largely gone by midday. A Sunday queue at a good counter in Rander or Nanpura clears the trays before eleven.

Sev khamani deserves its own line: khaman crumbled fine, then heaped with pomegranate and coconut. It is the dish visitors are most often surprised by.

## Winter is the season that matters

Between roughly November and February the city eats differently:

- **Undhiyu** — purple yam, muthiya and green garlic, slow-cooked, traditionally in an inverted earthen pot
- **Ponk** — tender jowar, eaten with sev and lime, available for a few weeks only
- **Ubadiyu** — steamed in an earthen pot over a fire, sold by weight

None of it is available year-round, and kitchens that claim otherwise are working from frozen stock.

## Ghari and Chandani Padvo

Ghari is a ghee-rich, mawa-filled disc that Surat eats by the kilo on Chandani Padvo, the night after Sharad Purnima. Counters run through the night. The rest of the year it sells steadily and quietly.

## Where the trade sits

Roughly, by neighbourhood:

| Area | What it is known for |
|---|---|
| Ghod Dod Road | Thali houses, cafés, the locho counters visitors are sent to |
| Vesu, Piplod | Newer restaurants, buffets, mall dining |
| Nanpura, Rander | Farsan counters, morning trade |
| Chauta Bazaar | Old-city chaat, evening only |
| Katargam, Varachha | Neighbourhood kitchens, seasonal Surti menus |

## If you have one meal

A thali at lunch, locho in the late afternoon, and ghari to take away. That is the city in three stops, and it is not a tourist itinerary — it is roughly what a Surti Sunday looks like.`,
  },
  {
    slug: 'menu-pricing-that-reads-well',
    type: 'GUIDE',
    title: 'Menu Pricing That Reads Well',
    h1: 'Menu pricing that reads well',
    excerpt:
      'Where the price sits, how it is set, and why the currency symbol is usually the problem.',
    metaTitle: 'Menu Pricing Design: Where to Put Prices and How to Set Them',
    metaDescription:
      'How to present prices on a restaurant menu: placement, typography, currency symbols, decimals and price anchoring, with practical examples.',
    tags: ['Menu design', 'Pricing', 'Typography'],
    cover: IMG('photo-1521017432531-fbd92d768814'),
    author: 'QR4Menu Editorial',
    bodyMd: `Pricing is a design decision before it is a commercial one. The same number reads differently depending on where it sits and what it is set in.

## Drop the trailing zeros

\`280\` reads as a price. \`₹280.00\` reads as an invoice. Decimals on a menu suggest precision that the kitchen does not have and the diner does not want. Keep them only where the currency genuinely uses them in ordinary speech.

## The currency symbol is usually noise

If every line on the menu is in rupees, the symbol on every line is repeated information. Put it in the header once — "All prices in ₹, inclusive of taxes" — and let the figures stand alone. This is standard in printed fine dining and it works for the same reason on a phone.

Keep the symbol when the menu serves a mixed audience, such as a hotel that prices in two currencies.

## Set figures in the display face

A price set in the body font disappears into the description. A price set in the menu's display face, at the same size as the dish name, reads as part of the design rather than as a running total.

Use tabular figures so the column lines up. Proportional figures make a list of prices look ragged even when the values are the same length.

## Anchoring works, but not the way it is usually described

The common advice is to put an expensive item at the top to make everything below it look reasonable. What actually works is narrower: one genuinely premium item in a category makes the second-most-expensive item the safe choice, and the second item is usually the one with the better margin.

This only works if the premium item is real. A dish priced high that nobody orders and the kitchen cannot make well is not an anchor, it is a liability.

## What to do when prices change often

Two principles:

1. Never show a price you will not honour. A wrong price costs more in trust than the difference costs in margin.
2. Change the price rather than adding "market price". That phrase reads as evasion on everything except seafood.

The whole argument for a digital menu is that the first principle stops being expensive to follow.`,
  },
  {
    slug: 'photographing-food-for-a-digital-menu',
    type: 'GUIDE',
    title: 'Photographing Food for a Digital Menu',
    h1: 'Photographing food for a digital menu',
    excerpt:
      'A phone, a window and a white board will out-perform a studio if you shoot at the right time of day.',
    metaTitle: 'How to Photograph Food for a Digital Menu (Phone Only)',
    metaDescription:
      'Practical food photography for restaurant menus using a phone: light, angle, which dishes to shoot, and how many photographs a menu should carry.',
    tags: ['Photography', 'Menu design', 'Getting started'],
    cover: IMG('photo-1495195134817-aeb325a55b65'),
    author: 'QR4Menu Editorial',
    bodyMd: `You do not need a photographer for a digital menu. You need one window, one morning, and the discipline to shoot fewer dishes than you think.

## Shoot fewer dishes

Six photographs on a forty-item menu is a design. Forty photographs is a delivery app. Pick the dishes you want to sell — high margin, or the ones that define the kitchen — and leave everything else as text.

An unphotographed dish does not read as worse. A badly photographed one does.

## Use the window, not the ring light

Indirect daylight from a side window, between about nine and eleven in the morning, is the best light most kitchens have. Turn the overhead tube lights off — mixing daylight with fluorescent gives food a green cast that no amount of editing fully removes.

Put a sheet of white thermocol or a folded tablecloth on the shadow side to bounce light back. That single step does more than any filter.

## Angle follows the dish

- **Flat, wide dishes** — thali, pizza, a spread — shoot from directly overhead
- **Tall, layered dishes** — burgers, parfaits, a stacked dosa — shoot at about 25 degrees
- **Bowls with depth** — curry, ramen — shoot at about 45 degrees so the contents are visible

The mistake is shooting everything from the same height because it is faster.

## Shoot it hot

Food has roughly two minutes of looking the way it tastes. Set the frame, set the light, and have the kitchen send the dish when you are ready — not the other way round.

## Keep the crop consistent

Decide one aspect ratio and shoot everything to it. A menu where some photographs are square and others are 4:3 looks unfinished no matter how good the individual shots are. 4:3 works well for most menu layouts.

## File size matters more than you expect

A menu is opened on mobile data, often on a weak signal, by someone who is hungry. A 4 MB photograph is a worse photograph than a 200 KB one, whatever it looks like on your laptop. Export at around 1200px on the long edge and let the platform handle the rest.`,
  },
  {
    slug: 'veg-and-non-veg-marks-on-indian-menus',
    type: 'GUIDE',
    title: 'Veg and Non-Veg Marks on Indian Menus',
    h1: 'Veg and non-veg marks on Indian menus',
    excerpt:
      'The green and brown symbols are a regulatory requirement, not a design choice — and getting them wrong is the fastest way to lose a table.',
    metaTitle: 'Veg and Non-Veg Symbols on Indian Menus: Rules and Practice',
    metaDescription:
      'How the green dot and brown triangle marks work on Indian food menus, what FSSAI requires, and how to apply them on a digital menu.',
    tags: ['India', 'Compliance', 'Menu design'],
    cover: IMG('photo-1516684732162-798a0062be99'),
    author: 'QR4Menu Editorial',
    bodyMd: `The green dot in a green square and the brown mark in a brown square are among the most-read pieces of design in India. On a menu they are not decoration and not optional.

## What the marks mean

The green mark indicates vegetarian. The non-vegetarian mark is the same square with a brown or red filled shape. Both come from India's packaged-food labelling rules under the FSSAI framework, and diners read them fluently — often before the dish name.

Eggs are the recurring ambiguity. Practice varies, and the safest approach on a menu is to mark egg dishes explicitly in the description rather than relying on the symbol alone.

## Mark every item

The strongest reason is not compliance, it is trust. On a menu where only some items carry the mark, an unmarked item does not read as "probably vegetarian" — it reads as "nobody checked". A diner who is strict about this will ask the server, and once they are asking the server, your menu has stopped doing its job.

## Do not redraw them

The temptation on a designed menu is to replace the symbol with something prettier — a leaf icon, a coloured dot, an emoji. Do not. The mark works precisely because it is standardised and instantly recognisable. A leaf is a guess; the square is a statement.

Keep the shape. You may adjust the stroke weight to sit with your typography. That is the whole permitted range.

## Where the mark sits

Before the dish name, aligned with the first line, at roughly the cap height of the name. Placing it after the name or beside the price makes the diner read the name first and then check — which is one scan too many on a phone.

## Jain, vegan and allergen information

The two-mark system does not cover Jain preparations, veganism or allergens, and pretending otherwise causes problems. If your kitchen can serve Jain, say so in words in the description. If a dish contains nuts, say so in words. Symbols do not scale to these distinctions, and inventing new ones puts you back at the leaf-icon problem.`,
  },
  {
    slug: 'qr-code-print-sizes-and-placement',
    type: 'GUIDE',
    title: 'QR Code Print Sizes and Placement',
    h1: 'QR code print sizes and placement',
    excerpt:
      'Thirty millimetres, a white margin, never inverted, and tested at the table before the run of a hundred.',
    metaTitle: 'QR Code Size for Restaurant Tables: Print Guide',
    metaDescription:
      'How large to print a restaurant QR code, where to place it, which file format to send the printer, and the mistakes that stop codes scanning.',
    tags: ['QR codes', 'Printing', 'Getting started'],
    cover: IMG('photo-1541167760496-1628856ab772'),
    author: 'QR4Menu Editorial',
    bodyMd: `A QR code that does not scan on the first try costs more than a printed menu, because the diner now has to ask for one.

## Size

Print at **30 mm across or larger** for a code read from table distance. The working rule is that scanning distance is roughly ten times the code's width, so a 30 mm code reads comfortably at about 300 mm — which is where a phone sits when someone is seated.

For a counter code read from a queue, go to 60 mm or more. People will not lean in.

## The quiet zone is not optional

Leave a clear margin of at least four modules — the small squares the code is built from — on every side. In practice, print the code with white space around it equal to about 10% of its width. Designs that crop tight into a coloured background are the single most common reason a code fails.

## Never invert

Dark code on a light background. Many camera apps still fail on inverted codes, and the ones that succeed take longer. This is the rule people break most often because an inverted code looks better on a dark table card, and it is not worth it.

## Send the printer a vector

PNG is fine for stickers and screens. For anything a print shop produces, send **SVG**. It stays sharp at any size and the printer will not resample it.

## Where to put it

- **Table stickers** survive being moved and wiped. The most reliable option.
- **Table tents** are easy to replace and give you room for a line of instruction.
- **Printed menus with the code in a corner** suit venues keeping a physical menu as well.

Add one line of text under the code: *Scan for our menu*. Without it, a meaningful number of diners assume the code is for payment or Wi-Fi.

## Test before the run

Scan it yourself, at the table, in your dining room's actual lighting, on one iPhone and one Android. Lighting is the variable people skip — a code that reads fine under the shop's fluorescents can fail under warm evening lighting at 15% brightness.`,
  },
  {
    slug: 'seasonal-menus-and-the-winter-list',
    type: 'BLOG',
    title: 'Seasonal Menus and the Winter List',
    h1: 'Seasonal menus and the winter list',
    excerpt:
      'Undhiyu, ponk and ubadiyu run for eight weeks. A printed menu cannot follow that; a digital one barely notices.',
    metaTitle: 'Running a Seasonal Menu: Winter Specials Without Reprinting',
    metaDescription:
      'How to run a seasonal restaurant menu — winter specials, limited runs and sold-out items — without reprinting, using a digital menu.',
    tags: ['Seasonal', 'Operations', 'Surti food'],
    cover: IMG('photo-1601050690597-df0568f70950'),
    author: 'QR4Menu Editorial',
    bodyMd: `In Gujarat the winter menu is not a marketing exercise. Undhiyu, ponk and ubadiyu are available when the produce is available and not one week longer, and every kitchen in the state reorganises around that for about eight weeks.

## The printed-menu problem

A seasonal list on a printed menu gives you three bad options: reprint twice a year, print an insert that gets lost, or leave the items on the menu all year and disappoint people for ten months.

Most kitchens choose the third, which is why so many menus carry an undhiyu that the kitchen will quietly talk you out of in April.

## What a seasonal section should do

Three things, in order:

1. **Say when it runs.** "December to February" under the section heading. Not "seasonal", which means nothing.
2. **Come off the menu when it ends.** A hidden category, not a struck-through line.
3. **Come back with the same URL.** The code on the table never changes, so the section returning is invisible to the diner except that it is suddenly there.

## Sold out is different from out of season

These need different treatment and they are often conflated.

**Sold out** is a today problem — mark the item unavailable and leave it visible. The diner learns the kitchen is honest and orders something else.

**Out of season** is a months problem — hide the category. Leaving twelve struck-through items on a menu for ten months trains people to stop reading it.

## The commercial argument

A limited run is worth more when it is visibly limited. A section that appears in November and disappears in February does the work that a "seasonal special" tag on a permanent menu never does, because the scarcity is real and the diner can see the calendar.

That only works if you actually remove it. The kitchens that keep undhiyu on the menu year-round have spent the scarcity and got nothing for it.`,
  },
  {
    slug: 'digital-menu-restaurant',
    type: 'LANDING',
    title: 'Digital Menu for Restaurants',
    h1: 'Digital menu for restaurants',
    excerpt:
      'Build a mobile-first digital menu for your restaurant and print one QR code for the table.',
    metaTitle: 'Digital Menu for Restaurants — Free QR Menu Maker',
    metaDescription:
      'Create a digital restaurant menu with categories, photographs, prices and dietary marks. Get a unique QR code. Guests need no app and no account.',
    tags: ['Restaurants', 'Getting started'],
    cover: IMG('photo-1517248135467-4c7edcad34c4'),
    author: 'QR4Menu Editorial',
    bodyMd: `A restaurant menu does more work than a café menu. It carries more items, more categories and more dietary information, and it is read by a table of people passing one phone around.

## What a restaurant menu needs

- **Category navigation that stays reachable.** Sticky category bars start mattering past about thirty items.
- **Vegetarian and spice marks on every item.** Unmarked items get skipped by the people who care most.
- **Availability control.** Taking the fish off for the evening should be one tap, not a conversation repeated forty times.
- **Fast loading on mobile data.** The menu is opened on a phone, often on a weak signal, by someone who is hungry.

## Setting it up

Add your restaurant details, create your categories, add items with prices, choose a design, then download the QR code and put it on the table. Nothing to install, and your guests never create an account.

## What it costs to change

Nothing, and that is the whole argument. A price correction, a dish taken off, an entire seasonal section added — none of it touches the printed code on the table.`,
  },
  {
    slug: 'digital-menu-cafe',
    type: 'LANDING',
    title: 'Digital Menu for Cafes',
    h1: 'Digital menu for cafes',
    excerpt:
      'A fast, good-looking digital menu for coffee shops, bakeries and dessert counters.',
    metaTitle: 'Digital Menu for Cafes — QR Code Menu Maker',
    metaDescription:
      'Create a cafe menu online with a QR code. Coffee, bakery and dessert categories with photographs and prices, on a mobile-first page.',
    tags: ['Cafes', 'Getting started'],
    cover: IMG('photo-1559339352-11d035aa65de'),
    author: 'QR4Menu Editorial',
    bodyMd: `Café menus are shorter than restaurant menus and read far more often per seat. Somebody ordering a flat white does not want to scroll past a starters section.

## What works for a café

- **Put drinks first.** It is what most people are there for.
- **Keep descriptions short.** A cortado needs three words, not fifteen.
- **Photograph the bakery counter, not the coffee.** Pastries sell on sight; a flat white photographs like every other flat white.
- **Use size variants as separate lines** where the price difference is meaningful.

## Design

Warm, low-contrast palettes suit cafés better than the high-contrast styles that work for fast food. Several of the templates are built for exactly this, and colours, fonts and layout are all editable afterwards.

## The counter code

Cafés have two scan points and they need different treatment. A counter code is read from about a metre back by someone in a queue, so print it larger. A table code is read from close range and can be small — what matters there is that it survives being wiped down.`,
  },
  {
    slug: 'qr-menu-restaurant',
    type: 'LANDING',
    title: 'QR Menu for Restaurants',
    h1: 'QR menu for restaurants',
    excerpt:
      'Generate a QR code that opens your restaurant menu, download it as PNG or vector, and print it for the table.',
    metaTitle: 'QR Menu for Restaurants — Free QR Code Generator',
    metaDescription:
      'Create a QR code menu for your restaurant. Download as PNG or SVG and print for tables. Guests scan and see your live menu, no app required.',
    tags: ['QR codes', 'Restaurants'],
    cover: IMG('photo-1541167760496-1628856ab772'),
    author: 'QR4Menu Editorial',
    bodyMd: `Your QR code points at one address: your menu page. Change the menu and the code keeps working, because the code never changes — only the page behind it does.

## Where to put the code

- **Table stickers** survive being moved and wiped. The most reliable option.
- **Table tents** are easy to replace and give you room for a line of instruction.
- **Printed menus with a code in the corner** suit venues keeping a physical menu as well.

## Size and contrast

Print at 30 mm across or larger for a scan from table distance. Keep a clear white margin around the code, and never print light-on-dark — many camera apps fail on inverted codes.

## Test before you print

Scan it yourself at the table, in your dining room's actual lighting, with both an iPhone and an Android. Print a hundred only after that works.

## Download formats

PNG suits stickers and digital use. SVG is a vector, so use it whenever a printer asks for artwork — it stays sharp at any size.`,
  },
  {
    slug: 'qr-menu-cafe',
    type: 'LANDING',
    title: 'QR Menu for Cafes',
    h1: 'QR menu for cafes',
    excerpt:
      'A QR code that opens your café menu on any phone. Download, print, put it on the counter.',
    metaTitle: 'QR Menu for Cafes — Free QR Code Generator',
    metaDescription:
      'Generate a QR code menu for your cafe or coffee shop. Print for counters and tables. Update drinks and prices at any time.',
    tags: ['QR codes', 'Cafes'],
    cover: IMG('photo-1445116572660-236099ec97a0'),
    author: 'QR4Menu Editorial',
    bodyMd: `Cafés have two scan points, and they need different things.

## At the counter

People in a queue are deciding. A counter code needs to be at eye level and scannable from about a metre back, which means printing it larger than a table code — 60 mm or more.

## At the table

Table codes are scanned from close range, so they can be small. What matters more is that they survive cleaning. A laminated sticker outlasts a paper tent by months.

## Keep the menu short behind it

A café menu opened on a phone should show drinks without scrolling. Put coffee first, then the rest.

## Updating

Seasonal drinks come and go. Add the item, mark last season's unavailable, and every code already printed shows the change immediately.`,
  },
];
