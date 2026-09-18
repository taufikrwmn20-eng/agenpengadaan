with open('src/components/CertificateManagerCMS.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Tambahkan</button>' in line:
        lines[i] = line + '              </div>\n'
        
with open('src/components/CertificateManagerCMS.tsx', 'w') as f:
    f.writelines(lines)
