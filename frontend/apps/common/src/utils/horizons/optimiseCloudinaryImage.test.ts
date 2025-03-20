import { describe, expect, it } from "vitest";

import { optimiseCloudinaryImage } from "./optimiseCloudinaryImage";

describe("optimiseCloudinaryImage", () => {
  it("should add f_auto if missing", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    const output = optimiseCloudinaryImage(input);

    expect(output).toBe("https://res.cloudinary.com/demo/image/upload/f_auto/q_auto:eco/sample.jpg");
  });

  it("should not add f_auto if already present", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/f_auto/sample.jpg";
    const output = optimiseCloudinaryImage(input);

    expect(output).toBe("https://res.cloudinary.com/demo/image/upload/f_auto/q_auto:eco/sample.jpg");
  });

  it("should replace existing q_auto with q_auto:eco", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/f_auto/q_auto/sample.jpg";
    const output = optimiseCloudinaryImage(input);

    expect(output).toBe("https://res.cloudinary.com/demo/image/upload/f_auto/q_auto:eco/sample.jpg");
  });

  it("should not modify the URL if q_auto:eco is already present", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/f_auto/q_auto:eco/sample.jpg";
    const output = optimiseCloudinaryImage(input);

    expect(output).toBe(input);
  });

  it("should correctly add f_auto and q_auto:eco if both are missing", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg";
    const output = optimiseCloudinaryImage(input);

    expect(output).toBe("https://res.cloudinary.com/demo/image/upload/f_auto/q_auto:eco/v12345/sample.jpg");
  });
});
