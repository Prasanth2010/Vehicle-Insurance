package com.insurance.backend.controller;
// package com.insurance.controller;

// import com.insurance.entity.User;
// import com.insurance.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/admin/setup")
// @CrossOrigin(origins = "http://localhost:5173")
// public class AdminSetupController {

//     @Autowired
//     private UserRepository userRepository;
    
//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @PostMapping("/create-admin")
//     public String createInitialAdmin() {
//         if (userRepository.existsByEmail("admin@example.com")) {
//             return "Admin already exists!";
//         }
        
//         User admin = new User();
//         admin.setFirstName("Admin");
//         admin.setLastName("User");
//         admin.setEmail("admin@example.com");
//         admin.setPassword(passwordEncoder.encode("admin123"));  // Password: admin123
//         admin.setRole("ADMIN");
//         admin.setContactNo("9999999999");
//         admin.setAge(30);
//         admin.setCity("Chennai");
        
//         userRepository.save(admin);
//         return "Admin created successfully! Email: admin@example.com, Password: admin123";
//     }
// }