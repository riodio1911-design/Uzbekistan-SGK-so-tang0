import json,sys,collections
R='/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad'
def walk(o,acc):
    if isinstance(o,dict):
        k=o.get('kind')
        if isinstance(k,str) and k.startswith(('sim.','ex.')): acc[k].append(o)
        for v in o.values(): walk(v,acc)
    elif isinstance(o,list):
        for v in o: walk(v,acc)
acc=collections.defaultdict(list)
for b in ['kimyo8','fizika8']: walk(json.load(open(f'{R}/books/{b}/book.json')),acc)
def C(k,f):
    c=collections.Counter()
    for o in acc[k]:
        p=o['params']
        if f in p:
            v=p[f]; c[json.dumps(v,ensure_ascii=False)]+=1
    return c
for k,f in [('sim.circuit','items'),('sim.circuit','layout'),('sim.circuit','labels'),('sim.circuit','volt'),('sim.circuit','read'),('sim.circuit','vread'),('sim.circuit','amm'),('sim.circuit','aread'),('sim.magnetic_field','type'),('sim.magnetic_field','current'),('sim.electrolysis','depColor'),('sim.electrolysis','color'),('sim.electrolysis','cat'),('sim.electrolysis','an'),('sim.chem_molecule_3d','mol'),('sim.electric_charges','q'),('sim.ionic_bond','a'),('sim.ionic_bond','b'),('sim.ionic_bond','n'),('sim.test_tube','result'),('sim.chem_reaction','cond')]:
    c=C(k,f); print('##',k,f,len(c)); 
    for v,n in c.most_common(40): print('   ',n,v[:150])
eqs=set(o['params']['eq'] for o in acc['sim.chem_reaction']); print(sorted(eqs))
