import Image from "next/image";
import styles from "./OrderCard.module.css";

export interface OrderCardData {
  number: string;
  date: string;
  total: number;
  status: string;
  statusBg: string;
  statusColor: string;
  thumbs: string[];
}

export interface OrderCardProps {
  order: OrderCardData;
}

// "VIEW ORDER" is inert in source — no onClick at all — reproduced as a
// plain, non-interactive button.
export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.number}>ORDER #{order.number}</div>
          <div className={styles.date}>{order.date}</div>
        </div>
        <span className={styles.status} style={{ background: order.statusBg, color: order.statusColor }}>
          {order.status}
        </span>
      </div>
      <div className={styles.thumbs}>
        {order.thumbs.map((thumb, i) => (
          <div key={i} className={styles.thumbWrap}>
            <Image src={thumb} alt="" fill sizes="52px" className={styles.thumb} />
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.total}>${order.total}</span>
        <button type="button" className={styles.viewBtn}>
          VIEW ORDER
        </button>
      </div>
    </div>
  );
}
