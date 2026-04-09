package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean done;
}
