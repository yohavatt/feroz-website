// Mirrors FEROZ Cart.dc.html / FEROZ Checkout.dc.html `state.items`.

export interface CartItem {
  id: string | number;
  name: string;
  category: string;
  price: number;
  size?: string | null;
  color?: string | null;
  colorSwatch?: string | null;
  quantity: number;
  image: string;
}
