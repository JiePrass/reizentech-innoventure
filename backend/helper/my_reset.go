package helpers

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendTokenForgotEmail(toEmail string, token string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	subject := "Token Reset Password Anda"
	body := fmt.Sprintf("Berikut token reset password Anda: %s\nToken ini berlaku selama 1 jam.", token)

	msg := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\n\n%s", from, toEmail, subject, body)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, []byte(msg))
	if err != nil {
		return fmt.Errorf("gagal mengirim email: %w", err)
	}

	return nil
}
