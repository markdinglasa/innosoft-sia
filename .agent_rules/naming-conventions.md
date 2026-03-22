# Naming Conventions Design Pattern

This document defines the strict naming conventions to be followed throughout the codebase. All code must adhere to these conventions for consistency and maintainability.

## Overview

This design pattern establishes clear rules for naming different code elements in TypeScript/NestJS applications. Following these conventions ensures code readability, consistency, and easier collaboration.

---

## 1. Classes, Interfaces, Enums, Events

**Convention:** PascalCase

These are type definitions and should use PascalCase (first letter of each word capitalized).

**Note:** Interface names use PascalCase, but interface fields/properties use camelCase (see section 3).

### Examples:

```typescript
// Classes
class Logger {
  // ...
}

class AuthService {
  // ...
}

class UserRepository {
  // ...
}

// Interfaces (names are PascalCase, fields are camelCase)
interface IUserService {
  // ...
}

interface AuthenticationResponse {
  // ...
}

interface LineModel {
  id: string;
  createdDate: Date;
  updatedDate?: Date | null;
  deletedDate?: Date | null;
}

interface LineModel {
  id: string;
  createdDate: Date;
  updatedDate?: Date | null;
  deletedDate?: Date | null;
}

// Enums
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

enum TransactionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

// Events
class UserCreatedEvent {
  // ...
}

class PaymentProcessedEvent {
  // ...
}
```

---

## 2. Methods, Properties, Events

**Convention:** camelCase for abstract methods, PascalCase for concrete implementations

**Abstract Methods/Functions:** Abstract methods defined in abstract classes or interfaces should use camelCase to align with TypeScript/NestJS conventions.

**Concrete Methods:** Public methods in concrete implementations, properties, and event handlers should use PascalCase.

**Note:** When implementing abstract methods, the concrete implementation should match the abstract method signature exactly (camelCase).

### Examples:

```typescript
// Abstract class with camelCase methods
abstract class AuthService {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(page: number, limit: number): Promise<User[]>;
  abstract findOne(id: string): Promise<User>;
}

// Concrete implementation with PascalCase methods
class AuthServiceImpl extends AuthService {
  // Properties
  public IsActive: boolean;
  public UserName: string;
  public MaxRetryCount: number;

  // Concrete methods implementing abstract methods (must match signature)
  public create(createUserDto: CreateUserDto): Promise<User> {
    // Implementation
  }

  public findAll(page: number, limit: number): Promise<User[]> {
    // Implementation
  }

  public findOne(id: string): Promise<User> {
    // Implementation
  }

  // Additional public methods (PascalCase)
  public AuthenticateUser(): Promise<User> {
    // ...
  }

  public ValidateToken(): boolean {
    // ...
  }

  // Event handlers
  public OnUserLogin(): void {
    // ...
  }

  public OnPaymentComplete(): void {
    // ...
  }
}
```

---

## 3. Local Variables, Method Parameters, Interface Fields

**Convention:** camelCase

Local variables, method parameters, and interface fields should use camelCase (first word lowercase, subsequent words capitalized).

### Examples:

```typescript
// Interface fields
interface LineModel {
  id: string;
  createdDate: Date;
  updatedDate?: Date | null;
  deletedDate?: Date | null;
}

interface UserModel {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

// Method parameters and local variables
class UserService {
  public createUser(userName: string, firstName: string, lastName: string): User {
    // Local variables
    const userId = this.generateUserId();
    const fullName = `${firstName} ${lastName}`;
    const createdAt = new Date();

    // Method parameters (already in camelCase)
    // userName, firstName, lastName

    return new User(userId, userName, fullName, createdAt);
  }

  public processTransaction(transactionId: string, amount: number): void {
    const transaction = this.findTransaction(transactionId);
    const totalAmount = amount * 1.1; // with tax
    const processedAt = new Date();

    // Process transaction...
  }
}
```

---

## 4. Constants (Private or Internal)

**Convention:** PascalCase

Private or internal constants should use PascalCase.

### Examples:

```typescript
class AuthService {
  // Private constants
  private readonly MaxRetryCount: number = 3;
  private readonly DefaultTimeout: number = 5000;
  private readonly TokenExpirationTime: number = 3600;

  // Internal constants
  internal readonly ApiBaseUrl: string = 'https://api.example.com';
  internal readonly MaxLoginAttempts: number = 5;

  publica uthenticateUser(userName: string): Promise<User> {
    let retryCount = 0;

    while (retryCount < this.MaxRetryCount) {
      try {
        // Authentication logic...
        break;
      } catch (error) {
        retryCount++;
        if (retryCount >= this.MaxRetryCount) {
          throw new Error('Max retry count exceeded');
        }
      }
    }
  }
}
```

---

## 5. Private/Protected Fields

**Convention:** camelCase with `_` prefix

Private or protected fields should use camelCase with an underscore prefix.

### Examples:

