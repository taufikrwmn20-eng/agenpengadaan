with open('src/data/certificateData.ts', 'r') as f:
    content = f.read()

old_code = '''        const canvas = document.createElement('canvas');
        const width = customWidth || img.naturalWidth || 1920;
        const height = customHeight || img.naturalHeight || 1080;
        canvas.width = width;
        canvas.height = height;'''

new_code = '''        const canvas = document.createElement('canvas');
        let width = customWidth || img.naturalWidth || 1920;
        let height = customHeight || img.naturalHeight || 1080;
        
        if (mapping.paperSize === 'A4') {
          width = 3508;
          height = 2480;
        } else if (mapping.paperSize === 'F4') {
          width = 3898;
          height = 2539;
        }
        
        canvas.width = width;
        canvas.height = height;'''

content = content.replace(old_code, new_code)

with open('src/data/certificateData.ts', 'w') as f:
    f.write(content)
