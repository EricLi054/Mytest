import type { Span, Tracer } from "@opentelemetry/api";
import { vi } from "vitest";

export const mockTracer = (props: Partial<Tracer> = {}) =>
  ({
    startSpan: vi.fn().mockReturnValue(mockSpan()),
    startActiveSpan: vi.fn(),
    ...props,
  }) satisfies Tracer;

export const mockSpan = (props: Partial<Span> = {}) =>
  ({
    spanContext: vi.fn(),
    setAttribute: vi.fn(),
    setAttributes: vi.fn(),
    addEvent: vi.fn(),
    addLink: vi.fn(),
    addLinks: vi.fn(),
    setStatus: vi.fn(),
    updateName: vi.fn(),
    end: vi.fn(),
    isRecording: vi.fn(),
    recordException: vi.fn(),
    ...props,
  }) satisfies Span;
