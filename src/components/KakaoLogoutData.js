export const REST_API_KEY = "3bd21a86de934233cc9f3012709c304f";
export const REDIRECT_URI = "http://175.41.229.233:3000/kakaoLogout";
export const REDIRECT_URI2 = "http://175.41.229.233:3000/kakaoWithdraw";

// 카카오 인증 받기
export const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${REDIRECT_URI}`;
export const KAKAO_LOGOUT_URL2 = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${REDIRECT_URI2}`;
