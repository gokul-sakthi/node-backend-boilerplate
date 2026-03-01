## Architecture overview
This boilerplate implements strict Clean Architecture with a migration-first mindset. The core domain (`src/core`) is framework-agnostic and has no imports from Node built-ins, SDKs, env, or infrastructure libraries. Every external concern is expressed as a port interface and implemented via adapters. Runtime concerns are assembled only in composition root.

Directory responsibilities:
- `src/core/entities`: domain entities and value objects.
- `src/core/usecases`: business orchestration with injected ports.
- `src/core/ports`: contracts for all external dependencies.
- `src/core/errors`: domain-level errors.
- `src/adapters/db`: repository adapters (Postgres, Mongo, in-memory).
- `src/adapters/http`: logging adapters used by HTTP/runtime edge.
- `src/adapters/cache`: cache implementations.
- `src/adapters/queue`: event bus implementations.
- `src/adapters/storage`: file storage implementations.
- `src/adapters/external`: third-party service adapters (payments, email).
- `src/interfaces/http`: HTTP framework controllers and routes.
- `src/interfaces/cli`: command-line entry interfaces.
- `src/interfaces/jobs`: background job interfaces.
- `src/config`: validated typed configuration.
- `src/composition`: dependency wiring and app assembly.
- `src/runtime`: process entrypoints.
- `tests`: unit, adapter, and full-system tests.

## Dependency flow diagram (ASCII)
```text
core (entities/usecases/errors)
  ↓ depends on
ports (interfaces)
  ↓ implemented by
adapters (db/http/cache/queue/storage/external)
  ↓ used by
interfaces (http/cli/jobs)
  ↓ bootstrapped by
runtime + composition root
```

## Folder tree
```text
src/
  core/
    entities/
    usecases/
    ports/
    errors/
  adapters/
    db/
    http/
    cache/
    queue/
    storage/
    external/
  interfaces/
    http/
    cli/
    jobs/
  config/
  composition/
  runtime/
tests/
```

## Core code
See:
- `src/core/entities/User.ts`
- `src/core/usecases/RegisterUserUseCase.ts`
- `src/core/ports/*`
- `src/core/errors/DomainError.ts`

## Ports
Required ports are implemented as interfaces:
- `UserRepository`
- `PaymentGateway`
- `EmailService`
- `CacheStore`
- `FileStorage`
- `EventBus`
- `Logger`

## Adapters
Each required port has real/mock/test implementations:
- UserRepository: `PostgresUserRepository`, `MongoUserRepository`, `InMemoryUserRepository`
- PaymentGateway: `StripePaymentGateway`, `MockPaymentGateway`, `TestPaymentGateway`
- EmailService: `SmtpEmailService`, `MockEmailService`, `TestEmailService`
- CacheStore: `MemoryCacheStore`, `MockCacheStore`, `TestCacheStore`
- FileStorage: `LocalFileStorage`, `MockFileStorage`, `TestFileStorage`
- EventBus: `InMemoryEventBus`, `MockEventBus`, `TestEventBus`
- Logger: `PinoLikeLogger`, `MockLogger`, `TestLogger`

## Composition root
`src/composition/root.ts` is the only assembly module. It:
- loads adapter implementations based on typed config
- wires use cases
- builds Fastify app
- returns runtime controls (`start`, `stop`)

No business rules exist there.

## HTTP example
`src/interfaces/http/UserController.ts` handles:
- request parsing
- Zod validation
- use case invocation
- HTTP response mapping

Swapping Fastify to Express is isolated to `src/interfaces/http` and composition bootstrapping.

## Tests
- Unit test (pure core + test doubles): `tests/register-user.usecase.test.ts`
- Adapter test (real PostgreSQL dialect via pg-mem): `tests/postgres-user-repository.adapter.test.ts`
- Full system test (HTTP route through composition): `tests/system.http.test.ts`

## Config system
`src/config/env.ts` validates environment with Zod and exports strongly typed `AppConfig`. Invalid config fails startup immediately.

## Adapter swap demo
### How to replace payment provider in 5 minutes
1. Add new adapter implementing `PaymentGateway` in `src/adapters/external`.
2. Keep method signature `authorizeInitialCredit` unchanged.
3. Update provider selection in `src/composition/root.ts`.
4. Add adapter-focused test.
5. Restart app. Core and use cases remain untouched.

## Run instructions
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start compiled: `npm run start`
- Test: `npm test`
- Lint: `npm run lint`
- Docker: use Node LTS base image and run `npm run build && npm run start`.

Portability notes:
- Cloud portability: no cloud SDK in core.
- DB portability: switch Postgres/Mongo via config and adapter wiring.
- HTTP portability: controller logic isolated from framework bootstrapping.
- Runtime portability: can run on local Node, containers, or serverless wrapper around composition output.
