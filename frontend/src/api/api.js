
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL.replace(/\/$/, '')}/api/v1`;

export const authenticationEndpoints = {
    LOGIN_API: `${API_BASE}/authentication/login`,
    SIGNUP_API: `${API_BASE}/authentication/signin`,
    SEND_OTP_API: `${API_BASE}/authentication/sendOtp`,
    RESETPASSWORD_API: `${API_BASE}/authentication/resetPassword`,
    RESETPASSTOKEN_API: `${API_BASE}/authentication/resetPasswordToken`,
    UPDATE_PROFILE_API: `${API_BASE}/authentication/updateProfile`,
};


export const questionEndpoint = {
    ADD_QUESTION_API: `${API_BASE}/question/addQuestions`,
};
