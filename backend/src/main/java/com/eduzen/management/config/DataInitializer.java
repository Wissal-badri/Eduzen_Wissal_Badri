package com.eduzen.management.config;

import com.eduzen.management.model.Role;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.RoleRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(RoleRepository roleRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Initialize Roles
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(new Role(null, "ADMIN"));
            }
            if (roleRepository.findByName("FORMATEUR").isEmpty()) {
                roleRepository.save(new Role(null, "FORMATEUR"));
            }
            if (roleRepository.findByName("ASSISTANT").isEmpty()) {
                roleRepository.save(new Role(null, "ASSISTANT"));
            }
            if (roleRepository.findByName("INDIVIDU").isEmpty()) {
                roleRepository.save(new Role(null, "INDIVIDU"));
            }

            // Initialize Admin User
            userRepository.findByUsername("admin").ifPresentOrElse(
                    admin -> {
                        boolean changed = false;
                        if (admin.getEnabled() == null || !admin.getEnabled()) {
                            admin.setEnabled(true);
                            changed = true;
                        }
                        if (admin.getProfileCompleted() == null || !admin.getProfileCompleted()) {
                            admin.setProfileCompleted(true);
                            changed = true;
                        }
                        if (changed)
                            userRepository.save(admin);
                    },
                    () -> {
                        System.out.println("... DataInitializer: Admin user not found. Creating...");
                        Role adminRole = roleRepository.findByName("ADMIN").get();
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setPassword(passwordEncoder.encode("admin"));
                        admin.setEmail("admin@eduzen.com");
                        admin.setRole(adminRole);
                        admin.setEnabled(true);
                        admin.setProfileCompleted(true);
                        userRepository.save(admin);
                        System.out.println("... DataInitializer: Admin user created successfully.");
                    });

            // Initialize Assistant User
            userRepository.findByUsername("assistant").ifPresentOrElse(
                    assistant -> {
                        boolean changed = false;
                        if (assistant.getEnabled() == null || !assistant.getEnabled()) {
                            assistant.setEnabled(true);
                            changed = true;
                        }
                        if (changed)
                            userRepository.save(assistant);
                    },
                    () -> {
                        System.out.println("... DataInitializer: Assistant user not found. Creating...");
                        Role assistantRole = roleRepository.findByName("ASSISTANT").get();
                        User assistant = new User();
                        assistant.setUsername("assistant");
                        assistant.setPassword(passwordEncoder.encode("assistant"));
                        assistant.setEmail("assistant@eduzen.com");
                        assistant.setRole(assistantRole);
                        assistant.setEnabled(true);
                        assistant.setProfileCompleted(true);
                        userRepository.save(assistant);
                        System.out.println("... DataInitializer: Assistant user created successfully.");
                    });
        };
    }
}
