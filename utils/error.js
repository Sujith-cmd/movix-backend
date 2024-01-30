export const errorHandler = (statusCode, message) =>{
    const error= new Error();
    error.statuscode=statusCode;
    error.message=message;
    return error;
}
export const tkn=false