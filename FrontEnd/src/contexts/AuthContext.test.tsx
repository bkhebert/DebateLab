import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

function mockFetchOnce(response: Partial<Response>) {
  global.fetch = jest.fn().mockResolvedValue(response as Response) as unknown as typeof fetch;
}

function setup() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

describe('AuthContext', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it('starts with no user when there is no stored token, without calling the network', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch;

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('login stores the token and user on success', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ accessToken: 'tok', user: { id: '1', email: 'a@b.com' } }),
    });

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.login('a@b.com', 'password1');
    });

    expect(outcome).toEqual({ success: true });
    expect(result.current.user).toEqual({ id: '1', email: 'a@b.com' });
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBe('tok');
  });

  it('login surfaces the real server error message when credentials are rejected', async () => {
    mockFetchOnce({ ok: false, json: async () => ({ error: 'Invalid credentials' }) });

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.login('a@b.com', 'wrong-password');
    });

    // The exact server-provided message must come through, not a generic
    // frontend guess - this is what the SignUp.tsx "Email may already
    // exist" bug got wrong (it showed that fixed string for every failure,
    // including ones that had nothing to do with a duplicate email).
    expect(outcome).toEqual({ success: false, error: 'Invalid credentials' });
    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBeNull();
  });

  it('login surfaces a network-failure message (not a misleading server-rejection message) when the request itself fails', async () => {
    // Simulates exactly what a CORS block looks like to the calling code:
    // fetch() rejects before any response is ever received.
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.login('a@b.com', 'password1');
    });

    expect(outcome.success).toBe(false);
    expect(outcome.error).toMatch(/unable to reach the server/i);
  });

  it('signup surfaces the real server error message on rejection (regression test for the "may already exist" bug)', async () => {
    // This is the actual bug report: Barry filled out SignUp.tsx with
    // genuinely fresh data and got "Failed to create account. Email may
    // already exist." - that hardcoded string showed for ANY failure, and
    // the real cause turned out to be a CORS misconfiguration having
    // nothing to do with duplicate emails. The fix makes signup() surface
    // whatever the server actually said.
    mockFetchOnce({ ok: false, json: async () => ({ error: 'Password must be at least 6 characters' }) });

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.signup('a@b.com', 'short', 'someone');
    });

    expect(outcome).toEqual({ success: false, error: 'Password must be at least 6 characters' });
    expect(result.current.user).toBeNull();
  });

  it('signup surfaces a network-failure message distinct from a server rejection', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.signup('a@b.com', 'password1', 'someone');
    });

    expect(outcome.success).toBe(false);
    expect(outcome.error).toMatch(/unable to reach the server/i);
    // Specifically must NOT be the old hardcoded guess about duplicate emails.
    expect(outcome.error).not.toMatch(/already exist/i);
  });

  it('an existing token is verified on mount and populates the user', async () => {
    sessionStorage.setItem('debatelab_jwt_token', 'existing-token');
    mockFetchOnce({ ok: true, json: async () => ({ user: { id: '1', email: 'a@b.com' } }) });

    const { result } = setup();

    await waitFor(() => expect(result.current.user).toEqual({ id: '1', email: 'a@b.com' }));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('an invalid stored token is discarded on mount', async () => {
    sessionStorage.setItem('debatelab_jwt_token', 'stale-token');
    mockFetchOnce({ ok: true, json: async () => ({}) });

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBeNull();
  });

  it('logout clears the stored token and user', async () => {
    sessionStorage.setItem('debatelab_jwt_token', 'existing-token');
    mockFetchOnce({ ok: true, json: async () => ({ user: { id: '1', email: 'a@b.com' } }) });

    const { result } = setup();
    await waitFor(() => expect(result.current.user).toEqual({ id: '1', email: 'a@b.com' }));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBeNull();
  });
});
