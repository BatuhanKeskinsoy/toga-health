export const validatePasswordRules = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export const isPasswordValid = (rules: ReturnType<typeof validatePasswordRules>) =>
  rules.length && rules.uppercase && rules.number && rules.special;
