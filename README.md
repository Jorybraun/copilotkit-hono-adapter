# CopilotKit Hono Adapter

Hono adapter for CopilotKit runtime - enables using CopilotKit's Built-in Agent with Hono web framework.

## Installation

```bash
npm install copilotkit-hono-adapter
```

## Usage

### Basic Setup

```typescript
import { Hono } from 'hono';
import { CopilotRuntime } from '@copilotkit/runtime';
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import { copilotRuntimeHonoEndpoint } from 'copilotkit-hono-adapter';

const app = new Hono();

// Setup agent
const agent = new BuiltInAgent({
  model: 'openai:gpt-4o-mini',
});

// Setup runtime
const runtime = new CopilotRuntime({
  agents: { default: agent },
});

// Add CopilotKit endpoint
app.post('/api/copilotkit', copilotRuntimeHonoEndpoint({
  runtime,
  endpoint: '/api/copilotkit',
}));

export default app;
```

### With Helper Function

```typescript
import { Hono } from 'hono';
import { CopilotRuntime } from '@copilotkit/runtime';
import { withCopilotKit } from 'copilotkit-hono-adapter';

const runtime = new CopilotRuntime({
  agents: { default: myAgent },
});

const app = withCopilotKit(new Hono(), {
  runtime,
  endpoint: '/api/copilotkit',
});
```

## Features

- ✅ Hono request/response transformation
- ✅ AG-UI protocol support
- ✅ TypeScript types
- ✅ Compatible with CopilotKit Built-in Agent
- ✅ Server tools support

## Status

This is an initial implementation. Full AG-UI protocol support is in progress.

## License

MIT
