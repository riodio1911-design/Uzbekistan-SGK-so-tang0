import json,sys,collections
def walk(o,path,acc):
    if isinstance(o,dict):
        k=o.get('kind')
        if isinstance(k,str) and k.startswith(('sim.','ex.')):
            acc[k].append((path,o))
        for kk,v in o.items(): walk(v,path+'/'+kk,acc)
    elif isinstance(o,list):
        for i,v in enumerate(o): walk(v,path+'/'+str(i),acc)
for b in sys.argv[1:]:
    d=json.load(open(f'/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/books/{b}/book.json'))
    acc=collections.defaultdict(list); walk(d,'',acc)
    print('==',b, list(d.keys()))
    for k,v in sorted(acc.items(),key=lambda x:-len(x[1])):
        print(f'  {k:32} {len(v):5}  e.g. {v[0][0][:60]}')
