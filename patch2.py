with open('src/components/CertificateManagerCMS.tsx', 'r') as f:
    content = f.read()

old_code = '''      templateImageUrl: templateImage,
      mappingConfig: mapping,'''
new_code = '''      // DO NOT STORE templateImageUrl and mappingConfig to prevent LocalStorage QuotaExceededError
      // templateImageUrl: templateImage,
      // mappingConfig: mapping,'''

content = content.replace(old_code, new_code)

with open('src/components/CertificateManagerCMS.tsx', 'w') as f:
    f.write(content)
