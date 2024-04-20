package utils

import (
	"bytes"
	"mime/multipart"
	"regexp"
	"strings"
)

func UsernameValidation(username string) bool {
	if len(username) == 0 || len(username) > 15 {
		return false
	}
	for _, us := range username {
		if us < 'A' || us > 'Z' && us < 'a' || us > 'z' {
			return false
		}
	}
	return true
}

func EmailValidation(email string) bool {
	rx := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return rx.MatchString(email)
}

func PasswordValidation(password string) bool {
	if strings.TrimSpace(password) == "" {
		return false
	}
	return true
}

func ImageValidation(img multipart.File) bool {
	buf := make([]byte, 8)
	if _, err := img.Read(buf); err != nil {
		return false
	}
	if bytes.HasPrefix(buf, []byte("\xff\xd8")) || bytes.HasPrefix(buf, []byte("\x89\x50\x4e\x47")) || bytes.HasPrefix(buf, []byte("GIF89a")) || bytes.HasPrefix(buf, []byte("GIF87a")) || bytes.HasPrefix(buf, []byte("BM")) {
		return true
	}

	return false
}
