import { CopilotRuntime } from '@copilotkit/runtime';
import type { Hono } from 'hono';
import type { Context, Env } from 'hono';

export interface CopilotRuntimeHonoOptions {
  runtime: CopilotRuntime;
  endpoint: string;
}

/**
 * Creates a Hono endpoint handler for CopilotKit runtime
 * 
 * @example
 * ```ts
 * import { CopilotRuntime } from '@copilotkit/runtime';
 * import { copilotRuntimeHonoEndpoint } from 'copilotkit-hono-adapter';
 * 
 * const runtime = new CopilotRuntime({ agents: { default: myAgent } });
 * 
 * app.post('/api/copilotkit', copilotRuntimeHonoEndpoint({
 *   runtime,
 *   endpoint: '/api/copilotkit',
 * }));
 * ```
 */
export function copilotRuntimeHonoEndpoint<E extends Env = any>(
  options: CopilotRuntimeHonoOptions
) {
  const { runtime, endpoint } = options;

  return async (c: Context<E>) => {
    try {
      const body = await c.req.json();
      
      // Transform Hono request to format expected by CopilotKit
      const request = {
        method: 'POST',
        headers: Object.fromEntries(c.req.header()),
        body: JSON.stringify(body),
      };

      // Process through CopilotKit runtime
      // Note: This is a simplified implementation
      // Full implementation would need to handle the AG-UI protocol properly
      const response = await runtime.processRequest(request, {
        endpoint,
      });

      // Return response in Hono format
      return c.json(response);
    } catch (error) {
      console.error('CopilotKit runtime error:', error);
      return c.json({ error: 'Runtime error', message: String(error) }, 500);
    }
  };
}

/**
 * Type-safe wrapper for Hono apps with CopilotKit
 * 
 * @example
 * ```ts
 * import { Hono } from 'hono';
 * import { withCopilotKit } from 'copilotkit-hono-adapter';
 * import { CopilotRuntime } from '@copilotkit/runtime';
 * 
 * const runtime = new CopilotRuntime({ agents: { default: myAgent } });
 * const app = withCopilotKit(new Hono(), { runtime, endpoint: '/api/copilotkit' });
 * ```
 */
export function withCopilotKit<E extends Env = any>(
  app: Hono<E>,
  options: CopilotRuntimeHonoOptions
): Hono<E> {
  const { endpoint } = options;
  
  app.post(endpoint, copilotRuntimeHonoEndpoint(options));
  
  return app;
}
