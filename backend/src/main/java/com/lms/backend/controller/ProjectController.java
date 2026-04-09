package com.lms.backend.controller;

import com.lms.backend.model.Project;
import com.lms.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        // Find existing project
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        
        // We will just save the completely replaced project details in this simple implementation
        // This is safe because CascadeType.ALL will update the nested elements.
        projectDetails.setId(id);
        return projectRepository.save(projectDetails);
    }
}
