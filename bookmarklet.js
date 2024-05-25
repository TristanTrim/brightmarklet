
var courses;

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

requestCourses(()=>{
    const brmk_menu = document.createElement("div");
    brmk_menu.id="brmk menu";
    document.body.prepend(brmk_menu);

    for(let i=0; i<courses.length; i++){
        divbuf = document.createElement("div");
        divbuf.innerText = courses[i][1];
        brmk_menu.appendChild(divbuf);
    }
    
});

