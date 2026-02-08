export interface RoomData {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  heroImage: string;
  description: string[];
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
  gallery: string[];
  otherRooms: {
    title: string;
    price: string;
    image: string;
    tag: string;
    id: string;
  }[];
}

export const rooms: Record<string, RoomData> = {
  'superior-room': {
    id: 'superior-room',
    title: 'Superior Room',
    subtitle: 'Great for business trip',
    price: '$199',
    heroImage: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1920',
    description: [
      "Great choice for a relaxing vacation for families with children or a group of friends.",
      "Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.",
      "See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket. Effortless comfortable full leather lining eye-catching unique detail to the toe low 'cut-away' sides clean and sleek. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel molestie nisl. Duis ac mi leo. Mauris at convallis erat. Aliquam interdum semper luctus. Aenean ex tellus, gravida ut rutrum dignissim, malesuada vitae nulla. Sed viverra, nisl dapibus lobortis porttitor."
    ],
    specs: {
      bed: 'Twins Bed',
      capacity: '2 Adults 1 Children',
      size: '30m²',
      view: 'Sea view'
    },
    gallery: [
      'https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591088398332-8a77d399eb65?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&q=80&w=800'
    ],
    otherRooms: [
      { id: 'deluxe-room', title: 'Deluxe Room', price: '$249', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
      { id: 'signature-room', title: 'Signature Room', price: '$299', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
      { id: 'luxury-suite', title: 'Luxury Suite Room', price: '$399', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'deluxe-room': {
    id: 'deluxe-room',
    title: 'Deluxe Room',
    subtitle: 'Great for business trip',
    price: '$249',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1920',
    description: [
      "Great choice for a relaxing vacation for families with children or a group of friends.",
      "Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.",
      "See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket. Effortless comfortable full leather lining eye-catching unique detail to the toe low 'cut-away' sides clean and sleek.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel molestie nisl. Duis ac mi leo. Mauris at convallis erat. Aliquam interdum semper luctus."
    ],
    specs: {
      bed: 'King Bed',
      capacity: '3 Adults 1 Children',
      size: '55m²',
      view: 'Sea view'
    },
    gallery: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'
    ],
    otherRooms: [
      { id: 'superior-room', title: 'Superior Room', price: '$199', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800' },
      { id: 'signature-room', title: 'Signature Room', price: '$299', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
      { id: 'luxury-suite', title: 'Luxury Suite Room', price: '$399', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  'signature-room': {
    id: 'signature-room',
    title: 'Signature Room',
    subtitle: 'Great for families',
    price: '$299',
    heroImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1920',
    description: [
      "Great choice for a relaxing vacation for families with children or a group of friends.",
      "Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.",
      "See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel molestie nisl. Duis ac mi leo. Mauris at convallis erat. Aliquam interdum semper luctus."
    ],
    specs: {
      bed: 'King Bed',
      capacity: '3 Adults 2 Children',
      size: '70m²',
      view: 'Sea view'
    },
    gallery: [
      'https://images.unsplash.com/photo-1590073236110-33c0afd3db2f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80&w=1200'
    ],
    otherRooms: [
      { id: 'superior-room', title: 'Superior Room', price: '$199', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800' },
      { id: 'deluxe-room', title: 'Deluxe Room', price: '$249', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
      { id: 'luxury-suite', title: 'Luxury Suite Room', price: '$399', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800' }
    ]
  }
};
