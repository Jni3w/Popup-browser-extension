let preV=null;
let createTimeoutID=null;
let clearTimeoutID=null;
const save=new Map();
const maxV=10;
initialize();

document.addEventListener("mouseover",(e) => {
    const link=e.target.closest("a");
    if(link&&link.href.includes("huijiwiki.com")){
        clearTimeout(clearTimeoutID);
        getInfo(link);
    }
})

document.addEventListener("mouseout",(e)=>{
    if(!e.target.closest("a")){
        return;
    }
    clearTimeout(createTimeoutID);
    hide();
})

preV.addEventListener("mouseover",()=>{
    if(preV.style.display=="block"){
        console.log("enter");
        clearTimeout(clearTimeoutID);
    }
})

preV.addEventListener("mouseout",(e)=>{
    if(e.relatedTarget&&e.relatedTarget.tagName!="A"){
        hide();
    }
})


async function getInfo(link){
    const url=new URL(link.href);
    const searchApi=url.origin+"/api.php?"+new URLSearchParams({
        origin:"*",
        action:"query",
        prop:"extracts",
        explaintext:true,
        exintro:true,
        titles:decodeURIComponent(url.pathname.replace("/wiki/","")),
        format:"json",
    });
    try{
        if(save.has(link.href)){
            const temp=save.get(link.href);
            display(temp[0],temp[1]);
            console.log("activated");
            return;
        }
        const response=await fetch(searchApi);
        const content=await response.json();
        const page=Object.values(content.query.pages)[0];
        console.log(page);
        const rect=link.getBoundingClientRect();
        if(save&&save.size==maxV){
            save.delete(save.keys().next().value);
        }
        save.set(link.href,[page,rect]);
        display(page,rect);
    }
    catch(error){
        console.error(error);
    }
}

function display(page,rect){
    createTimeoutID=setTimeout(()=>{
        preV.style.display="block";
        preV.innerHTML=page.extract;
        preV.style.top=rect.bottom+"px";
        preV.style.left=rect.left+"px";
        console.log("displayed");
    },500)
}

function hide(){
    console.log("hide");
    clearTimeoutID=setTimeout(()=>{
        preV.style.display="none";
        console.log("erased");
    },500)
}

function initialize(){
    preV=document.createElement("div");
    preV.id="preV";
    preV.style.display="none";
    document.body.appendChild(preV);
}
