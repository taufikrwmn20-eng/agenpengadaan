with open('src/data/certificateData.ts', 'r') as f:
    content = f.read()

content = content.replace(
'''  qrCode: {
    x: 82,
    y: 84,
    size: 140,
    colorDark: '#073B75',
    colorLight: '#ffffff'
  }
};''',
'''  qrCode: {
    x: 82,
    y: 84,
    size: 140,
    colorDark: '#073B75',
    colorLight: '#ffffff'
  },
  paperSize: 'auto'
};'''
)

with open('src/data/certificateData.ts', 'w') as f:
    f.write(content)
