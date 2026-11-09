"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FormField } from "@/components/checkout/FormField";
import { DeliveryOption } from "@/components/checkout/DeliveryOption";
import { CheckoutOrderSummary, type CheckoutSummaryItem } from "@/components/checkout/CheckoutOrderSummary";
import { formatPrice } from "@/lib/products";
import styles from "./page.module.css";

// Checkout's frozen order snapshot, transcribed from the approved source
// spec. Deliberately not derived from Cart's state — Cart and Checkout are
// disconnected mock islands, same as Product Detail's "Add to Cart" never
// touches Cart. Item 3 carries color/colorSwatch as unrendered data only
// (see CheckoutOrderSummary.tsx) for literal fidelity to the approved
// snapshot, even though Checkout's own source markup never shows color.
const FROZEN_ITEMS: CheckoutSummaryItem[] = [
  { name: "Summit Shell Jacket", price: 249.99, size: "M", quantity: 1, image: "/assets/men-summit-shell.jpg" },
  { name: "Glacier Storm Pant", price: 159.99, size: "L", quantity: 1, image: "/assets/men-pant-snow.jpg" },
  { name: "Ridgeline Tech Tee", price: 49.99, size: "M", quantity: 2, image: "/assets/men-tee-mountain.jpg", color: "Olive", colorSwatch: "#3E4A30" },
];

type DeliveryId = "standard" | "express";

const DELIVERY_OPTIONS: { id: DeliveryId; title: string; eta: string; priceLabel: string; cost: number }[] = [
  { id: "standard", title: "STANDARD DELIVERY", eta: "5–7 BUSINESS DAYS", priceLabel: "FREE", cost: 0 },
  { id: "express", title: "EXPRESS DELIVERY", eta: "2–3 BUSINESS DAYS", priceLabel: "$15", cost: 15 },
];

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "cardNumber",
  "cardName",
  "cardExpiry",
  "cardCvv",
] as const;

type RequiredField = (typeof REQUIRED_FIELDS)[number];
type FieldKey = RequiredField | "apt";

type Fields = Record<FieldKey, string>;

const INITIAL_FIELDS: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvv: "",
};

// Only 8 of the 12 required fields show a visible "Required." message in
// source (the 4 payment fields get an error-colored border only, no text).
const MESSAGE_FIELDS = new Set<RequiredField>([
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zip",
]);

function isFieldInvalid(key: RequiredField, value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (key === "email") return !trimmed.includes("@");
  return false;
}

