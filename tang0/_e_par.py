import json,sys,collections
R='/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad'
def walk(o,acc):
    if isinstance(o,dict):
        k=o.get('kind')
        if isinstance(k,str) and k.startswith(('sim.','ex.')): acc[k].append(o)
        for v in o.values(): walk(v,acc)
    elif isinstance(o,list):
        for v in o: walk(v,acc)
b=sys.argv[1]; kinds=sys.argv[2].split(','); n=int(sys.argv[3]) if len(sys.argv)>3 else 2
d=json.load(open(f'{R}/books/{b}/book.json')); acc=collections.defaultdict(list); walk(d,acc)
for k in kinds:
    L=acc[k]; keys=collections.Counter()
    for o in L: keys.update((o.get('params') or {}).keys())
    print('##',k,len(L),dict(keys))
    for o in L[:n]: print(json.dumps(o,ensure_ascii=False)[:1200])
