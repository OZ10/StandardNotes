//TODO
    // Add tab for Holds

function addNewNote(){
    showAllRows();
    
    let note = createNoteRow();

    populateNoteDetails(note, getMaxID(), document.getElementById("searchbar").value);

    addNewRow(note)

    hideElement(document.getElementById("noteRow"));
    enableElement(document.getElementById('savebutton'));
    resetSearchBar();
}

let MaxId;
function getMaxID(){
    // Get the MaxId and return it; also increase the MaxId by 1 to be used later 
    let id = MaxId;
    MaxId += 1;
    return id;
}

function createNoteRow(){
    // All note rows are cloned from a blank note row which is hidden after cloning
    return document.getElementById("noteRow").cloneNode(true);
}

function populateNoteDetails(note, id, text){
    note.id = id;
    note.querySelectorAll("#noteId")[0].innerHTML = id;
    note.querySelectorAll('textarea')[0].value = text;

    note.querySelectorAll('textarea')[0].addEventListener('keyup', function(){
        console.log("change");
        enableElement(document.getElementById('savebutton'));
    })

    note.querySelectorAll(".btn")[0].id = id;

    note.querySelectorAll(".btn")[0].addEventListener('click', function() {
        document.getElementById("maintable").removeChild(document.getElementById(id));
        enableElement(document.getElementById('savebutton'));
    });
}

function addNewRow(note){
    document.getElementById("maintable").appendChild(note);
}

function resetSearchBar(){
    disableElement(document.getElementById("addNewButton"));
    document.getElementById("searchbar").value = "";
}

let filehandle;
async function openFile(){
    [filehandle] = await window.showOpenFilePicker({
        types: [
            {
                description: 'Json',
                accept: {
                    'json/*': ['.json']
                }
            }
        ]
    });
    let filedata = await filehandle.getFile();
    let notes = JSON.parse(await filedata.text());

    loadNotes(notes);
}

function loadNotes(notes){
    resetAllRows();
    for(let noteid in notes){
        if(noteid == "maxid") {
            // MaxId used as a counter for the new available id
            MaxId = notes[noteid];
            console.log(MaxId);
        }else{
            let note = createNoteRow();

            populateNoteDetails(note, noteid, notes[noteid]);
            addNewRow(note)
        }
    }

    enableElement(document.getElementById("searchbar"));
    hideElement(document.getElementById("noteRow"));
}

async function saveNotes(){
    let stream = await filehandle.createWritable();

    let output = '{';

    output += '"maxid" : ' + MaxId;

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
    let rows = document.querySelectorAll('tbody tr');
    if (rows){
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            showElement(row);
        }
    }
}

function resetAllRows(){
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
