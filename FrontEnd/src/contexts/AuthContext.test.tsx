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

    let success = false;
    await act(async () => {
      success = await result.current.login('a@b.com', 'password1');
    });

    expect(success).toBe(true);
    expect(result.current.user).toEqual({ id: '1', email: 'a@b.com' });
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBe('tok');
  });

  it('login returns false and sets no user when the server rejects credentials', async () => {
    mockFetchOnce({ ok: false, json: async () => ({ error: 'Invalid credentials' }) });

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.login('a@b.com', 'wrong-password');
    });

    expect(success).toBe(false);
    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('debatelab_jwt_token')).toBeNull();
  });

  it('login returns false (not a thrown error) when the network call itself fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    const { result } = setup();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.login('a@b.com', 'password1');
    });

    expect(success).toBe(false);
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