export default function CheckoutPage() {
  const [fields, setFields] = useState<Fields>(INITIAL_FIELDS);
  const [touched, setTouched] = useState<Partial<Record<RequiredField, boolean>>>({});
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [placed, setPlaced] = useState(false);

  function setField(key: FieldKey, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function touch(key: RequiredField) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function fieldError(key: RequiredField): boolean {
    return Boolean(touched[key]) && isFieldInvalid(key, fields[key]);
  }

  const requiredOk = REQUIRED_FIELDS.every((key) => !isFieldInvalid(key, fields[key]));

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === delivery) ?? DELIVERY_OPTIONS[0]!;
  const shippingCost = selectedDelivery.cost;
  const subtotal = FROZEN_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  const shippingLabel = shippingCost === 0 ? "FREE" : `$${shippingCost}`;

  function placeOrder() {
    if (!requiredOk) {
      setTouched(
        REQUIRED_FIELDS.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Partial<Record<RequiredField, boolean>>)
      );
      return;
    }
    setPlaced(true);
  }

  if (placed) {
    return (
      <>
        <div className={styles.navWrap}>
          <div className={styles.navPill}>
            <Link href="/" className={styles.wordmark}>
              FEROZ
            </Link>
            <div className={styles.secureLabel}>SECURE CHECKOUT</div>
          </div>
        </div>

        <div className={styles.confirmation}>
          <div className={styles.confirmIcon}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="31" stroke="var(--color-gold-500)" strokeWidth="2" />
              <path d="M20 33L28 41L44 24" stroke="var(--color-gold-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.orderNumber}>ORDER #FZ-83920</div>
          <h1 className={styles.confirmTitle}>ORDER CONFIRMED</h1>
          <p className={styles.confirmText}>
            Thank you for your order. We&apos;ve sent a confirmation email with your order details.
          </p>
          <p className={styles.confirmText}>Your gear is being prepared for the trail ahead.</p>
          <div className={styles.confirmDelivery}>
            ESTIMATED DELIVERY: {selectedDelivery.eta}
          </div>

          <div className={styles.confirmCard}>
            {FROZEN_ITEMS.map((item) => (
              <div key={item.name} className={styles.confirmItem}>
                <div className={styles.confirmThumb}>
                  <Image src={item.image} alt={item.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                </div>
                <div className={styles.confirmItemInfo}>
                  <div className={styles.confirmItemName}>{item.name}</div>
                  <div className={styles.confirmItemQty}>QTY {item.quantity}</div>
                </div>
                <div className={styles.confirmItemTotal}>${formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
            <div className={styles.confirmTotalPaid}>
              <span>Total Paid</span>
              <span>${formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/" className={styles.continueShopping}>
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerInner}>
            <span>&copy; 2024 FEROZ. All rights reserved.</span>
            <span>HUNT YOUR LIMITS</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.navWrap}>
        <div className={styles.navPill}>
          <Link href="/" className={styles.wordmark}>
            FEROZ
          </Link>
          <div className={styles.secureLabel}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6, verticalAlign: "-2px" }}>
              <path d="M2 6V4a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.3" />
              <rect x="1" y="6" width="10" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            SECURE CHECKOUT
          </div>
        </div>
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>CHECKOUT</h1>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.formColumn}>
          <section>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>1</span>
              <h2 className={styles.stepTitle}>CONTACT &amp; SHIPPING</h2>
            </div>
            <div className={styles.fieldGrid}>
              <FormField
                placeholder="First Name"
                value={fields.firstName}
                onChange={(v) => setField("firstName", v)}
                onBlur={() => touch("firstName")}
                error={fieldError("firstName")}
                errorMessage={MESSAGE_FIELDS.has("firstName") ? "Required." : undefined}
              />
              <FormField
                placeholder="Last Name"
                value={fields.lastName}
                onChange={(v) => setField("lastName", v)}
                onBlur={() => touch("lastName")}
                error={fieldError("lastName")}
                errorMessage={MESSAGE_FIELDS.has("lastName") ? "Required." : undefined}
              />
              <FormField
                placeholder="Email"
                value={fields.email}
                onChange={(v) => setField("email", v)}
                onBlur={() => touch("email")}
                error={fieldError("email")}
                errorMessage={MESSAGE_FIELDS.has("email") ? "Required." : undefined}
              />
              <FormField
                placeholder="Phone"
                value={fields.phone}
                onChange={(v) => setField("phone", v)}
                onBlur={() => touch("phone")}
                error={fieldError("phone")}
                errorMessage={MESSAGE_FIELDS.has("phone") ? "Required." : undefined}
              />
              <div className={styles.fullWidth}>
                <FormField
                  placeholder="Address"
                  value={fields.address}
                  onChange={(v) => setField("address", v)}
                  onBlur={() => touch("address")}
                  error={fieldError("address")}
                  errorMessage={MESSAGE_FIELDS.has("address") ? "Required." : undefined}
                />
              </div>
              <div className={styles.fullWidth}>
                <FormField
                  placeholder="Apartment, Suite, etc. (optional)"
                  value={fields.apt}
                  onChange={(v) => setField("apt", v)}
                  neutral
                />
              </div>
              <FormField
                placeholder="City"
                value={fields.city}
                onChange={(v) => setField("city", v)}
                onBlur={() => touch("city")}
                error={fieldError("city")}
                errorMessage={MESSAGE_FIELDS.has("city") ? "Required." : undefined}
              />
              <FormField
                placeholder="State"
                value={fields.state}
                onChange={(v) => setField("state", v)}
                onBlur={() => touch("state")}
                error={fieldError("state")}
                errorMessage={MESSAGE_FIELDS.has("state") ? "Required." : undefined}
              />
              <FormField
                placeholder="ZIP Code"
                value={fields.zip}
                onChange={(v) => setField("zip", v)}
                onBlur={() => touch("zip")}
                error={fieldError("zip")}
                errorMessage={MESSAGE_FIELDS.has("zip") ? "Required." : undefined}
              />
            </div>
          </section>

          <section>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>2</span>
              <h2 className={styles.stepTitle}>DELIVERY METHOD</h2>
            </div>
            <div className={styles.deliveryOptions}>
              {DELIVERY_OPTIONS.map((option) => (
                <DeliveryOption
                  key={option.id}
                  title={option.title}
                  eta={option.eta}
                  priceLabel={option.priceLabel}
                  selected={delivery === option.id}
                  onSelect={() => setDelivery(option.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>3</span>
              <h2 className={styles.stepTitle}>PAYMENT</h2>
              <span className={styles.mockBadge}>MOCK &mdash; NO REAL PAYMENT</span>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.fullWidth}>
                <FormField
                  placeholder="Card Number"
                  value={fields.cardNumber}
                  onChange={(v) => setField("cardNumber", v)}
                  onBlur={() => touch("cardNumber")}
                  error={fieldError("cardNumber")}
                  mono
                />
              </div>
              <FormField
                placeholder="Cardholder Name"
                value={fields.cardName}
                onChange={(v) => setField("cardName", v)}
                onBlur={() => touch("cardName")}
                error={fieldError("cardName")}
              />
              <div />
              <FormField
                placeholder="MM-YY"
                value={fields.cardExpiry}
                onChange={(v) => setField("cardExpiry", v)}
                onBlur={() => touch("cardExpiry")}
                error={fieldError("cardExpiry")}
                mono
              />
              <FormField
                placeholder="CVV"
                value={fields.cardCvv}
                onChange={(v) => setField("cardCvv", v)}
                onBlur={() => touch("cardCvv")}
                error={fieldError("cardCvv")}
                mono
              />
            </div>
          </section>
        </div>

        <CheckoutOrderSummary
          items={FROZEN_ITEMS}
          subtotal={subtotal}
          shippingLabel={shippingLabel}
          total={total}
          requiredOk={requiredOk}
          onPlaceOrder={placeOrder}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; 2024 FEROZ. All rights reserved.</span>
          <span>HUNT YOUR LIMITS</span>
        </div>
      </div>
    </>
  );
}
