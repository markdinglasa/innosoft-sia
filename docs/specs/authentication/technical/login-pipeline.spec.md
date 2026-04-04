# TECH SPEC — Login Pipeline

## 1. Spec ID
TECH-AUTH-001

## 2. Objective
Define the deterministic login pipeline from credential entry to session bootstrap.

## 3. Pipeline
Recommended login pipeline:

1. receive login request from renderer
2. validate input schema
3. normalize login identifier
4. fetch user account
5. validate account state
6. verify password hash
7. check lock / failed attempt policy
8. check startup licensing gate if required
9. resolve user context
10. create authenticated session
11. return safe session bootstrap payload

## 4. Input Contract
```ts
type LoginRequest = {
  username: string;
  password: string;
};
```

## 5. Output Contract
```ts
type LoginResult =
  | {
      success: true;
      sessionBootstrap: AuthenticatedSessionBootstrap;
    }
  | {
      success: false;
      code: LoginErrorCode;
      message: string;
    };
```

## 6. Error Codes
```ts
type LoginErrorCode =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_INACTIVE"
  | "ACCOUNT_LOCKED"
  | "PASSWORD_EXPIRED"
  | "LICENSE_BLOCKED"
  | "USER_CONTEXT_INCOMPLETE"
  | "TERMINAL_CONTEXT_REQUIRED";
```

## 7. Required Rules
- login must be handled outside renderer business logic
- password must never be returned to renderer
- failure responses must be safe and non-leaky

## 8. Agent Restrictions
- DO NOT compare plaintext passwords in renderer
- DO NOT return hash or sensitive auth data