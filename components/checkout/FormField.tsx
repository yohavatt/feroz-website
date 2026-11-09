import styles from "./FormField.module.css";

// Controlled text input matching Checkout's field pattern. Source's
// fieldStyle() computes background as `error ? '#F4EFE3' : '#F4EFE3'` —
// literally the same value either way — reproduced here as a constant
// cream background rather than a dead conditional.
export interface FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  /** Touched + invalid, as computed by the page. */
  error?: boolean;
  /** Only 8 of the 12 required fields show this text in source — the 4
   *  payment fields get error-colored borders but no visible message. */
  errorMessage?: string;
  /** Card Number / MM-YY / CVV use Space Mono in source; Cardholder Name
   *  and every non-payment field use Poppins. */
  mono?: boolean;
  /** Apartment/Suite in source has a hardcoded `border:1.5px solid
   *  transparent` — no error state, and no "filled" green border either. */
  neutral?: boolean;
}

export function FormField({
  value,
  onChange,
  onBlur,
  placeholder,
  error = false,
  errorMessage,
  mono = false,
  neutral = false,
}: FormFieldProps) {
  const complete = !neutral && !error && value.trim().length > 0;
  const borderColor = neutral
    ? "transparent"
    : error
      ? "var(--color-rust-500)"
      : complete
        ? "#7d9160"
        : "transparent";

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={mono ? styles.inputMono : styles.input}
        style={{ borderColor }}
      />
      {error && errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
}
