
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
    
    for (const [term, courselist] of Object.entries(terms)) {
        console.log(term, courselist.map((x)=>{return x[0];}));
    }
    
});

