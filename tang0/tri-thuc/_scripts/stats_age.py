import json,re,statistics as st,collections,sys
def sents(t):
  t=re.sub(r'\*\*','',t); t=re.sub(r'\{(\d+)/(\d+)\}',r'\1/\2',t)
  return [x for x in re.split(r'(?<=[.!?…])\s+',t.strip()) if len(x.split())>=2]
def stat(texts):
  S=[s for t in texts if isinstance(t,str) and t for s in sents(t)]
  if not S: return None
  w=[len(s.split()) for s in S]
  return dict(n=len(S),mean=round(st.mean(w),1),med=st.median(w),p90=sorted(w)[int(.9*len(w))])
def walk_strings(o,acc,lang):
  if isinstance(o,dict):
    if lang in o and isinstance(o[lang],str) and ('uz' in o): acc.append(o[lang])
    for v in o.values(): walk_strings(v,acc,lang)
  elif isinstance(o,list):
    for v in o: walk_strings(v,acc,lang)
R={}
for k in ['matematika5','informatika5','kimyo8','fizika8']:
  d=json.load(open(k+'.json'))
  TP=d['window.TP']
  for lang in ['uz','vi']:
    tr=[x['t'].get(lang,'') for v in d['window.PG'].values() for x in (v.get('tr') or [])]
    nar=[sc['n'].get(lang,'') for t in TP.values() for sc in (t.get('video') or []) if isinstance(sc.get('n'),dict)]
    qz=[q['q'].get(lang,'') for t in TP.values() for q in (t.get('quiz') or []) if isinstance(q.get('q'),dict)]
    nopt=[len(q['a']) for t in TP.values() for q in (t.get('quiz') or [])]
    R[(k,lang)]=dict(tr=stat(tr),narr=stat(nar),quizq=stat(qz),opts=dict(collections.Counter(nopt)))
for k in ['tabiiy5','biologiya5']:
  B=json.load(open(k+'.json'))['window.BOOK']
  for lang in ['uz','vi']:
    learn=[];qz=[];nopt=[];th=[]
    for l in B['lessons']:
      for b in l['blocks']:
        if b['type']=='learn': walk_strings(b.get('paras',[]),learn,lang)
        if b['type'] in('think','questions'): walk_strings(b,th,lang)
        if b['type']=='quiz':
          for q in b['qs']:
            if isinstance(q.get('q'),dict): qz.append(q['q'].get(lang,'')); nopt.append(len(q['a']))
    V=json.load(open(k+'.json'))['window.VIDEOS']
    R[(k,lang)]=dict(learn=stat(learn),cauhoi=stat(th),quizq=stat(qz),opts=dict(collections.Counter(nopt)))
A=json.load(open('adabiyot5.json'))['DATA']
for lang in ['uz','vi']:
  pr=[];tk=[];po=[];qz=[];nopt=[]
  for u in A['units']:
    for b in u['blocks']:
      if b['t']=='prose': walk_strings(b.get('paras',[]),pr,lang)
      if b['t'] in('talk','task','think','pre'): walk_strings({k2:v for k2,v in b.items() if k2 in('qs','paras','title')},tk,lang)
      if b['t']=='quiz':
        for q in b.get('qs',[]):
          if isinstance(q,dict) and isinstance(q.get('q'),dict): qz.append(q['q'].get(lang,'')); nopt.append(len(q.get('a') or q.get('o') or []))
  R[('adabiyot5',lang)]=dict(prose=stat(pr),cauhoi=stat(tk),quizq=stat(qz),opts=dict(collections.Counter(nopt)))
for k,v in R.items(): print(k,json.dumps(v,ensure_ascii=False))
json.dump({f'{a}|{b}':v for (a,b),v in R.items()},open('../_dump/age_stats.json','w'),ensure_ascii=False,indent=1)
