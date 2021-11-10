//TODO
    
function addNewNote(){
    showAllRows();
    let newRow = document.getElementById("noteRow").cloneNode(true);
    document.getElementById("maintable").appendChild(newRow);

    let id = getMaxID();

    newRow.id = id;
    newRow.querySelectorAll("#noteId")[0].innerHTML = id;
    newRow.querySelectorAll('textarea')[0].value = document.getElementById("searchbar").value;

    hideElement(document.getElementById("noteRow"));
    enableElement(document.getElementById('savebutton'));
    resetSearchBar();
}

let filehandle;
let MaxID;

function getMaxID(){
    let id = MaxID;
    MaxID += 1;
    return id;
}

function resetSearchBar(){
    disableElement(document.getElementById("addNewButton"));
    document.getElementById("searchbar").value = "";
}

async function openFile(){
    [filehandle] = await window.showOpenFilePicker();
    let filedata = await filehandle.getFile();
    let notes = JSON.parse(await filedata.text());

    loadNotes(notes);
}

function loadNotes(notes){
    resetAllRows();
    for(let key in notes){
        if(key == "maxid") {
            MaxID = notes[key];
            console.log(MaxID);
        }else{
           let newRow = document.getElementById("noteRow").cloneNode(true);
            newRow.id = key;
            newRow.querySelectorAll("#noteId")[0].innerText = key;
            newRow.querySelectorAll('textarea')[0].value = notes[key];

            newRow.querySelectorAll('textarea')[0].addEventListener('keyup', function(){
                console.log("change");
                enableElement(document.getElementById('savebutton'));
            })

            newRow.querySelectorAll(".btn")[0].id =key;

            newRow.querySelectorAll(".btn")[0].addEventListener('click', function() {
                console.log(key);
                document.getElementById("maintable").removeChild(document.getElementById(key));
                enableElement(document.getElementById('savebutton'));
            });

            document.getElementById("maintable").appendChild(newRow);
        }
    }

    document.getElementById("noteRow").classList.add("d-none");
}

async function saveNotes(){
    let stream = await filehandle.createWritable();

    let output = '{';

    output += '"maxid" : ' + MaxID;

    // tr:not(d.none) = don't select rows that are display 'none'
    let rows = document.querySelectorAll('tbody tr:not(.d-none)');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            console.log(row);
            console.log(output.length);
            if (output.length > 1){
                output += ',';
            }

            output += '"' + row.querySelectorAll("#noteId")[0].innerText + '":';
            output += ' "' + row.querySelectorAll("#noteText")[0].value + '"';
        }
    }
    output += '}';

    console.log(output);

    await stream.write(output);
    await stream.close();
}

function search(){
    let searchText = document.getElementById("searchbar").value.toUpperCase();
    console.log(searchText);
    // tr:not('#noteRow') = don't select the original blank noteRow
    let rows = document.querySelectorAll('tbody tr:not(#noteRow)');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];

            if (searchText == ""){
                showElement(row);
            }else{
                let text = row.querySelectorAll("#noteText")[0].value;
                if (text.toUpperCase().includes(searchText)){
                    showElement(row);
                }else{
                    hideElement(row);
                }
            }
        }
    }

    console.log(AnyRowsVisible());
    if (AnyRowsVisible()){
        disableElement(document.getElementById("addNewButton"));
    }else{
        enableElement(document.getElementById("addNewButton"));
    }
}

function AnyRowsVisible(){
    let rows = document.querySelectorAll('tbody tr:not(#noteRow)');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            if (!row.classList.contains("d-none")){
                return true;
            }
        }
    }

    return false;
}

function showAllRows(){
    //let rows = document.querySelectorAll('tbody tr:not(#noteRow)');
    let rows = document.querySelectorAll('tbody tr');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            showElement(row);
        }
    }
}

function resetAllRows(){
    //let rows = document.querySelectorAll('tbody tr:not(#noteRow)');
    let rows = document.querySelectorAll('tbody tr:not(#noteRow)');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            document.getElementById("maintable").removeChild(row);
        }
    }

    showElement(document.getElementById('noteRow'));
    hideElement(document.getElementById('emptytext'));
}

function showElement(element){
    element.classList.remove('d-none');
}

function hideElement(element){
    element.classList.add('d-none');
}

function enableElement(element){
    element.removeAttribute("disabled");
}

function disableElement(element){
    element.setAttribute("disabled", "disabled");
}
