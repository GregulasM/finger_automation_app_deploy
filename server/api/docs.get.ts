export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const appUrl = (config.public?.appUrl as string | undefined) ?? "";

  return {
    openapi: "3.0.3",
    info: {
      title: "Finger Automation API",
      version: "0.1.0",
    },
    servers: appUrl ? [{ url: appUrl }] : [],
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Register user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterPayload" },
              },
            },
          },
          responses: {
            "200": { description: "User registered" },
            "400": { description: "Validation error" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthCredentials" },
              },
            },
          },
          responses: {
            "200": { description: "Login success" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          summary: "Get current user",
          responses: {
            "200": { description: "User profile" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/auth/refresh": {
        post: {
          summary: "Refresh tokens",
          responses: {
            "200": { description: "Tokens refreshed" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "Logout user",
          responses: {
            "200": { description: "Logged out" },
          },
        },
      },
      "/api/auth/password/request": {
        post: {
          summary: "Request password reset",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmailPayload" },
              },
            },
          },
          responses: {
            "200": { description: "Reset email sent" },
          },
        },
      },
      "/api/auth/password/reset": {
        post: {
          summary: "Reset password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PasswordResetPayload" },
              },
            },
          },
          responses: {
            "200": { description: "Password reset" },
            "400": { description: "Validation error" },
          },
        },
      },
      "/api/hooks/{workflowId}": {
        post: {
          summary: "Trigger workflow by webhook",
          parameters: [
            {
              name: "workflowId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
              },
            },
          },
          responses: {
            "200": { description: "Workflow queued" },
            "404": { description: "Workflow not found" },
          },
        },
      },
      "/api/cron/run": {
        post: {
          summary: "Trigger cron workflows",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
              },
            },
          },
          responses: {
            "200": { description: "Workflows queued" },
          },
        },
      },
      "/api/workflows/execute": {
        post: {
          summary: "Execute workflow (QStash)",
          responses: {
            "200": { description: "Execution completed" },
            "401": { description: "Invalid signature" },
          },
        },
      },
      "/api/workflows": {
        get: {
          summary: "List workflows",
          responses: {
            "200": { description: "Workflows list" },
            "401": { description: "Unauthorized" },
          },
        },
        post: {
          summary: "Create workflow",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WorkflowPayload" },
              },
            },
          },
          responses: {
            "200": { description: "Workflow created" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/workflows/{id}": {
        get: {
          summary: "Get workflow",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Workflow details" },
            "404": { description: "Workflow not found" },
          },
        },
        put: {
          summary: "Update workflow",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WorkflowPayload" },
              },
            },
          },
          responses: {
            "200": { description: "Workflow updated" },
            "404": { description: "Workflow not found" },
          },
        },
      },
      "/api/workflows/{id}/executions": {
        get: {
          summary: "List workflow executions",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer" },
            },
          ],
          responses: {
            "200": { description: "Execution history" },
            "404": { description: "Workflow not found" },
          },
        },
      },
      "/api/workflows/{id}/stats": {
        get: {
          summary: "Get workflow stats",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Workflow stats" },
            "404": { description: "Workflow not found" },
          },
        },
      },
      "/api/email/inbound/{workflowId}": {
        post: {
          summary: "Trigger workflow by inbound email",
          parameters: [
            {
              name: "workflowId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Workflow queued" },
            "404": { description: "Workflow not found" },
          },
        },
      },
    },
    components: {
      schemas: {
        AuthCredentials: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
          required: ["email", "password"],
        },
        RegisterPayload: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
          required: ["name", "email", "password"],
        },
        EmailPayload: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
          },
          required: ["email"],
        },
        PasswordResetPayload: {
          type: "object",
          properties: {
            token: { type: "string" },
            password: { type: "string", minLength: 8 },
          },
          required: ["token", "password"],
        },
        WorkflowPayload: {
          type: "object",
          properties: {
            name: { type: "string" },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            triggerType: { type: "string", enum: ["WEBHOOK", "CRON", "EMAIL"] },
            graphData: {
              type: "object",
              properties: {
                nodes: { type: "array", items: {} },
                edges: { type: "array", items: {} },
              },
            },
          },
          required: ["name", "status", "triggerType", "graphData"],
        },
      },
    },
  };
});
