import re,sys
p=sys.argv[1]; pat=sys.argv[2]; w=int(sys.argv[3]) if len(sys.argv)>3 else 300; mx=int(sys.argv[4]) if len(sys.argv)>4 else 5
s=open(p,encoding='utf8').read()
s=re.sub(r'data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+','DATA',s)
for i,m in enumerate(re.finditer(pat,s)):
    if i>=mx: break
    print('@',m.start(),repr(s[max(0,m.start()-50):m.start()+w]));print()
