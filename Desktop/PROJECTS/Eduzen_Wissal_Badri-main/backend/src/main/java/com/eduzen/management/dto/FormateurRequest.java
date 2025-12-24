package com.eduzen.management.dto;

import lombok.Data;

@Data
public class FormateurRequest {
    private String username;
    private String password;
    private String email;
    private String competences;
    private String remarques;
}
