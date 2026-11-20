export const virtualFiles={'/__qa/firebase.js':"\nconst user={uid:'qa',email:'qa@example.test'},callbacks=[],listeners=[];\nlet data={items:[{nome:'Produto QA',cat:'Papelaria',qtd:10,min:2},{nome:'Critico QA',cat:'Papelaria',qtd:1,min:3},{nome:'Zerado QA',cat:'Producao',qtd:0,min:2}],hist:[],extraCats:[]};\nwindow.__qaWrites=[];window.__qaData=()=>structuredClone(data);\nconst snapshot=()=>({exists:()=>true,data:()=>structuredClone(data)});\nexport const initializeApp=()=>({});\nexport const getAuth=()=>({});\nexport const getFirestore=()=>({});\nexport const doc=(...args)=>args;\nexport const getDoc=async()=>snapshot();\nexport const setDoc=async(ref,value)=>{data=structuredClone(value);window.__qaWrites.push(structuredClone(value));for(const cb of listeners)cb(snapshot());};\nexport const onSnapshot=(ref,cb)=>{listeners.push(cb);cb(snapshot());return()=>{};};\nexport const onAuthStateChanged=(auth,cb)=>{callbacks.push(cb);cb(null);};\nexport const signInWithEmailAndPassword=async(auth,email,password)=>{\n if(email!==user.email||password!=='SenhaQA123!')throw Object.assign(Error('invalid'),{code:'auth/invalid-credential'});\n await Promise.all(callbacks.map(cb=>cb(user)));return {user};\n};\nexport const signOut=async()=>{await Promise.all(callbacks.map(cb=>cb(null)));};\n"};
// Histórico determinístico somente no modo QA de datas, antes de qualquer leitura do adaptador.
virtualFiles['/__qa/firebase.js']=virtualFiles['/__qa/firebase.js'].replace('window.__qaWrites=[];',`
if(new URLSearchParams(location.search).get('qaHistory')==='dates'){
 data.hist=[
  {tipo:'saida',nome:'Zerado QA',cat:'Producao',qtd:1,motivo:'Fevereiro QA',data:'01/02/2026'},
  {tipo:'entrada',nome:'Produto QA',cat:'Papelaria',qtd:4,motivo:'Fim janeiro QA',data:'31/01/2026'},
  {tipo:'saida',nome:'Produto QA',cat:'Papelaria',qtd:1,motivo:'Meio janeiro QA',data:'15/01/2026'},
  {tipo:'entrada',nome:'Critico QA',cat:'Papelaria',qtd:2,motivo:'Inicio janeiro QA',data:'01/01/2026'},
  {tipo:'saida',nome:'Produto QA',cat:'Papelaria',qtd:1,motivo:'Ano anterior QA',data:'31/12/2025'},
  {tipo:'entrada',nome:'Produto QA',cat:'Papelaria',qtd:1,motivo:'Legado QA',data:'Sem data'}
 ];
}
window.__qaWrites=[];`);
export function transform(text,path){
 if(path!=='index.html')return text;
 text=text.replace(/<script\b[^>]*src=["']https?:[^"']*["'][^>]*><\/script>/gi,'');
 text=text.replace(/https:\/\/www\.gstatic\.com\/firebasejs\/[^"']+\.js/g,'/__qa/firebase.js');
 return text.replace('</head>','<script>window.Chart=class {destroy(){};update(){}};window.emailjs={init(){throw Error("E-mail bloqueado no QA")},send(){throw Error("E-mail bloqueado no QA")}};</script></head>');
}
