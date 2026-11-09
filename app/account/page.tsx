"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthField } from "@/components/account/AuthField";
import { OrderCard, type OrderCardData } from "@/components/account/OrderCard";
import styles from "./page.module.css";

type View = "signin" | "create" | "forgot" | "dashboard";
type Tab = "orders" | "info" | "addresses";

interface SignInState {
  email: string;
  password: string;
  touched: Partial<Record<"email" | "password", boolean>>;
}

interface CreateState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  touched: Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirm", boolean>>;
}

interface ForgotState {
  email: string;
  touched: Partial<Record<"email", boolean>>;
  sent: boolean;
}

interface PersonalInfoState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  saved: boolean;
}

// account.firstName is intentionally a separate, hardcoded value — source
// never syncs it with the independently-editable Personal Info first name.
const ACCOUNT_FIRST_NAME = "Jordan";

const ORDERS: OrderCardData[] = [
  {
    number: "83920",
    date: "August 28, 2026",
    total: 448,
    status: "DELIVERED",
    statusBg: "var(--color-olive-700)",
    statusColor: "var(--color-gold-500)",
    thumbs: ["/assets/men-summit-shell.jpg", "/assets/men-pant-snow.jpg"],
  },
  {
    number: "81207",
    date: "July 12, 2026",
    total: 168,
    status: "SHIPPED",
    statusBg: "var(--color-rust-500)",
    statusColor: "var(--color-cream-100)",
    thumbs: ["/assets/men-pant-desert.jpg"],
  },
  {
    number: "79544",
    date: "June 3, 2026",
    total: 312,
    status: "DELIVERED",
    statusBg: "var(--color-olive-700)",
    statusColor: "var(--color-gold-500)",
    thumbs: ["/assets/men-storm-parka.jpg"],
  },
];

const ADDRESS_BODY = (
  <>
    Jordan Hale
    <br />
    482 Ridgeline Ave
    <br />
    Bozeman, MT 59715
    <br />
    United States
  </>
);

