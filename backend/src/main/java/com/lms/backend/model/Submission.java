package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String file;
    @Column(length = 1000)
    private String note;
    private String grade;
}
