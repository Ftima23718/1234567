package dz.univ.transcampus.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final int status;

    public BusinessException(String message) {
        super(message);
        this.status = 400;
    }

    public BusinessException(String message, int status) {
        super(message);
        this.status = status;
    }

    public static BusinessException notFound(String message) {
        return new BusinessException(message, 404);
    }

    public static BusinessException unauthorized(String message) {
        return new BusinessException(message, 401);
    }

    public static BusinessException forbidden(String message) {
        return new BusinessException(message, 403);
    }

    public static BusinessException conflict(String message) {
        return new BusinessException(message, 409);
    }
}
