package com.pgms.service;

import com.pgms.service.UserContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserContextService userContextService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Sends a tenant password setup email and returns whether it was sent successfully.
     *
     * @return true if the email was sent, false otherwise
     */
    public boolean sendPasswordSetupEmail(String toEmail, String signupToken, String tenantName) {
        try {
            String setupLink = frontendUrl + "/signup/" + signupToken;
            
            // Get hostel name
            String hostelName = "PG Management";
            try {
                hostelName = userContextService.getCurrentUserHostel().getName();
            } catch (Exception e) {
                System.out.println("Could not get hostel name, using default: " + e.getMessage());
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setSubject("Welcome to " + hostelName + " - Set Your Password");
            message.setText("Dear " + tenantName + ",\n\n" +
                    "You have been allocated a room in " + hostelName + ".\n" +
                    "Please set your password by clicking the link below:\n" +
                    setupLink + "\n\n" +
                    "This is a password setup link (not a signup link).\n" +
                    "This link will expire in 7 days.\n\n" +
                    "Best regards,\n" +
                    hostelName + " Team");

            mailSender.send(message);

            System.out.println("=== EMAIL SENT SUCCESSFULLY ===");
            System.out.println("To: " + toEmail);
            System.out.println("Subject: Welcome to PG Management - Set Your Password");
            System.out.println("Password Setup Link: " + setupLink);
            System.out.println("=============================");
            return true;
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