```typescript
class AuthService {
  // Private fields
  private _logger: Logger;
  private _userRepository: UserRepository;
  private _configService: ConfigService;
  private _httpService: HttpService;

  // Protected fields
  protected _cache: Map<string, any>;
  protected _isInitialized: boolean;

  constructor(logger: Logger, userRepository: UserRepository, configService: ConfigService) {
    this._logger = logger;
    this._userRepository = userRepository;
    this._configService = configService;
    this._cache = new Map();
    this._isInitialized = false;
  }

  public AuthenticateUser(userName: string): Promise<User> {
    this._logger.Log(`Authenticating user: ${userName}`);
    return this._userRepository.FindByUserName(userName);
  }
}

class BaseService {
  protected _logger: Logger;
  protected _isActive: boolean;

  constructor(logger: Logger) {
    this._logger = logger;
    this._isActive = true;
  }
}
```

---

## 6. Namespaces

**Convention:** PascalCase

Namespaces should use PascalCase with dot notation for hierarchical organization.

### Examples:

```typescript
// Namespace declaration
namespace AppName {
  namespace Core {
    namespace Services {
      export class UserService {
        // ...
      }
    }

    namespace Repositories {
      export class UserRepository {
        // ...
      }
    }
  }

  namespace Authentication {
    export class AuthService {
      // ...
    }
  }
}

// Usage
const userService = new AppName.Core.Services.UserService();
const authService = new AppName.Authentication.AuthService();
```

---

## Complete Example

Here's a complete example demonstrating all naming conventions:

```typescript
// Namespace
namespace iPOS {
  namespace Authentication {
    namespace Services {
      // Enum
      enum AuthStatus {
        Success = 'success',
        Failed = 'failed',
        Pending = 'pending',
      }

      // Interface (fields are camelCase)
      interface IAuthResponse {
        status: AuthStatus;
        token: string;
        userId: string;
      }

      // Class
      export class AuthService {
        // Constants
        private readonly MaxRetryCount: number = 3;
        private readonly DefaultTimeout: number = 5000;

        // Private fields
        private _logger: Logger;
        private _userRepository: UserRepository;
        private _configService: ConfigService;

        // Public properties
        public IsActive: boolean;
        public ApiBaseUrl: string;

        constructor(logger: Logger, userRepository: UserRepository, configService: ConfigService) {
          this._logger = logger;
          this._userRepository = userRepository;
          this._configService = configService;
          this.IsActive = true;
          this.ApiBaseUrl = this._configService.Get('API_URL');
        }

        // Public method
        public async authenticateUser(userName: string, password: string): Promise<IAuthResponse> {
          // Local variables
          const startTime = Date.now();
          let retryCount = 0;
          let authResult: IAuthResponse | null = null;

          this._logger.Log(`Authenticating user: ${userName}`);

          while (retryCount < this.MaxRetryCount && !authResult) {
            try {
              const user = await this._userRepository.FindByUserName(userName);

              if (user && this.ValidatePassword(password, user.PasswordHash)) {
                const token = this.GenerateToken(user.Id);
                authResult = {
                  status: AuthStatus.Success,
                  token: token,
                  userId: user.Id,
                };
              } else {
                authResult = {
                  status: AuthStatus.Failed,
                  token: '',
                  userId: '',
                };
              }
            } catch (error) {
              retryCount++;
              this._logger.LogError(`Authentication attempt ${retryCount} failed: ${error}`);

              if (retryCount >= this.MaxRetryCount) {
                throw new Error('Authentication failed after max retries');
              }
            }
          }

          const duration = Date.now() - startTime;
          this._logger.Log(`Authentication completed in ${duration}ms`);

          return authResult;
        }

        // Private method
        private ValidatePassword(password: string, hash: string): boolean {
          // Validation logic
          return true;
        }

        private GenerateToken(userId: string): string {
          // Token generation logic
          return 'generated-token';
        }

        // Event handler
        public OnModuleInit(): void {
          this._logger.Log('AuthService initialized');
        }
      }
    }
  }
}
```

---

## Summary Table

| Element Type                 | Convention                | Example                           |
| ---------------------------- | ------------------------- | --------------------------------- |
| Classes                      | PascalCase                | `class Logger`                    |
| Interface Names              | PascalCase                | `interface IUserService`          |
| Interface Fields             | camelCase                 | `id`, `userName`, `createdDate`   |
| Enums                        | PascalCase                | `enum UserRole`                   |
| Events                       | PascalCase                | `class UserCreatedEvent`          |
| Abstract Methods             | camelCase                 | `create()`, `findAll()`           |
| Concrete Methods             | camelCase (matching abstract) or PascalCase | `Create()`, `FindAll()` or `create()`, `findAll()` |
| Properties                   | PascalCase                | `IsActive`, `UserName`            |
| Local Variables              | camelCase                 | `userName`, `firstName`           |
| Method Parameters            | camelCase                 | `userName`, `retryCount`          |
| Constants (Private/Internal) | PascalCase                | `MaxRetryCount`, `DefaultTimeout` |
| Private/Protected Fields     | camelCase with `_` prefix | `_logger`, `_userRepository`      |
| Namespaces                   | PascalCase                | `AppName.Core.Services`           |

---

## Enforcement

- All new code must follow these conventions
- When refactoring existing code, update naming to match these conventions
- Code reviews should verify adherence to these naming conventions
- Linters and formatters should be configured to enforce these rules where possible

---

## Notes

- These conventions apply to TypeScript/JavaScript code in this project
- When working with external libraries that use different conventions, maintain consistency within our codebase
- In cases where external APIs or database schemas use different naming, create adapter layers that translate between external conventions and our internal conventions
