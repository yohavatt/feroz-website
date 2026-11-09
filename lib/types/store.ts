// Mirrors FEROZ Store Locator.dc.html `storesData`.

export interface Store {
  name: string;
  city: string;
  address: string;
  distance?: string;
  hours: string;
  phone: string;
  categories: string[];
}
