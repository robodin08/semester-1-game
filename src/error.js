export default function createError (status, message, data) {
    const error = new Error(message);
    error.status = status;
    error.data = data;
    return error;
}