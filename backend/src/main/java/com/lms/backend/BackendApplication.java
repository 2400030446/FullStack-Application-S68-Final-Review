package com.lms.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		String dbUrl = System.getenv("DATABASE_URL");
		if (dbUrl != null && dbUrl.startsWith("postgres://")) {
			try {
				java.net.URI dbUri = new java.net.URI(dbUrl);
				String username = dbUri.getUserInfo().split(":")[0];
				String password = dbUri.getUserInfo().split(":")[1];
				String dbUrlJdbc = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
				System.setProperty("spring.datasource.url", dbUrlJdbc);
				System.setProperty("spring.datasource.username", username);
				System.setProperty("spring.datasource.password", password);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		SpringApplication.run(BackendApplication.class, args);
	}

}
