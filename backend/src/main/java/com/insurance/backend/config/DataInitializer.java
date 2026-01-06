package com.insurance.backend.config;

import com.insurance.backend.entity.Policy;
import com.insurance.backend.entity.User;
import com.insurance.backend.repository.PolicyRepository;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create Admin only if not exists
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setContactNo("9999999999");
            admin.setAge(30);
            admin.setGender("Male");
            admin.setStreet("Main Road");
            admin.setCity("Delhi");
            admin.setPincode("110001");
            userRepository.save(admin);
            System.out.println("Initial Admin created: admin@example.com / admin123");
        }

        // Create Sample Policies only if none exist
        if (policyRepository.count() == 0) {
            Policy p1 = new Policy();
            p1.setName("Vehicle Insurance Policy");
            p1.setDescription("Vehicle Insurance Policy - includes Bike, Car");
            p1.setPlan("Monthly");
            p1.setPremiumAmount(500.0);
            p1.setStatus("active");

            Policy p2 = new Policy();
            p2.setName("Comprehensive Protection");
            p2.setDescription("Full coverage for all vehicle types");
            p2.setPlan("Yearly");
            p2.setPremiumAmount(6000.0);
            p2.setStatus("active");

            policyRepository.save(p1);
            policyRepository.save(p2);
            System.out.println("2 Sample Policies created!");
        }
    }
}

/* package com.insurance.backend.config;

import com.insurance.backend.entity.Policy;
import com.insurance.backend.entity.User;
import com.insurance.backend.repository.PolicyRepository;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> DataInitializer running...");

        // Create Admin if not exists
        if (userRepository.count() == 0) {
            System.out.println(">>> Creating initial admin...");
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setContactNo("9999999999");
            admin.setAge(30);
            admin.setGender("Male");
            admin.setStreet("Main Road");
            admin.setCity("Delhi");
            admin.setPincode("110001");
            userRepository.save(admin);
            System.out.println(">>> ADMIN CREATED: admin@example.com / admin123");
        }

        // Create Sample Policies if none exist
        if (policyRepository.count() == 0) {
            System.out.println(">>> Creating sample policies...");

            Policy p1 = new Policy();
            p1.setName("Vehicle Insurance Policy");
            p1.setDescription("Vehicle Insurance Policy - includes Bike, Car");
            p1.setPlan("Monthly");
            p1.setPremiumAmount(500);

            Policy p2 = new Policy();
            p2.setName("Comprehensive Protection");
            p2.setDescription("Full coverage for all vehicle types");
            p2.setPlan("Yearly");
            p2.setPremiumAmount(6000);

            policyRepository.save(p1);
            policyRepository.save(p2);

            System.out.println(">>> 2 Sample Policies Created!");
        }
    }
} */