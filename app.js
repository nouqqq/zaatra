const products=[
{id:1,name:"رحلة الكنز — لعبة PDF",cat:"ألعاب PDF",price:15,icon:"🗺️",desc:"لعبة ألغاز ومهمات قابلة للطباعة للعائلة والأصدقاء."},
{id:2,name:"مغامرة المحقق الصغير",cat:"ألعاب PDF",price:18,icon:"🕵️",desc:"ملف تفاعلي مليء بالأدلة والألغاز الخفيفة."},
{id:3,name:"كتيب تعلم مهارة جديدة",cat:"تعليم",price:12,icon:"📚",desc:"كتيب PDF مرتب يحتوي خطوات وتمارين عملية بسيطة."},
{id:4,name:"باقة أنشطة العائلة",cat:"أنشطة",price:20,icon:"🧩",desc:"مجموعة أنشطة وأسئلة وألعاب مناسبة للجلسات."},
{id:5,name:"دفتر تخطيط أسبوعي PDF",cat:"قوالب",price:9,icon:"📝",desc:"قالب أسبوعي للطباعة والتنظيم والمتابعة."},
{id:6,name:"100 فكرة تحدي وألعاب",cat:"ألعاب PDF",price:14,icon:"🎯",desc:"أفكار متنوعة للتحديات والألعاب في البيت."},
{id:7,name:"ملف أسئلة ثقافية",cat:"أنشطة",price:11,icon:"💡",desc:"أسئلة ثقافية خفيفة مع صفحات جاهزة للعب."},
{id:8,name:"باقة زعترة الرقمية",cat:"قوالب",price:29,icon:"🎁",desc:"حزمة تجمع ألعابًا وقوالب وأنشطة رقمية متنوعة."}
];

let cart=JSON.parse(localStorage.getItem("zaatraCart")||"[]");
let currentCat="الكل";

const grid=document.querySelector("#productsGrid");
function render(){
 const q=document.querySelector("#search").value.trim();
 const list=products.filter(p=>(currentCat==="الكل"||p.cat===currentCat)&&(!q||p.name.includes(q)||p.desc.includes(q)));
 grid.innerHTML=list.length?list.map(p=>`<article class="product"><div class="pic">${p.icon}</div><div class="info"><h3>${p.name}</h3><div class="desc">${p.desc}</div><div class="meta"><span class="price">${p.price} ر.س</span><button class="add" onclick="add(${p.id})">+ أضف للسلة</button></div></div></article>`).join(""):`<div class="empty">ما لقينا منتج بهذا البحث.</div>`;
}
function add(id){cart.push(id);save()}
function remove(i){cart.splice(i,1);save()}
function save(){localStorage.setItem("zaatraCart",JSON.stringify(cart));renderCart();render()}
function renderCart(){
 const box=document.querySelector("#cartItems");
 const items=cart.map((id,i)=>({p:products.find(x=>x.id===id),i})).filter(x=>x.p);
 if(!items.length) box.innerHTML='<div class="empty">السلة فاضية حاليًا 🛒</div>';
 else box.innerHTML=items.map(x=>`<div class="item"><div><b>${x.p.name}</b><br><span>${x.p.price} ر.س</span></div><button onclick="remove(${x.i})">حذف</button></div>`).join("");
 const total=cart.reduce((s,id)=>s+(products.find(p=>p.id===id)?.price||0),0);
 document.querySelector("#total").textContent=total+" ر.س";
 document.querySelector("#cartCount").textContent=cart.length;
}
function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#overlay").classList.add("open")}
function closeCart(){document.querySelector("#cart").classList.remove("open");document.querySelector("#overlay").classList.remove("open")}
document.querySelector("#cartBtn").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=closeCart;
document.querySelector("#search").oninput=render;
document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentCat=b.dataset.cat;render()});
document.querySelector("#checkout").onclick=()=>{if(!cart.length)return alert("أضف منتجًا للسلة أولًا.");document.querySelector("#modal").classList.add("open")};
document.querySelector("#closeModal").onclick=()=>document.querySelector("#modal").classList.remove("open");
document.querySelector("#demoPay").onclick=()=>{const n=document.querySelector("#name").value.trim()||"عميلنا";document.querySelector("#success").textContent=`تم إنشاء طلب تجريبي لـ ${n} ✅`;cart=[];save()};
render();renderCart();
