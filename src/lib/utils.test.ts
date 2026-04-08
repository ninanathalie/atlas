import { describe, it, expect } from "vitest";
import { formatBytes, isSafeUrl } from "./utils";

describe("formatBytes", () => {
 it("returns '0 B' for zero", () => {
  expect(formatBytes(0)).toBe("0 B");
 });

 it("returns '0 B' for negative values", () => {
  expect(formatBytes(-100)).toBe("0 B");
 });

 it("returns '0 B' for NaN", () => {
  expect(formatBytes(NaN)).toBe("0 B");
 });

 it("formats bytes correctly", () => {
  expect(formatBytes(500)).toBe("500 B");
  expect(formatBytes(1024)).toBe("1 KB");
  expect(formatBytes(1536)).toBe("1.5 KB");
  expect(formatBytes(1048576)).toBe("1 MB");
  expect(formatBytes(1073741824)).toBe("1 GB");
 });

 it("respects decimal precision", () => {
  expect(formatBytes(1536, 0)).toBe("2 KB");
  expect(formatBytes(1536, 2)).toBe("1.5 KB");
 });

 it("clamps to largest unit", () => {
  expect(formatBytes(1e15)).toContain("GB");
 });
});

describe("isSafeUrl", () => {
 it("allows http URLs", () => {
  expect(isSafeUrl("http://example.com")).toBe(true);
 });

 it("allows https URLs", () => {
  expect(isSafeUrl("https://example.com")).toBe(true);
 });

 it("rejects javascript: URLs", () => {
  expect(isSafeUrl("javascript:alert(1)")).toBe(false);
 });

 it("rejects data: URLs", () => {
  expect(isSafeUrl("data:text/html,<h1>hi</h1>")).toBe(false);
 });

 it("rejects invalid URLs", () => {
  expect(isSafeUrl("not-a-url")).toBe(false);
 });

 it("rejects empty strings", () => {
  expect(isSafeUrl("")).toBe(false);
 });
});
