



window.courses;

function requestCourses(callback){

    const Http = new XMLHttpRequest();
    const url='https://bright.uvic.ca/d2l/lp/courseSelector/6606/InitPartial';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      let resp = Http.responseText;
      let coursetxt = [...resp.matchAll(RegExp("d2l/home/.*?<\/a>","g"))];
      
      courses = coursetxt.map((x)=>{return x.toString()
            .replace("d2l/home/","")
            .replace("</a>","")
            .split("\\\">")});

      callback();
    }

}

function startOrAdd(dict,key,val){
    if (key in dict){
        dict[key].push(val);
    }else{
        dict[key] = [val];
    }
}




requestCourses(()=>{
    const brmk_menu = document.createElement("div");
    brmk_menu.id="brmk menu";
    document.body.prepend(brmk_menu);

    window.terms = {};

    for(let i=0; i<courses.length; i++){
        let c = courses[i];
        if (
                c[1].startsWith("Summer")
             || c[1].startsWith("Spring")
             || c[1].startsWith("Fall")
            ){
            let term = c[1].split(" ").slice(0,2).reverse().join(" ");
            startOrAdd(terms,term,c);
        }
    }
    
    let divbuf;
    for (const [term, courselist] of Object.entries(terms)) {
        console.log(term, courselist);

        divbuf = document.createElement("div");
        divbuf.innerHTML = "<a>"+term+"</a>";
        divbuf.onclick=()=>{openTerm(term);};
        brmk_menu.appendChild(divbuf);
    }
    
});




function openTerm(term){
    console.log(term);
    console.log(terms[term]);
    for(const [cnum,cname] of terms[term] ){
        addIframe(cnum, cname);
    }

    window.scrollTo(0,document.body.scrollHeight);
}



function resizeIFrameToFitContent( iFrame ) {

    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}



function addIframe(coursenum, name ){

  let title = document.createElement("div");
  title.innerHTML = name ;
  document.body.append(title);

  window.ifr = document.createElement("iframe");
  document.body.append(window.ifr);
  window.ifr.width = window.innerWidth-20;
  

  let thisifr = window.ifr;
  window.ifr.onload = ()=>{ 
			setTimeout( 
				()=>{ resizeIFrameToFitContent( thisifr ); },
				200); } ;

  window.ifr.src = "https://bright.uvic.ca/d2l/lms/grades/my_grades/main.d2l?ou=" + coursenum;

}



