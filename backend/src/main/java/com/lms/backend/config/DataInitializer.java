package com.lms.backend.config;

import com.lms.backend.model.*;
import com.lms.backend.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProjectRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Project p1 = new Project();
                p1.setTitle("Climate Change Research App");
                p1.setDescription("Build a web app visualizing global climate data and trends.");
                p1.setDeadline("2025-03-20");
                p1.setStatus("In Progress");
                p1.setMembers(Arrays.asList("Alice", "Bob", "Carol"));

                Milestone m1 = new Milestone(); m1.setTitle("Project Proposal"); m1.setDone(true);
                Milestone m2 = new Milestone(); m2.setTitle("Data Collection"); m2.setDone(true);
                Milestone m3 = new Milestone(); m3.setTitle("UI Design"); m3.setDone(false);
                Milestone m4 = new Milestone(); m4.setTitle("Final Submission"); m4.setDone(false);
                p1.setMilestones(Arrays.asList(m1, m2, m3, m4));

                ProjectTask t1 = new ProjectTask(); t1.setTitle("Set up React project"); t1.setAssignee("Alice"); t1.setStatus("Done"); t1.setPriority("High");
                ProjectTask t2 = new ProjectTask(); t2.setTitle("Fetch climate API data"); t2.setAssignee("Bob"); t2.setStatus("In Progress"); t2.setPriority("High");
                ProjectTask t3 = new ProjectTask(); t3.setTitle("Design dashboard layout"); t3.setAssignee("Carol"); t3.setStatus("Todo"); t3.setPriority("Medium");
                ProjectTask t4 = new ProjectTask(); t4.setTitle("Write unit tests"); t4.setAssignee("Alice"); t4.setStatus("Todo"); t4.setPriority("Low");
                p1.setTasks(Arrays.asList(t1, t2, t3, t4));

                p1.setSubmitted(false);
                repository.save(p1);

                Project p2 = new Project();
                p2.setTitle("E-Commerce Mobile UI");
                p2.setDescription("Design and prototype a mobile shopping experience with cart and checkout.");
                p2.setDeadline("2025-04-05");
                p2.setStatus("Planning");
                p2.setMembers(Arrays.asList("David", "Eve"));

                Milestone m2_1 = new Milestone(); m2_1.setTitle("Wireframes"); m2_1.setDone(true);
                Milestone m2_2 = new Milestone(); m2_2.setTitle("Prototype"); m2_2.setDone(false);
                Milestone m2_3 = new Milestone(); m2_3.setTitle("User Testing"); m2_3.setDone(false);
                Milestone m2_4 = new Milestone(); m2_4.setTitle("Final Submission"); m2_4.setDone(false);
                p2.setMilestones(Arrays.asList(m2_1, m2_2, m2_3, m2_4));

                ProjectTask t2_1 = new ProjectTask(); t2_1.setTitle("Create wireframes"); t2_1.setAssignee("David"); t2_1.setStatus("Done"); t2_1.setPriority("High");
                ProjectTask t2_2 = new ProjectTask(); t2_2.setTitle("Build prototype screens"); t2_2.setAssignee("Eve"); t2_2.setStatus("In Progress"); t2_2.setPriority("High");
                ProjectTask t2_3 = new ProjectTask(); t2_3.setTitle("User research survey"); t2_3.setAssignee("David"); t2_3.setStatus("Todo"); t2_3.setPriority("Medium");
                p2.setTasks(Arrays.asList(t2_1, t2_2, t2_3));
                p2.setSubmitted(false);

                repository.save(p2);

                Project p3 = new Project();
                p3.setTitle("AI Chatbot Assistant");
                p3.setDescription("Develop a simple chatbot that answers FAQs using keyword matching.");
                p3.setDeadline("2025-02-28");
                p3.setStatus("Submitted");
                p3.setMembers(Arrays.asList("Frank", "Grace"));

                Milestone m3_1 = new Milestone(); m3_1.setTitle("Requirements Analysis"); m3_1.setDone(true);
                Milestone m3_2 = new Milestone(); m3_2.setTitle("NLP Logic"); m3_2.setDone(true);
                Milestone m3_3 = new Milestone(); m3_3.setTitle("Integration"); m3_3.setDone(true);
                Milestone m3_4 = new Milestone(); m3_4.setTitle("Final Submission"); m3_4.setDone(true);
                p3.setMilestones(Arrays.asList(m3_1, m3_2, m3_3, m3_4));

                ProjectTask t3_1 = new ProjectTask(); t3_1.setTitle("Research NLP basics"); t3_1.setAssignee("Frank"); t3_1.setStatus("Done"); t3_1.setPriority("High");
                ProjectTask t3_2 = new ProjectTask(); t3_2.setTitle("Build keyword engine"); t3_2.setAssignee("Grace"); t3_2.setStatus("Done"); t3_2.setPriority("High");
                ProjectTask t3_3 = new ProjectTask(); t3_3.setTitle("Create UI"); t3_3.setAssignee("Frank"); t3_3.setStatus("Done"); t3_3.setPriority("Medium");
                p3.setTasks(Arrays.asList(t3_1, t3_2, t3_3));

                p3.setSubmitted(true);
                Submission sub = new Submission();
                sub.setFile("chatbot_final.zip");
                sub.setNote("All features implemented. Tested on Chrome and Firefox.");
                p3.setSubmission(sub);

                repository.save(p3);
            }
        };
    }
}
