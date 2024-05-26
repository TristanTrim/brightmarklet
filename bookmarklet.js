



window.courses;

function requestCourses(callback){

    const Http = new XMLHttpRequest();
    const url='https://bright.uvic.ca/d2l/lp/courseSelector/6606/InitPartial';
    Http.open("GET", url);
    Http.send();

    Http.onloadend = (e) => {
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



var gradesurl = "https://bright.uvic.ca/d2l/lms/grades/my_grades/main.d2l?ou=";

var assiurl = "https://bright.uvic.ca/d2l/lms/dropbox/user/folders_list.d2l?ou=";

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
    divbuf = document.createElement("div");
    divbuf.innerHTML="<h2>View Grades</h2>";
    brmk_menu.appendChild(divbuf);
    let list = document.createElement("ul");
    brmk_menu.appendChild(list);
    for (const [term, courselist] of Object.entries(terms)) {
        divbuf = document.createElement("li");
        divbuf.innerHTML = "<a>- "+term+"</a>";
        divbuf.onclick=()=>{openTerm(gradesurl,term);};
        list.appendChild(divbuf);
    }


    divbuf = document.createElement("div");
    divbuf.innerHTML="<h2>View Assignments</h2>";
    brmk_menu.appendChild(divbuf);

    list = document.createElement("ul");
    brmk_menu.appendChild(list);
    for (const [term, courselist] of Object.entries(terms)) {
        divbuf = document.createElement("li");
        divbuf.innerHTML = "<a>- "+term+"</a>";
        divbuf.onclick=()=>{openTerm(assiurl,term);};
        list.appendChild(divbuf);
    }

    divbuf = document.createElement("div");
    divbuf.innerHTML="<h2>Other Tools</h2>";
    brmk_menu.appendChild(divbuf);

    divbuf = document.createElement("div");
    divbuf.innerHTML="- Hide Submitted Assignments";
    divbuf.onclick=()=>{hideSubmitted();};
    brmk_menu.appendChild(divbuf);

    divbuf = document.createElement("div");
    divbuf.innerHTML="<h3>Find Friends</h3>";
    brmk_menu.appendChild(divbuf);

    list = document.createElement("ul");
    brmk_menu.appendChild(list);
    for (const [term, courselist] of Object.entries(terms)) {

        divbuf = document.createElement("li");
        divbuf.type="checkbox";
        divbuf.innerHTML = "<input type='checkbox' id="
                    +term.replace(" ","_")+"></input>"
                    +"<label for="+term.replace(" ","_")+">"
                    +term+"</label>";
        list.appendChild(divbuf);
    }
    divbuf = document.createElement("li");
    divbuf.innerHTML="--> Search (warning, slow)";
    divbuf.onclick=()=>{findFriends()};
    list.appendChild(divbuf);

});


function hideSubmitted(){

    list = document.getElementsByClassName("d_gt");
    for (let i=list.length; i>=0; i=i-1){
      let td = list[i];
      if( td && td.className == "d_gt"
            && ! td.firstChild.innerText.startsWith("Not Sub")
          ){
             td.parentElement.hidden=true;
      }
    }

    for (const ifr of document.getElementsByTagName("iframe")){
      
      list = ifr.contentWindow.document.getElementsByClassName("d_gt");
      for (let i=list.length; i>=0; i=i-1){
        let td = list[i];
        if( td && td.className == "d_gt"
              && ! td.firstChild.innerText.startsWith("Not Sub")
            ){
               td.parentElement.hidden=true;
        }
      }
        ifr.height = ifr.contentWindow.document.body.scrollHeight;
    }

}


function openTerm(url,term){
    for(const [cnum,cname] of terms[term] ){
        addIframe(
            url+cnum,
            cname);
    }

    window.scrollTo(0,document.body.scrollHeight);
}



function resizeIFrameToFitContent( iFrame ) {

    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}



function addIframe(url, name ){

  let title = document.createElement("div");
  title.innerHTML = name ;
  title.style.fontSize = "36px";
  document.body.append(title);

  window.ifr = document.createElement("iframe");
  document.body.append(window.ifr);
  window.ifr.width = window.innerWidth-20;
  

  let thisifr = window.ifr;
  window.ifr.onload = ()=>{ 
			setTimeout( 
				()=>{ resizeIFrameToFitContent( thisifr ); },
				200); } ;

  window.ifr.src = url;

}









function findFriends(){
    window.searchedClasses = [];
    window.classesToSearch = [];
    window.classmates = {};
    for (const [term, courselist] of Object.entries(terms)) {
        cb = document.getElementById(term.replace(" ","_"));

        if (cb.checked){
            for (const [cnum, cname] of courselist){
                searchedClasses.push(cnum);
                classesToSearch.push(cnum);
                classmates[cnum] = [];
                
            }
        }
    }
    fffromMakeIframe();
}




function fffromMakeIframe(){

  
  window.ifr = document.createElement("iframe");
  document.body.append(window.ifr);
  window.ifr.width = window.innerWidth-20;
  window.ifr.height = window.innerHeight-10;
  window.scrollTo(0,document.body.scrollHeight);
  
  window.ifr.onload = ()=>{
    setTimeout(searchClass,500);
  };
  
  loadClassToSearch();

}

function loadClassToSearch(){
  let c = window.classesToSearch.pop();
  if (c==undefined){
    alert("fin search");
    countEm();
  }else{
    window.coursenum = c;
    window.ifr.src = "https://bright.uvic.ca/d2l/lms/classlist/classlist.d2l?ou=" + c;
  }
}

function searchClass(){  

  let t = window.ifr.contentDocument.getElementsByClassName("d2l-table")[0].firstChild;

  let nams = Array.prototype.slice.call(t.children).map( (tr)=>{ return tr.children[2].innerText } );
  window.classmates[coursenum] = window.classmates[coursenum].concat(nams);

  
  butt = false;
  for(const button of window.ifr.contentDocument.getElementsByTagName("d2l-button-icon") ){
    if ( button.text == "Next Page" ) {
        button.click();
        butt=true;
        break;
    }
  }
  if (!butt){ 
      loadClassToSearch();
  }
}

function fromLookThroughPages(){
  
  for(const cnum of window.coursenums){
    window.location.href = "https://bright.uvic.ca/d2l/lms/classlist/classlist.d2l?ou=" + cnum; 
  
    for(const pg of window.ifr.contentDocument.getElementById("z_ew").children){
      UI.GC('z_g').SetPageNum(pg.value,true);
      
      for(const tr of document.getElementById("z_g").children[0].children){
        var name = tr.children[2].children[0].innerHTML;
        window.classmates[cnum].push(name);
      }
    }
  }

}


function countEm(){
    var studCount = new Proxy({}, {
      get: (target, name) => name=="list"? target : name in target ? target[name] : 0
    });

    for( const num of searchedClasses){
       let cl = classmates[num];
       for( const nam of cl){
          studCount[nam]++;
       }
    } 


    countStuds = {};

    for (var key in studCount) {
     if ( studCount[key] in countStuds ){
       countStuds[studCount[key]].push(key);
     }else{
       countStuds[studCount[key]] = [];
       countStuds[studCount[key]].push(key);
     }
    }

    console.log("Finished search. Here are your results:");
    console.log(countStuds);

}

