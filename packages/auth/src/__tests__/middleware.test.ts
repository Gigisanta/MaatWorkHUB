import { requireAppAccess, requireFounder } from "../middleware";
import { auth } from "../index";
import { NextResponse } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../index", () => ({
  auth: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ status: 307, url: url.toString(), type: "redirect" })),
    next: vi.fn(() => ({ status: 200, type: "next" })),
  },
}));

describe("middleware functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReq = {
    url: "http://localhost/test",
  } as any;

  describe("requireAppAccess", () => {
    it("should redirect to /login if no session exists", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      await requireAppAccess(mockReq, "test-app");

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", mockReq.url));
    });

    it("should allow next if user is a founder", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: "founder" } as any,
      } as any);

      await requireAppAccess(mockReq, "test-app");

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it("should redirect to /unauthorized if user has no appId", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: "user", appId: undefined } as any,
      } as any);

      await requireAppAccess(mockReq, "test-app");

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/unauthorized", mockReq.url));
    });

    it("should allow next if user has an appId", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: "user", appId: "some-app-id" } as any,
      } as any);

      await requireAppAccess(mockReq, "test-app");

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe("requireFounder", () => {
    it("should redirect to /login if no session exists", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      await requireFounder(mockReq);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", mockReq.url));
    });

    it("should redirect to /login if user is not a founder", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: "user" } as any,
      } as any);

      await requireFounder(mockReq);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", mockReq.url));
    });

    it("should allow next if user is a founder", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: "founder" } as any,
      } as any);

      await requireFounder(mockReq);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });
});