export default function AccountPage() {
  const [view, setView] = useState<View>("signin");
  const [tab, setTab] = useState<Tab>("orders");

  const [si, setSiState] = useState<SignInState>({ email: "", password: "", touched: {} });
  const [ca, setCaState] = useState<CreateState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    touched: {},
  });
  const [fp, setFpState] = useState<ForgotState>({ email: "", touched: {}, sent: false });
  const [pi, setPiState] = useState<PersonalInfoState>({
    firstName: "Jordan",
    lastName: "Hale",
    email: "jordan.hale@example.com",
    phone: "(406) 555-0148",
    saved: false,
  });

  function setSi(key: "email" | "password", value: string) {
    setSiState((s) => ({ ...s, [key]: value }));
  }
  function touchSi(key: "email" | "password") {
    setSiState((s) => ({ ...s, touched: { ...s.touched, [key]: true } }));
  }
  function submitSignin() {
    setSiState((s) => ({ ...s, touched: { email: true, password: true } }));
    const valid = si.email.includes("@") && si.password.length > 0;
    if (valid) setView("dashboard");
  }

  function setCa(key: keyof Omit<CreateState, "touched">, value: string) {
    setCaState((s) => ({ ...s, [key]: value }));
  }
  function touchCa(key: keyof Omit<CreateState, "touched">) {
    setCaState((s) => ({ ...s, touched: { ...s.touched, [key]: true } }));
  }
  function submitCreate() {
    setCaState((s) => ({
      ...s,
      touched: { firstName: true, lastName: true, email: true, password: true, confirm: true },
    }));
    const valid =
      ca.firstName.trim() &&
      ca.lastName.trim() &&
      ca.email.includes("@") &&
      ca.password.length >= 8 &&
      ca.confirm === ca.password;
    if (valid) setView("dashboard");
  }

  function setFp(value: string) {
    setFpState((s) => ({ ...s, email: value }));
  }
  function touchFp() {
    setFpState((s) => ({ ...s, touched: { ...s.touched, email: true } }));
  }
  function submitForgot() {
    setFpState((s) => ({ ...s, touched: { email: true } }));
    if (fp.email.includes("@")) setFpState((s) => ({ ...s, sent: true }));
  }

  function setPi(key: keyof Omit<PersonalInfoState, "saved">, value: string) {
    setPiState((s) => ({ ...s, [key]: value, saved: false }));
  }
  function savePi() {
    setPiState((s) => ({ ...s, saved: true }));
  }

  function logOut() {
    setView("signin");
  }

  const siEmailErr = !!si.touched.email && !si.email.includes("@");
  const siPassErr = !!si.touched.password && si.password.length === 0;
  const siValid = si.email.includes("@") && si.password.length > 0;

  const caFirstErr = !!ca.touched.firstName && !ca.firstName.trim();
  const caLastErr = !!ca.touched.lastName && !ca.lastName.trim();
  const caEmailErr = !!ca.touched.email && !ca.email.includes("@");
  const caPassErr = !!ca.touched.password && ca.password.length < 8;
  const caConfirmErr = !!ca.touched.confirm && ca.confirm !== ca.password;
  const caValid =
    !!ca.firstName.trim() &&
    !!ca.lastName.trim() &&
    ca.email.includes("@") &&
    ca.password.length >= 8 &&
    ca.confirm === ca.password;

  const fpEmailErr = !!fp.touched.email && !fp.email.includes("@");

  return (
    <>
      <Nav />

      {view === "signin" && (
        <div className={styles.authWrap} style={{ maxWidth: 440 }}>
          <h1 className={styles.authTitle} style={{ fontSize: "clamp(30px, 4vw, 38px)" }}>
            SIGN IN
          </h1>
          <p className={styles.authSubtitle}>Access your FEROZ account.</p>

          <div className={styles.fieldStack}>
            <AuthField
              type="text"
              placeholder="Email"
              value={si.email}
              onChange={(v) => setSi("email", v)}
              onBlur={() => touchSi("email")}
              error={siEmailErr}
              errorMessage="Enter a valid email address."
            />
            <AuthField
              type="password"
              placeholder="Password"
              value={si.password}
              onChange={(v) => setSi("password", v)}
              onBlur={() => touchSi("password")}
              error={siPassErr}
              errorMessage="Password is required."
            />
            <div className={styles.forgotLinkRow}>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("forgot"); }} className={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>
            <button
              type="button"
              onClick={submitSignin}
              className={styles.submitBtn}
              style={{
                background: siValid ? "var(--color-ink)" : "rgba(244,239,227,0.15)",
                color: siValid ? "var(--color-cream-100)" : "rgba(244,239,227,0.55)",
              }}
            >
              SIGN IN
            </button>
          </div>

          <div className={styles.switchViewRow}>
            Don&rsquo;t have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setView("create"); }} className={styles.switchViewLink}>
              CREATE ACCOUNT
            </a>
          </div>

          <div className={styles.newToFeroz}>
            <div className={styles.newToFerozTitle}>NEW TO FEROZ?</div>
            <p className={styles.newToFerozBody}>
              Create an account to track orders, save your details and make checkout faster.
            </p>
            <a href="#" onClick={(e) => { e.preventDefault(); setView("create"); }} className={styles.createAccountPill}>
              CREATE ACCOUNT
            </a>
          </div>

          <div className={styles.trustStrip}>
            SECURE CHECKOUT &nbsp;&middot;&nbsp; EASY RETURNS &nbsp;&middot;&nbsp; FREE SHIPPING $150+
          </div>
        </div>
      )}

      {view === "create" && (
        <div className={styles.authWrap} style={{ maxWidth: 480 }}>
          <h1 className={styles.authTitle} style={{ fontSize: "clamp(30px, 4vw, 38px)" }}>
            CREATE ACCOUNT
          </h1>
          <p className={styles.authSubtitle}>Join FEROZ and track your gear.</p>

          <div className={styles.fieldGrid}>
            <AuthField
              type="text"
              placeholder="First Name"
              value={ca.firstName}
              onChange={(v) => setCa("firstName", v)}
              onBlur={() => touchCa("firstName")}
              error={caFirstErr}
              errorMessage="Required."
            />
            <AuthField
              type="text"
              placeholder="Last Name"
              value={ca.lastName}
              onChange={(v) => setCa("lastName", v)}
              onBlur={() => touchCa("lastName")}
              error={caLastErr}
              errorMessage="Required."
            />
            <div className={styles.fullWidth}>
              <AuthField
                type="text"
                placeholder="Email"
                value={ca.email}
                onChange={(v) => setCa("email", v)}
                onBlur={() => touchCa("email")}
                error={caEmailErr}
                errorMessage="Enter a valid email address."
              />
            </div>
            <div className={styles.fullWidth}>
              <AuthField
                type="password"
                placeholder="Password"
                value={ca.password}
                onChange={(v) => setCa("password", v)}
                onBlur={() => touchCa("password")}
                error={caPassErr}
                errorMessage="Minimum 8 characters."
              />
            </div>
            <div className={styles.fullWidth}>
              <AuthField
                type="password"
                placeholder="Confirm Password"
                value={ca.confirm}
                onChange={(v) => setCa("confirm", v)}
                onBlur={() => touchCa("confirm")}
                error={caConfirmErr}
                errorMessage="Passwords do not match."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={submitCreate}
            className={styles.submitBtn}
            style={{
              background: caValid ? "var(--color-ink)" : "rgba(244,239,227,0.15)",
              color: caValid ? "var(--color-cream-100)" : "rgba(244,239,227,0.55)",
              marginTop: 20,
            }}
          >
            CREATE ACCOUNT
          </button>

          <div className={styles.switchViewRow}>
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setView("signin"); }} className={styles.switchViewLink}>
              SIGN IN
            </a>
          </div>
        </div>
      )}

      {view === "forgot" && (
        <div className={styles.authWrap} style={{ maxWidth: 420 }}>
          <h1 className={styles.authTitle} style={{ fontSize: "clamp(28px, 3.6vw, 34px)" }}>
            FORGOT PASSWORD?
          </h1>
          <p className={styles.authSubtitle}>Enter your email and we&rsquo;ll send reset instructions.</p>

          {fp.sent ? (
            <div className={styles.sentBlock}>
              Reset instructions sent to <strong className={styles.sentEmail}>{fp.email}</strong>.
            </div>
          ) : (
            <>
              <AuthField
                type="text"
                placeholder="Email"
                value={fp.email}
                onChange={setFp}
                onBlur={touchFp}
                error={fpEmailErr}
                errorMessage="Enter a valid email address."
              />
              <button type="button" onClick={submitForgot} className={styles.forgotResetBtn}>
                RESET PASSWORD
              </button>
            </>
          )}

          <div className={styles.backToSignin}>
            <a href="#" onClick={(e) => { e.preventDefault(); setView("signin"); }} className={styles.backToSigninLink}>
              &larr; BACK TO SIGN IN
            </a>
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <>
          <div className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>MY ACCOUNT</h1>
            <div className={styles.welcomeBack}>Welcome back, {ACCOUNT_FIRST_NAME}</div>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.sidebar}>
              <button
                type="button"
                onClick={() => setTab("orders")}
                className={styles.sidebarBtn}
                style={{
                  background: tab === "orders" ? "var(--color-ink)" : "transparent",
                  color: tab === "orders" ? "var(--color-cream-100)" : "rgba(244,239,227,0.7)",
                }}
              >
                ORDERS
              </button>
              <button
                type="button"
                onClick={() => setTab("info")}
                className={styles.sidebarBtn}
                style={{
                  background: tab === "info" ? "var(--color-ink)" : "transparent",
                  color: tab === "info" ? "var(--color-cream-100)" : "rgba(244,239,227,0.7)",
                }}
              >
                PERSONAL INFORMATION
              </button>
              <button
                type="button"
                onClick={() => setTab("addresses")}
                className={styles.sidebarBtn}
                style={{
                  background: tab === "addresses" ? "var(--color-ink)" : "transparent",
                  color: tab === "addresses" ? "var(--color-cream-100)" : "rgba(244,239,227,0.7)",
                }}
              >
                ADDRESSES
              </button>
              <div className={styles.sidebarDivider} />
              <button type="button" onClick={logOut} className={styles.logoutBtn}>
                LOG OUT
              </button>
            </div>

            {tab === "orders" && (
              <div className={styles.ordersPanel}>
                {ORDERS.map((order) => (
                  <OrderCard key={order.number} order={order} />
                ))}
              </div>
            )}

            {tab === "info" && (
              <div className={styles.infoPanel}>
                <div className={styles.infoGrid}>
                  <div>
                    <div className={styles.infoLabel}>FIRST NAME</div>
                    <input
                      type="text"
                      value={pi.firstName}
                      onChange={(e) => setPi("firstName", e.target.value)}
                      className={styles.infoInput}
                    />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>LAST NAME</div>
                    <input
                      type="text"
                      value={pi.lastName}
                      onChange={(e) => setPi("lastName", e.target.value)}
                      className={styles.infoInput}
                    />
                  </div>
                  <div className={styles.fullWidth}>
                    <div className={styles.infoLabel}>EMAIL</div>
                    <input
                      type="text"
                      value={pi.email}
                      onChange={(e) => setPi("email", e.target.value)}
                      className={styles.infoInput}
                    />
                  </div>
                  <div className={styles.fullWidth}>
                    <div className={styles.infoLabel}>PHONE</div>
                    <input
                      type="text"
                      value={pi.phone}
                      onChange={(e) => setPi("phone", e.target.value)}
                      className={styles.infoInput}
                    />
                  </div>
                </div>
                <button type="button" onClick={savePi} className={styles.saveBtn}>
                  SAVE CHANGES
                </button>
                {pi.saved && <div className={styles.savedNote}>Changes saved.</div>}
              </div>
            )}

            {tab === "addresses" && (
              <div className={styles.addressesPanel}>
                <div className={styles.addressCard}>
                  <div className={styles.addressLabel}>DEFAULT SHIPPING</div>
                  <div className={styles.addressBody}>{ADDRESS_BODY}</div>
                  <button type="button" className={styles.editBtn}>
                    EDIT
                  </button>
                </div>
                <div className={styles.addressCard}>
                  <div className={styles.addressLabel}>DEFAULT BILLING</div>
                  <div className={styles.addressBody}>{ADDRESS_BODY}</div>
                  <button type="button" className={styles.editBtn}>
                    EDIT
                  </button>
                </div>
                <div className={styles.addAddressCard}>
                  <button type="button" className={styles.addAddressBtn}>
                    + ADD NEW ADDRESS
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </>
  );
}
