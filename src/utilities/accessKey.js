
const getAccessKey = () => {
    const session = localStorage.getItem("session");
    const key = `BEARER ${session}`;
    return key;
};

export default getAccessKey;