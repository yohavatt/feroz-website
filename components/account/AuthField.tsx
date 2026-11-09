import styles from "./AuthField.module.css";

// Account's own input pattern — distinct from Checkout's FormField: only
// ever transparent or error-red border, no "complete" green state, and its
// own padding/font-size (16px 20px / 15px, vs Checkout's 15px 20px / 14px).
export interface AuthFieldProps {
  type: "text" | "password";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  error?: boolean;
  errorMessage?: string;
}

export function AuthField({ type, value, onChange, onBlur, placeholder, error = false, errorMessage }: AuthFieldProps) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={styles.input}
        style={{ borderColor: error ? "var(--color-rust-500)" : "transparent" }}
      />
      {error && errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
}
