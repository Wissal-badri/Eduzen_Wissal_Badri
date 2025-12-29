package com.eduzen.management.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Bean
    public CommandLineRunner fixSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Force planification_id to be nullable in the database
                jdbcTemplate.execute("ALTER TABLE inscriptions MODIFY planification_id BIGINT NULL");
                System.out.println("Schema updated: planification_id is now nullable.");
            } catch (Exception e) {
                System.err.println("Could not alter table inscriptions: " + e.getMessage());
            }
        };
    }
}
