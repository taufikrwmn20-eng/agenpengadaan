with open('src/components/CertificateManagerCMS.tsx', 'r') as f:
    content = f.read()

content = content.replace('setHistoryFilterEvent(eventName);', "setHistoryFilterEvent(eventName || 'Kegiatan APN');")

with open('src/components/CertificateManagerCMS.tsx', 'w') as f:
    f.write(content)
