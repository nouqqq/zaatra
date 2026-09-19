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


function getQty(id){
  return cart.filter(x=>x===id).length;
}


function render(){

  const search=document.querySelector("#search");
  const q=search ? search.value.trim() : "";

  const list=products.filter(p=>
    (currentCat==="الكل" || p.cat===currentCat) &&
    (!q || p.name.includes(q) || p.desc.includes(q))
  );

  if(!list.length){
    grid.innerHTML=`<div class="empty">ما لقينا منتج بهذا البحث.</div>`;
    return;
  }

  grid.innerHTML=list.map(p=>`

    <article class="product">

      <div class="pic">${p.icon}</div>

      <div class="info">

        <h3>${p.name}</h3>

        <div class="desc">${p.desc}</div>

        <div class="meta">

          <span class="price">${p.price} ر.س</span>

          <div style="display:flex;align-items:center;gap:6px">

            <button
              type="button"
              onclick="changeProductQty(${p.id},-1)"
              style="width:30px;height:30px">
              −
            </button>

            <span id="qty-${p.id}" style="min-width:20px;text-align:center">
              1
            </span>

            <button
              type="button"
              onclick="changeProductQty(${p.id},1)"
              style="width:30px;height:30px">
              +
            </button>

          </div>

          <button
            class="add"
            onclick="addToCart(${p.id})">
            أضف للسلة
          </button>

        </div>

        <div
          id="msg-${p.id}"
          style="
            margin-top:8px;
            min-height:20px;
            color:#304d38;
            font-size:13px;
            font-weight:bold;
          ">
        </div>

      </div>

    </article>

  `).join("");
}


function changeProductQty(id,change){

  const element=document.querySelector("#qty-"+id);

  if(!element) return;

  let qty=parseInt(element.textContent)||1;

  qty+=change;

  if(qty<1) qty=1;

  if(qty>99) qty=99;

  element.textContent=qty;
}


function addToCart(id){

  const element=document.querySelector("#qty-"+id);

  let qty=parseInt(element?.textContent)||1;

  if(qty<1) qty=1;

  for(let i=0;i<qty;i++){
    cart.push(id);
  }

  save();

  const msg=document.querySelector("#msg-"+id);

  if(msg){

    msg.textContent=
      qty===1
      ? "تمت الإضافة للسلة ✓"
      : `تمت إضافة ${qty} منتجات للسلة ✓`;

    setTimeout(()=>{
      msg.textContent="";
    },2500);

  }
}


function increaseCart(id){

  cart.push(id);

  save();
}


function decreaseCart(id){

  const index=cart.indexOf(id);

  if(index!==-1){
    cart.splice(index,1);
  }

  save();
}


function removeProduct(id){

  cart=cart.filter(x=>x!==id);

  save();
}


function save(){

  localStorage.setItem(
    "zaatraCart",
    JSON.stringify(cart)
  );

  renderCart();

  render();
}


function renderCart(){

  const box=document.querySelector("#cartItems");

  if(!box) return;

  const uniqueIds=[...new Set(cart)];

  if(!uniqueIds.length){

    box.innerHTML=
      '<div class="empty">السلة فاضية حاليًا 🛒</div>';

  }else{

    box.innerHTML=uniqueIds.map(id=>{

      const product=products.find(p=>p.id===id);

      if(!product) return "";

      const qty=getQty(id);

      const subtotal=product.price*qty;

      return `

        <div class="item">

          <div>

            <b>${product.name}</b>

            <br>

            <span>
              ${product.price} ر.س × ${qty}
            </span>

            <br>

            <strong>
              ${subtotal} ر.س
            </strong>

          </div>

          <div
            style="
              display:flex;
              align-items:center;
              gap:5px;
              margin-top:8px;
            ">

            <button
              type="button"
              onclick="decreaseCart(${id})">
              −
            </button>

            <span
              style="
                min-width:25px;
                text-align:center;
              ">
              ${qty}
            </span>

            <button
              type="button"
              onclick="increaseCart(${id})">
              +
            </button>

            <button
              type="button"
              onclick="removeProduct(${id})">
              حذف
            </button>

          </div>

        </div>

      `;

    }).join("");

  }


  const total=cart.reduce((sum,id)=>{

    const product=products.find(p=>p.id===id);

    return sum+(product ? product.price : 0);

  },0);


  const totalElement=document.querySelector("#total");

  if(totalElement){
    totalElement.textContent=total+" ر.س";
  }


  const countElement=document.querySelector("#cartCount");

  if(countElement){
    countElement.textContent=cart.length;
  }

}


function openCart(){

  const cartElement=document.querySelector("#cart");
  const overlay=document.querySelector("#overlay");

  if(cartElement){
    cartElement.classList.add("open");
  }

  if(overlay){
    overlay.classList.add("open");
  }

}


function closeCart(){

  const cartElement=document.querySelector("#cart");
  const overlay=document.querySelector("#overlay");

  if(cartElement){
    cartElement.classList.remove("open");
  }

  if(overlay){
    overlay.classList.remove("open");
  }

}


const cartButton=document.querySelector("#cartBtn");

if(cartButton){
  cartButton.onclick=openCart;
}


const closeCartButton=document.querySelector("#closeCart");

if(closeCartButton){
  closeCartButton.onclick=closeCart;
}


const overlay=document.querySelector("#overlay");

if(overlay){
  overlay.onclick=closeCart;
}


const search=document.querySelector("#search");

if(search){
  search.oninput=render;
}


document.querySelectorAll(".cat").forEach(button=>{

  button.onclick=()=>{

    document
      .querySelectorAll(".cat")
      .forEach(x=>x.classList.remove("active"));

    button.classList.add("active");

    currentCat=button.dataset.cat;

    render();

  };

});


const checkout=document.querySelector("#checkout");

if(checkout){

  checkout.onclick=()=>{

    if(!cart.length){

      alert("أضف منتجًا للسلة أولًا.");

      return;
    }

    const modal=document.querySelector("#modal");

    if(modal){
      modal.classList.add("open");
    }

  };

}


const closeModal=document.querySelector("#closeModal");

if(closeModal){

  closeModal.onclick=()=>{

    const modal=document.querySelector("#modal");

    if(modal){
      modal.classList.remove("open");
    }

  };

}


const demoPay=document.querySelector("#demoPay");

if(demoPay){

  demoPay.onclick=()=>{

    const nameInput=document.querySelector("#name");

    const name=nameInput?.value.trim()||"عميلنا";

    const success=document.querySelector("#success");

    if(success){
      success.textContent=
        `تم إنشاء طلب تجريبي لـ ${name} ✅`;
    }

    cart=[];

    save();

  };

}


render();

renderCart();
