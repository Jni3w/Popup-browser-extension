let preV=null;
let createTimeoutID=null;
let clearTimeoutID=null;

document.addEventListener("mouseover",async (e) => {
    createTimeoutID=await setTimeout(()=>{
        const link=e.target.closest("a");
        if(link&&link.href.includes("huijiwiki.com")){
            getInfo(link);
        }
    },500);
    if(preV){
        preV.addEventListener("mouseover",(e)=>{
            clearTimeout(clearTimeoutID);
        })
    }
})

document.addEventListener("mouseout",(e)=>{
    if(!e.target.closest("a")){
        return;
    }
    clearTimeout(createTimeoutID);
    if(e.relatedTarget){
        if(e.relatedTarget.id=="preV"){
            preV.addEventListener("mouseout",(e)=>{
                if(e.target.tagName!=="a"){
                    hide();
                }
            })
        }
        else{
            hide();
        }
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
        const response=await fetch(searchApi);
        const content=await response.json();
        const page=Object.values(content.query.pages)[0];
        console.log(page);
        const rect=link.getBoundingClientRect();
        display(page,rect);
    }
    catch(error){
        console.error(error);
    }
}

function display(page,rect){
    if(!preV){
        preV=document.createElement("div");
        preV.id="preV";
        document.body.appendChild(preV);
    }
    preV.style.display="block";
    preV.innerHTML=page.extract;
    preV.style.top=rect.bottom+"px";
    preV.style.left=rect.left+"px";
    console.log(preV.style.position)
    console.log("created");
}

function hide(){
    if(preV){
        clearTimeoutID=setTimeout(()=>{
            preV.style.display="none";
            console.log("erased");
        },300)
    }
}