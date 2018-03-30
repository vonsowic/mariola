class RequestError extends Error {
    constructor(status=500, message=''){
        super();
        this.status = status;
        this.message = message
    }
}

class NotFound extends RequestError {
    constructor(message='Not found'){
        super(404, message)
    }
}

module.exports={
    NotFound
};