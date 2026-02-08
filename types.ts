
export interface NavItem {
  label: string;
  href: string;
}

export interface RoomDetail {
  bed: string;
  capacity: string;
  roomSize: string;
  view: string;
  recommend: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
