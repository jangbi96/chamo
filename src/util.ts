// 인코딩 함수
export function base64UrlEncode(str: string) {
    const b64 = btoa(
        new TextEncoder()
            .encode(str)
            .reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
    );
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// 디코딩 함수

export function safeBase64Decode(b64url: string) {
  try {
    const b64 = b64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(b64url.length / 4) * 4, '=');

    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    console.error('디코딩 에러:', e);
    return null;
  }
}

export function safeBase64Encode(str: string): string {
    try {
      // 1. 문자열 → UTF-8 바이트 배열
      const bytes = new TextEncoder().encode(str);
  
      // 2. 바이트 배열 → binary string
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
  
      // 3. binary → base64
      const b64 = btoa(binary);
  
      // 4. base64 → base64url 변환 (URL-safe)
      return b64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
    } catch (e) {
      console.error('인코딩 에러:', e);
      return '';
    }
  }

// 숫자 콤마 넣는 함수
export function addComma(num: string | number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? ''
}

// 쿼리스트링으로 바꾸는 함수
export function toQueryString(obj: Record<string, any>): string {
    const params = new URLSearchParams()
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, String(obj[key]))
        }
    }
    return params.toString()
}


/** 
 * @deprecated 비디오 url
 */
// const videoUrls = [
//     'https://img.lightning.ai.kr/introduction1_t1.mp4',
//     'https://img.lightning.ai.kr/introduction2_t1.mp4',
//     'https://img.lightning.ai.kr/introduction3_t1.mp4',
// ]
// const videoUrls2 = [
//     'https://img.lightning.ai.kr/introduction1_t2.mp4',
//     'https://img.lightning.ai.kr/introduction2_t2.mp4',
//     'https://img.lightning.ai.kr/introduction3_t2.mp4',
// ]