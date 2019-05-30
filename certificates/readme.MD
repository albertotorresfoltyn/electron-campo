While you can create a self-signed code-signing certificate (SPC - Software Publisher Certificate) in one go, I prefer to do the following:

Creating a self-signed certificate authority (CA)
makecert -r -pe -n "CN=Celltrak" -ss Celltrak -sr CurrentUser -a sha256 -cy authority -sky signature -sv MyCA.pvk MyCA.cer

This creates a self-signed (-r) certificate, with an exportable private key (-pe). It's named "My CA", and should be put in the CA store for the current user. We're using the SHA-256 algorithm. The key is meant for signing (-sky).

The private key should be stored in the MyCA.pvk file, and the certificate in the MyCA.cer file.

Importing the CA certificate
Because there's no point in having a CA certificate if you don't trust it, you'll need to import it into the Windows certificate store. You can use the Certificates MMC snapin, but from the command line:

certutil -user -addstore Root MyCA.cer
Creating a code-signing certificate (SPC)
makecert -pe -n "CN=CellTrak Technologies Inc." -a sha256 -cy end -sky signature -ic MyCA.cer -iv MyCA.pvk -sv MySPC.pvk MySPC.cer
It is pretty much the same as above, but we're providing an issuer key and certificate (the -ic and -iv switches).

We'll also want to convert the certificate and key into a PFX file:

pvk2pfx -pvk MySPC.pvk -spc MySPC.cer -pfx MySPC.pfx
If you want to protect the PFX file, add the -po switch, otherwise PVK2PFX creates a PFX file with no passphrase.

Using the certificate for signing code
signtool sign /v /f MySPC.pfx ^
              /t http://timestamp.url MyExecutable.exe
