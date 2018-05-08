class RequestError extends Error {
    constructor(status=500, message=''){
        super(message);
        this.status = status;
    }
}

class NotFound extends RequestError {
    constructor(message='Not found'){
        super(404, message)
    }
}

class Conflict extends RequestError {
    constructor(message='already exists'){
        super(409, message)
    }
}

class BadRequest extends RequestError{
    constructor(message='WTF?'){
        super(400, message)
    }
}

class NotAllowed extends RequestError {
    constructor(message='you are not welcome here :/') {
        super(403, message)
    }
}

module.exports={
    BadRequest,
    NotAllowed,
    Conflict,
    NotFound
};