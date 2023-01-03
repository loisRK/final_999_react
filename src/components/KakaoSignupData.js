export const REST_API_KEY = "3bd21a86de934233cc9f3012709c304f";
// export const REDIRECT_URI = "http://175.41.229.233:3000/kakaoSignup";
export const REDIRECT_URI = "https://www.dulgi.net/kakaoSignup";
const code = new URL(window.location.href).searchParams.get("code");

// 카카오 인증 받기
export const KAKAO_SIGNUP_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
