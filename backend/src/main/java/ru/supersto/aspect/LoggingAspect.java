package ru.supersto.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.Arrays;

/**
 * Аспект для логирования выполнения методов
 */
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut для всех методов в пакетах service и controller
     */
    @Pointcut("execution(* ru.supersto.service..*(..)) || execution(* ru.supersto.controller..*(..))")
    public void applicationMethods() {
    }

    /**
     * Pointcut для всех публичных методов
     */
    @Pointcut("execution(public * *(..))")
    public void publicMethods() {
    }

    // Убрали логирование входа/выхода - слишком много мусора

    /**
     * Логирование исключений
     */
    @AfterThrowing(pointcut = "applicationMethods() && publicMethods()", throwing = "exception")
    public void logMethodException(JoinPoint joinPoint, Throwable exception) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        // Игнорируем повторяющиеся ошибки refresh token
        if (exception.getMessage() != null && exception.getMessage().contains("обновить токен")) {
            return;
        }

        log.warn("❌ {}.{}: {}", className, methodName, exception.getMessage());
    }

    /**
     * Измерение времени выполнения методов сервисов
     */
    @Around("execution(* ru.supersto.service..*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        try {
            Object result = joinPoint.proceed();
            stopWatch.stop();

            long executionTime = stopWatch.getTotalTimeMillis();
            if (executionTime > 1000) {
                log.warn("🐌 {}.{}: {} мс", className, methodName, executionTime);
            }

            return result;
        } catch (Throwable throwable) {
            stopWatch.stop();
            // Не логируем, уже логируется в logMethodException
            throw throwable;
        }
    }

    /**
     * Логирование HTTP запросов к контроллерам
     */
    @Around("execution(* ru.supersto.controller..*(..))")
    public Object logHttpRequests(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        try {
            Object result = joinPoint.proceed();
            stopWatch.stop();

            long time = stopWatch.getTotalTimeMillis();
            if (time > 500) {
                log.info("🌐 {}.{}: {} мс", className, methodName, time);
            }

            return result;
        } catch (Throwable throwable) {
            stopWatch.stop();
            // Не логируем, уже логируется в logMethodException
            throw throwable;
        }
    }
}