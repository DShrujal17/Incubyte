package com.incubyte.cardealership.common.exception;

import com.incubyte.cardealership.auth.exception.EmailAlreadyExistsException;
import com.incubyte.cardealership.common.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(
            EmailAlreadyExistsException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(
                        ex.getMessage(),
                        LocalDateTime.now()
                ));
    }
}