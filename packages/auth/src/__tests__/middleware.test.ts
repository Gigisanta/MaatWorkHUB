import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { requireAppAccess } from '../middleware';
import { auth } from '../index';

// Mock the auth module
vi.mock('../index', () => ({
  auth: vi.fn(),
}));

// Mock NextRequest
const mockRequest = {
  url: 'http://localhost:3000/app/test-slug',
} as NextRequest;

// Mock NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: vi.fn((url: URL | string) => ({
        type: 'redirect',
        url: url.toString(),
      })),
      next: vi.fn(() => ({
        type: 'next',
      })),
    },
    NextRequest: vi.fn(),
  };
});

describe('requireAppAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login if there is no session', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const result = await requireAppAccess(mockRequest, 'test-slug');

    expect(auth).toHaveBeenCalledTimes(1);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/login' });
  });

  it('redirects to /login if there is no user in the session', async () => {
    // @ts-expect-error - Mocking incomplete session object
    vi.mocked(auth).mockResolvedValueOnce({});

    const result = await requireAppAccess(mockRequest, 'test-slug');

    expect(auth).toHaveBeenCalledTimes(1);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/login' });
  });

  it('allows access if the user has the founder role', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: '1',
        email: 'founder@example.com',
        role: 'founder',
        appId: 'test-slug',
      },
      expires: '9999-12-31T23:59:59.999Z',
    });

    const result = await requireAppAccess(mockRequest, 'test-slug');

    expect(auth).toHaveBeenCalledTimes(1);
    expect(NextResponse.next).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ type: 'next' });
  });

  it('redirects to /unauthorized if the user is not a founder and has no appId', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: '2',
        email: 'user@example.com',
        role: 'user',
        // @ts-expect-error - Testing missing appId
        appId: undefined,
      },
      expires: '9999-12-31T23:59:59.999Z',
    });

    const result = await requireAppAccess(mockRequest, 'test-slug');

    expect(auth).toHaveBeenCalledTimes(1);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/unauthorized', mockRequest.url));
    expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/unauthorized' });
  });

  it('allows access if the user is not a founder but has an appId', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: '3',
        email: 'user@example.com',
        role: 'user',
        appId: 'test-slug',
      },
      expires: '9999-12-31T23:59:59.999Z',
    });

    const result = await requireAppAccess(mockRequest, 'test-slug');

    expect(auth).toHaveBeenCalledTimes(1);
    expect(NextResponse.next).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ type: 'next' });
  });
});
