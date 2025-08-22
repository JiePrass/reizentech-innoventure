package config

import (
	"os"

	"github.com/rpdg/vercel_blob"
)

var BlobClient *vercel_blob.VercelBlobClient

// custom token provider
type EnvTokenProvider struct{}

func (e *EnvTokenProvider) GetToken(method string, path string) (string, error) {
	return os.Getenv("VERCEL_BLOB_READ_WRITE_TOKEN"), nil
}

func InitBlob() {
	// kalau running DI LUAR vercel
	BlobClient = vercel_blob.NewVercelBlobClientExternal(&EnvTokenProvider{})

	// kalau running DI DALAM vercel
	// BlobClient = vercel_blob.NewVercelBlobClient()
}
