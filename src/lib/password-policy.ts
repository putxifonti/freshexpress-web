export const PASSWORD_POLICY_MESSAGE =
  'La contrasenya ha de tenir almenys 8 caràcters, una majúscula, una minúscula, un número i un símbol (màxim 72 bytes).';

// bcrypt only uses the first 72 UTF-8 bytes. Reject longer passwords instead of
// silently accepting distinct passwords that share the same first 72 bytes.
export function isStrongPassword(password: unknown): password is string {
  return typeof password === 'string' &&
    [...password].length >= 8 &&
    new TextEncoder().encode(password).length <= 72 &&
    /\p{Lu}/u.test(password) &&
    /\p{Ll}/u.test(password) &&
    /[0-9]/.test(password) &&
    /[^\p{L}\p{N}\s]/u.test(password);
}
