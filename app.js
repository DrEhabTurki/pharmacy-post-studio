const $=id=>document.getElementById(id), canvas=$("poster"),ctx=canvas.getContext("2d");
let kind="product",product=null,logo=null,saved=JSON.parse(localStorage.getItem("pharmacyPosts")||"[]");
const accent=()=>$("accent").value;
function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke()}}
function contain(img,x,y,w,h){if(!img)return;const s=Math.min(w/img.width,h/img.height),dw=img.width*s,dh=img.height*s;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function linesFor(t,max,font){ctx.font=font;let out=[],line="";for(const word of t.split(/\s+/)){const test=line?line+" "+word:word;if(ctx.measureText(test).width>max&&line){out.push(line);line=word}else line=test}if(line)out.push(line);return out}
function draw(){
 const W=1080,H=1920,c=accent();ctx.clearRect(0,0,W,H);ctx.fillStyle="#050505";ctx.fillRect(0,0,W,H);
 const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,"#191919");grad.addColorStop(.52,"#050505");grad.addColorStop(1,"#121212");ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle=c;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(35,235);ctx.lineTo(35,90);ctx.lineTo(180,35);ctx.moveTo(900,35);ctx.lineTo(1045,90);ctx.lineTo(1045,235);ctx.moveTo(35,1685);ctx.lineTo(35,1825);ctx.lineTo(180,1880);ctx.moveTo(900,1880);ctx.lineTo(1045,1825);ctx.lineTo(1045,1685);ctx.stroke();
 ctx.globalAlpha=.35;ctx.fillStyle=c;ctx.fillRect(35,270,1010,3);ctx.fillRect(35,1645,1010,3);ctx.globalAlpha=1;
 if(logo)contain(logo,410,35,260,210);else{ctx.beginPath();ctx.arc(540,135,82,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=5;ctx.stroke();ctx.fillStyle="#eee";ctx.font="bold 54px Arial";ctx.textAlign="center";ctx.fillText("✚",540,155)}
 ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="bold 30px Arial";ctx.fillText("صيدليات د/ مراد صادق",540,292);
 ctx.fillStyle=c;ctx.font="bold 27px Arial";ctx.fillText(kind==="awareness"?"معلومة تهم صحتك":kind==="offer"?"عرض مميز":"اختيارك من صيدليتك",540,355);
 const title=$("title").value.trim()||"عنوان البوست";const fs=+$("titleSize").value;ctx.fillStyle="#fff";ctx.font=`bold ${fs}px Tahoma,Arial`;let titleLines=linesFor(title,900,ctx.font),y=470;titleLines.slice(0,2).forEach(s=>{ctx.fillText(s,540,y);y+=fs*1.3});rounded(130,y+8,820,5,3,c,null);
 const ih=$("imageSize").value==="large"?610:$("imageSize").value==="small"?350:480;
 if(product){rounded(205,y+48,670,ih,25,"#f4f4f4","#555");contain(product,225,y+65,630,ih-34)}
 else{rounded(205,y+48,670,ih,25,"#101010","#444");ctx.fillStyle="#777";ctx.font="28px Arial";ctx.fillText("أضف صورة المنتج من هنا",540,y+ih/2+60)}
 const body=$("body").value.trim(),align=$("textAlign").value;ctx.textAlign=align;ctx.fillStyle="#fff";ctx.font="38px Tahoma,Arial";const bodyLines=linesFor(body,850,ctx.font);let by=y+ih+125;bodyLines.slice(0,8).forEach((s,i)=>ctx.fillText(s,align==="right"?950:540,by+i*66));
 ctx.textAlign="center";ctx.fillStyle=c;ctx.font="bold 34px Tahoma";ctx.fillText("نهتم بصحتكم",540,1770);ctx.fillStyle="#bbb";ctx.font="24px Arial";ctx.fillText("صيدليات د/ مراد صادق",540,1818);
}
function readImage(file,cb){if(!file)return;const url=URL.createObjectURL(file),im=new Image();im.onload=()=>{cb(im);draw();URL.revokeObjectURL(url)};im.src=url}
$("productImage").onchange=e=>readImage(e.target.files[0],im=>product=im);
$("logoImage").onchange=e=>readImage(e.target.files[0],im=>{logo=im;try{const c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);localStorage.setItem("pharmacyLogo",c.toDataURL("image/png"))}catch{alert("تعذر حفظ اللوجو بسبب حجمه. يمكنك رفعه عند الحاجة.")}});
const oldLogo=localStorage.getItem("pharmacyLogo");if(oldLogo){const im=new Image();im.onload=()=>{logo=im;draw()};im.src=oldLogo}
["title","body","accent","titleSize","imageSize","textAlign"].forEach(id=>$(id).addEventListener("input",draw));
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{kind=b.dataset.kind;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));draw()});
$("exportBtn").onclick=()=>{draw();const a=document.createElement("a");a.download="pharmacy-post.png";a.href=canvas.toDataURL("image/png");a.click()};
$("saveBtn").onclick=()=>{saved.unshift({title:$("title").value,body:$("body").value,kind,accent:accent(),date:new Date().toLocaleString("ar-EG")});saved=saved.slice(0,40);localStorage.setItem("pharmacyPosts",JSON.stringify(saved));renderSaved();alert("تم حفظ التصميم على هذا الجهاز")};
function renderSaved(){const box=$("savedList");box.innerHTML="";saved.forEach(s=>{const b=document.createElement("button");b.textContent=(s.title||"تصميم")+" — "+s.date;b.onclick=()=>{$("title").value=s.title;$("body").value=s.body;$("accent").value=s.accent;kind=s.kind;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.kind===kind));draw()};box.appendChild(b)})}
$("showSaved").onclick=()=>{renderSaved();$("savedList").scrollIntoView({behavior:"smooth",block:"nearest"})};
$("resetBtn").onclick=()=>{$("title").value="عنوان البوست هنا";$("body").value="اكتب المعلومات المهمة بشكل مختصر وواضح.";product=null;$("productImage").value="";draw()};
renderSaved();draw();
let installEvent;$("installBtn").hidden=true;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvent=e;$("installBtn").hidden=false});$("installBtn").onclick=async()=>{if(installEvent){installEvent.prompt();installEvent=null}};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));