package com.ratonblanco.backend.service;

import jakarta.mail.MessagingException;
//import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDate;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String name, String email) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Cuenta creada con éxito en Rústica");
        helper.setText("""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a7c59;">¡Cuenta creada con éxito!</h2>
            <p>Tu cuenta en Rústica ha sido creada con éxito.</p>
            <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nombre:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>E-mail:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                </tr>
            </table>
            <p>Gracias por elegirnos!</p>
            <p style="color: #888; font-size: 12px;">Rústica</p>
        </body>
        </html>
        """.formatted(name, email), true);
        mailSender.send(message);
    }



    public void sendReservationConfirmationEmail(String name, String email, String productName, LocalDate date) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Confirmación de reserva en Rústica");
        helper.setText("""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a7c59;">¡Reserva confirmada!</h2>
            <p>Hola <strong>%s</strong>,</p>
            <p>Tu reserva fue creada exitosamente.</p>
            <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Producto</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Fecha</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                </tr>
            </table>
            <p>Gracias por elegirnos!</p>
            <p style="color: #888; font-size: 12px;">Rústica</p>
        </body>
        </html>
        """.formatted(name, productName, date), true);

        mailSender.send(message);
    }
}