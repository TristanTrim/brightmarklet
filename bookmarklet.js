

const brmk_menu = document.createElement("div");
brmk_menu.id="brmk menu";
document.body.prepend(brmk_menu);

for(let i=1; i<10; i++){
    divbuf = document.createElement("div");
    divbuf.innerText = "this is ok" + i.toString();
    brmk_menu.appendChild(divbuf);
}

