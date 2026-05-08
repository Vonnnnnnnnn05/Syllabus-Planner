import zipfile
import xml.etree.ElementTree as ET

docx_path = r'c:\xampp\htdocs\syllabus-planner\IPT2 - Syllabus.docx'
with zipfile.ZipFile(docx_path) as z:
    xml = z.read('word/document.xml')

root = ET.fromstring(xml)
W_P = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'
W_T = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'

for paragraph in root.iter(W_P):
    text = ''.join(t.text or '' for t in paragraph.iter(W_T))
    if text.strip():
        print(text)
    else:
        print()
