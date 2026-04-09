package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String deadline;
    private String status;

    @ElementCollection
    private List<String> members;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<Milestone> milestones;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<ProjectTask> tasks;

    private boolean submitted;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Submission submission;
}
