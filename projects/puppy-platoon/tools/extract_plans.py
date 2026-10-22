import json,sys
J,out=sys.argv[1],sys.argv[2]
labels={}
for l in open(J):
    d=json.loads(l)
    if d.get('type')=='started': labels[d['agentId']]=d.get('label','x')
    elif d.get('type')=='result':
        lab=labels.get(d.get('agentId'),'unknown').replace(':','_')
        r=d.get('result'); r=r if isinstance(r,str) else json.dumps(r)
        open(f'{out}/{lab}.md','w').write(r); print('saved',lab)
