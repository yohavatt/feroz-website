// Mirrors FEROZ Account.dc.html `ordersData`.

export type OrderStatus = "DELIVERED" | "SHIPPED" | "PROCESSING";

export interface Order {
  number: string;
  date: string;
  total: number;
  status: OrderStatus;
  thumbs: string[];
}
