import jwt_decode from "jwt-decode";

const getDecodeSession = () => {
    const session = localStorage.getItem('session');
    const decodeSession = jwt_decode(session);
    return decodeSession;
};

export default getDecodeSession;