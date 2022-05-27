const fs = require("fs");

var settings = JSON.parse(fs.readFileSync("settings.json")); //(its in the .gitignore)


var dirPath = [settings.start];

var fileList = document.getElementById("fileList");
var navDirHolder = document.getElementById("navDirHolder");
var navDirs = document.getElementById("navDirs");
var navInput = document.getElementById("navInput");


async function viewDir() { //display dir in window
    console.log("viewing dir")

    var dirContents = await fs.promises.readdir(dirPath.at(-1), {withFileTypes: true});

    console.log(dirContents);

    fileList.innerHTML = ""; //clear the file list


    
    //edit the dir viewer
    navInput.style.display = "none";

    document.getElementById("navDirs").remove();

    let dirEle = dirToHtml();
    dirEle.id = "navDirs";
    navDirs = document.getElementById("navDirs");
    navDirHolder.appendChild(dirEle);

    [...document.getElementsByClassName("navDirSegment")].forEach(element => {
        element.addEventListener("click", function() {
            console.log(element.getAttribute("location"))

            dirPath.push(element.getAttribute("location"))
            viewDir();
        })
    })

    
    document.getElementById("dirEleWhiteSpace").addEventListener("click", function() {
        document.getElementById("navDirs").style.display = "none";

        navInput.value = dirPath.at(-1);
        navInput.style.display = "block";

        navInput.addEventListener("keyup", function(e) {
            if(e.key == "Enter") {
                dirPath.push(navInput.value);

                viewDir();
            }
        })
    })


    //for each of the files found, append the file list with their htmls
    if(dirContents.length == 0) {
        let msg = messageToHtml("no files in this directory :/")

        fileList.appendChild(msg);
    } else {
        dirContents.forEach(element => {
            let direntEle = direntToHtml(element);

            direntEle.addEventListener("dblclick", function() {
                openDirent(element);
            })

            fileList.appendChild(direntEle)
        })
    }

    //grey out certain buttons

    let navBack = document.querySelector("#navBack").firstElementChild;
    let navForward = document.querySelector("#navForward").firstElementChild;

    faSolidify(navBack)
    faSolidify(navForward)

    if(dirPath.length == 1) {
        faGreyout(navBack)
    }

    faGreyout(navForward)
    
}

function getDirentIcon(dirent) {
    if(dirent.isDirectory()) {
        return '<i class="fa-solid fa-folder"></i>';
    } else {
        return '<i class="fa-solid fa-square"></i>';
    }
}

function direntToHtml(dirent) {
    var direntEle = document.createElement("div");

    direntEle.innerHTML = `
        <div class="dirent">
            <span class="direntIcon">${getDirentIcon(dirent)}</span>
            <span class="direntName">${dirent.name}</span>
        </div>
    `

    //direntEle.setAttribute("location", dirPath.at(-1)+dirent.name);


    return direntEle;
}

function messageToHtml(message) {
    var ele = document.createElement("div")

    ele.innerHTML = message;

    ele.classList.add("message");

    return ele;
}

function dirToHtml(dir = dirPath.at(-1)) {
    var dirEle = document.createElement("div");

    var segments = [];

    let dirFolders = dir.replace("\\", "/").split("/");

    for(folder in dirFolders) {
        segments.push(`
            <div location="${dirFolders.slice(0,folder).join("/")+"/"+dirFolders[folder]}" class="navDirSegment navHover">${dirFolders[folder]}${folder == dirFolders.length ? '' : '<i class="fa-solid fa-angle-right"></i>'}</div>
        `)
    }

    segments.push(`<div style="width: 60px;" id="dirEleWhiteSpace"></div>`)

    dirEle.innerHTML = segments.join("");

    return dirEle;
}

function faSolidify(ele) {
    ele.classList.remove("greyed")
}

function faGreyout(ele) {
    ele.classList.add("greyed")
}

function openDirent(dirent) {
    console.log("opening dirent "+dirent.name);

    if(dirent.isDirectory()) {
        dirPath.push(dirPath.at(-1) + "/" + dirent.name);
        viewDir();
    }
}

function getUpDir() {
    var upDir = dirPath.at(-1).replace("\\","/").split("/");
    upDir.pop();
    upDir = upDir.join("/");

    return upDir;
}


function goUp() {
    dirPath.push(getUpDir());

    viewDir();
}

function goBack() {
    if(dirPath.length <= 1) return;

    dirPath.pop();

    viewDir();
}

//inputs
document.querySelector("#navBack").addEventListener("click", function() {
    goBack();
})


document.querySelector("#navUp").addEventListener("click", function() {
    goUp();
})


document.querySelector("#navReload").addEventListener("click", function() {
    viewDir();
})

viewDir();