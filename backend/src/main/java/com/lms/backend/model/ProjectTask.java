package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ProjectTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String assignee;
    private String status;
    private String priority;
}
