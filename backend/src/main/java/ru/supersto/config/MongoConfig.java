package ru.supersto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import ru.supersto.entity.Appointment;
import ru.supersto.entity.ChatMessage;
import ru.supersto.entity.Notification;
import ru.supersto.entity.Order;
import ru.supersto.entity.Product;
import ru.supersto.entity.Review;
import ru.supersto.entity.Service;
import ru.supersto.entity.User;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "supersto_db";
    }

    @Bean
    public BeforeConvertCallback<User> userBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Service> serviceBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Product> productBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Appointment> appointmentBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Order> orderBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Review> reviewBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<ChatMessage> chatMessageBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }

    @Bean
    public BeforeConvertCallback<Notification> notificationBeforeConvertCallback() {
        return (entity, collection) -> {
            entity.prePersist();
            return entity;
        };
    }
}