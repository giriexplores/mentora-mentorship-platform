/**
 * OpenAPI / Swagger document for the Mentora REST API.
 * Describes all public endpoints, security schemes, reusable schemas,
 * and expected request/response shapes.
 */
import { OpenAPIV3 } from "openapi-types";
import { NODE_ENV } from "./env";

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

// ── Reusable response shapes ──────────────────────────────────────────────────

const errorResponse = (description: string): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
    },
  },
});

const validationErrorResponse: OpenAPIV3.ResponseObject = {
  description: "Validation error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "array", items: { type: "string" } },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

// ── Schemas ───────────────────────────────────────────────────────────────────

const PublicUser: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", nullable: true },
    email: { type: "string", format: "email" },
    role: { type: "string", enum: ["parent", "mentor", "student"] },
    parentId: { type: "string", format: "uuid", nullable: true },
    createdAt: { type: "string", format: "date-time", nullable: true },
  },
};

const Lesson: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { type: "string", nullable: true },
    mentorId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time", nullable: true },
  },
};

const Booking: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    studentId: { type: "string", format: "uuid" },
    lessonId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time", nullable: true },
  },
};

const Session: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    lessonId: { type: "string", format: "uuid" },
    date: { type: "string", format: "date-time" },
    topic: { type: "string" },
    summary: { type: "string" },
    createdAt: { type: "string", format: "date-time", nullable: true },
  },
};

// ── Full OpenAPI document ─────────────────────────────────────────────────────

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Mentora API",
    version: "1.0.0",
    description:
      "REST API for a mentorship platform connecting parents, mentors, and students.",
  },
  components: {
    securitySchemes: { bearerAuth },
    schemas: { PublicUser, Lesson, Booking, Session },
  },
  paths: {
    // ── Auth ──────────────────────────────────────────────────────────────────
    "/api/v1/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register as parent or mentor, Students can't be registered directly via this route",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "confirmPassword", "role"],
                properties: {
                  email: { type: "string", format: "email", example: "user@example.com" },
                  password: { type: "string", minLength: 6, example: "secret123" },
                  confirmPassword: { type: "string", minLength: 6, example: "secret123" },
                  role: { type: "string", enum: ["parent", "mentor"] },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/PublicUser" },
                        token: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "409": errorResponse("Email already in use"),
        },
      },
    },

    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "user@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        token: { type: "string" },
                        user: { $ref: "#/components/schemas/PublicUser" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": errorResponse("Invalid email or password"),
        },
      },
    },

    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { user: { $ref: "#/components/schemas/PublicUser" } },
                    },
                  },
                },
              },
            },
          },
          "401": errorResponse("Unauthorized"),
          "404": errorResponse("User not found"),
        },
      },
    },

    // ── Students ──────────────────────────────────────────────────────────────
    "/api/v1/students": {
      post: {
        tags: ["Students"],
        summary: "Create a student under the authenticated parent",
        description: "Parents can create student profiles for their children. Passwords are securely hashed during creation and cannot be viewed or retrieved afterward.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Alice" },
                  email: { type: "string", format: "email", example: "alice@school.com" },
                  password: { type: "string", minLength: 6, example: "student123" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Student created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { student: { $ref: "#/components/schemas/PublicUser" } },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": errorResponse("Unauthorized"),
          "403": errorResponse("Forbidden: insufficient permissions"),
          "409": errorResponse("Email already in use"),
        },
      },
      get: {
        tags: ["Students"],
        summary: "List all students belonging to the authenticated parent",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of students",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        students: {
                          type: "array",
                          items: { $ref: "#/components/schemas/PublicUser" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": errorResponse("Unauthorized"),
          "403": errorResponse("Forbidden: insufficient permissions"),
        },
      },
    },

    // ── Lessons ───────────────────────────────────────────────────────────────
    "/api/v1/lessons": {
      post: {
        tags: ["Lessons"],
        summary: "Create a lesson (mentor only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Introduction to Algebra" },
                  description: {
                    type: "string",
                    example: "Covers basic algebraic expressions",
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Lesson created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { lesson: { $ref: "#/components/schemas/Lesson" } },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": errorResponse("Unauthorized"),
          "403": errorResponse("Forbidden: insufficient permissions"),
        },
      },
    },

    "/api/v1/lessons/{id}/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "Get all sessions for a lesson",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Lesson ID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "List of sessions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        sessions: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Session" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": errorResponse("Unauthorized"),
        },
      },
    },

    // ── Bookings ──────────────────────────────────────────────────────────────
    "/api/v1/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Book a lesson for a student (parent only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["studentId", "lessonId"],
                properties: {
                  studentId: { type: "string", format: "uuid" },
                  lessonId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Booking created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { booking: { $ref: "#/components/schemas/Booking" } },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": errorResponse("Unauthorized"),
          "403": errorResponse("Student not found or does not belong to you"),
          "404": errorResponse("Lesson not found"),
        },
      },
    },

    // ── Sessions ──────────────────────────────────────────────────────────────
    "/api/v1/sessions": {
      post: {
        tags: ["Sessions"],
        summary: "Create a session for a lesson (mentor only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["lessonId", "date", "topic", "summary"],
                properties: {
                  lessonId: { type: "string", format: "uuid" },
                  date: {
                    type: "string",
                    format: "date-time",
                    description: "ISO 8601 UTC date-time string (e.g. 2026-03-15T10:00:00.000Z)",
                    example: "2026-03-15T10:00:00.000Z",
                  },
                  topic: { type: "string", example: "Variables and Expressions" },
                  summary: {
                    type: "string",
                    example: "Covered variables, constants and basic expressions.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { session: { $ref: "#/components/schemas/Session" } },
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": errorResponse("Unauthorized"),
          "403": errorResponse("Forbidden: insufficient permissions"),
        },
      },
    },

    // ── LLM ───────────────────────────────────────────────────────────────────
    "/api/v1/llm/summarize": {
      post: {
        tags: ["LLM"],
        summary: "Summarize text using Google Gemini (10 req/min per IP)",
        description: "Sends plain text to Google Gemini and returns a 3–6 bullet-point summary. No authentication required. Rate-limited to 10 requests per minute per IP address.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["text"],
                properties: {
                  text: {
                    type: "string",
                    minLength: 50,
                    maxLength: 10000,
                    example:
                      "Artificial intelligence is transforming industries worldwide...",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Summarized bullet points",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        summary: { type: "string" },
                        model: { type: "string", example: "gemini-3-flash-preview" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": errorResponse("text is required / too short"),
          "413": errorResponse("text exceeds maximum length of 10000 characters"),
          "429": errorResponse("Too many requests. Please try again after 1 minute."),
          "500": errorResponse("Failed to generate summary (LLM service error)"),
        },
      },
    },
  },
};

export default swaggerDocument;
