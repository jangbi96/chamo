export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()!.split(';').shift()!);
    }
    return null;
  }
  export function setCookie(
    name: string,
    value: string,
    options: {
      days?: number;
      maxAge?: number; // 초 단위
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    const {
      days,
      maxAge,
      path = '/',
      domain,
      secure = false,
      sameSite = 'Lax'
    } = options;
  
    let cookie = `${name}=${encodeURIComponent(value)}`;
  
    if (maxAge !== undefined) {
      cookie += `; Max-Age=${maxAge}`;
    } else if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookie += `; Expires=${date.toUTCString()}`;
    }
  
    cookie += `; Path=${path}`;
  
    if (domain) cookie += `; Domain=${domain}`;
    if (secure) cookie += `; Secure`;
    if (sameSite) cookie += `; SameSite=${sameSite}`;
  
    document.cookie = cookie;
  }

  export function clearAllCookies(): void {
    const cookies = document.cookie.split(';');
    const hostname = location.hostname;
  
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
  
      // 기본 삭제
      document.cookie = `${name}=; Max-Age=0; Path=/`;
  
      // 도메인 명시 삭제 시도
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${hostname}`;
    }
  }