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

            try {
                // Ensure enabled column exists with default value
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BIT NOT NULL DEFAULT 1");

                // Only set enabled=1 for NULL values on non-FORMATEUR roles
                // Formateurs should remain disabled until approved by admin
                jdbcTemplate.execute(
                        "UPDATE users u " +
                                "JOIN roles r ON u.role_id = r.id " +
                                "SET u.enabled = 1 " +
                                "WHERE u.enabled IS NULL AND r.name != 'FORMATEUR'");

                System.out.println("Schema updated: users.enabled column is initialized (formateurs excluded).");
            } catch (Exception e) {
                System.err.println("Could not update users table: " + e.getMessage());
            }
        };
    }
}
