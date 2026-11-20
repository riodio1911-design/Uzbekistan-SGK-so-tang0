# Tách mã bản cũ: bỏ các khối dữ liệu lớn (window.PG, RUTXT, TP, AUDIO) để đọc mã engine.
import re,sys,json
src=open(sys.argv[1],encoding='utf-8').read()
out=sys.argv[2]
scripts=re.findall(r'<script[^>]*>(.*?)</script>',src,re.S)
styles=re.findall(r'<style[^>]*>(.*?)</style>',src,re.S)
body=re.sub(r'<script[^>]*>.*?</script>|<style[^>]*>.*?</style>','',src,flags=re.S)
with open(out+'/cu_body.html','w') as f: f.write(body)
with open(out+'/cu_style.css','w') as f: f.write('\n/*----*/\n'.join(styles))
info=[]
for i,s in enumerate(scripts):
    info.append((i,len(s),s[:120].replace('\n',' ')))
    t=s
    # cắt literal dữ liệu dài >2000 ký tự trên 1 dòng
    lines=[]
    for ln in t.split('\n'):
        if len(ln)>3000: ln=ln[:600]+' /*...CUT %d...*/ '%len(ln)+ln[-300:]
        lines.append(ln)
    open(out+'/cu_script_%02d.js'%i,'w').write('\n'.join(lines))
for x in info: print(x)
print('body',len(body),'style',sum(map(len,styles)))
