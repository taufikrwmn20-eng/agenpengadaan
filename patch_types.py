with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
'''export interface CertificateMappingConfig {
  recipientName: CertificateElementMapping;
  certificateNumber: CertificateElementMapping;
  eventName: CertificateElementMapping;
  issueDate: CertificateElementMapping;
  qrCode: CertificateQrMapping;
}''',
'''export interface CertificateMappingConfig {
  recipientName: CertificateElementMapping;
  certificateNumber: CertificateElementMapping;
  eventName: CertificateElementMapping;
  issueDate: CertificateElementMapping;
  qrCode: CertificateQrMapping;
  paperSize?: 'auto' | 'A4' | 'F4';
}'''
)

with open('src/types.ts', 'w') as f:
    f.write(content)
