var payload=[]

function csvReader() {
    var csv = document.getElementById("csv_id").files[0];
    const reader = new FileReader();
    reader.onload = async function (event) {
        csv = event.target.result
        var lines = csv.toString().split("\n");
        console.log(lines)
        var result = [];
        console.log(lines[0])
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length-1; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }


        const response = await fetch('csv', {
            method: 'POST',
            body: JSON.stringify(result)
        })
        if (response.status === 200) {
            var jsonData =  await response.json();
            console.log(jsonData)
            traverse(jsonData,showError)
        }

    };
    reader.readAsText(csv);
}

//called with every property and its value
function showError(key,value) {
    console.log(key + " : "+value);
    const node = document.createElement("li");
    //const textnode = document.createTextNode(`Line Number ${Object.keys(element)[0]}: ${element[Object.keys(element)[0]]}`);
    const textnode = document.createTextNode(`Line No : ${key} has error : ${value}`);
    node.appendChild(textnode);
    document.getElementById("error_msgs_list").appendChild(node)
}

function traverse(o,func) {
    for (var i in o) {
        func.apply(this,[i,o[i]]);
        console.log(o[i])
        if (o[i] !== null && typeof(o[i])=="object") {
            //going one step down in the object tree!!
            traverse(o[i],func);
        }
    }
}

function addDataToJson() {
    let jsonObj = {}
    var field = document.getElementById("field")
    var type = document.getElementById("type")
    var value = document.getElementById("text_file_id").files[0]
    var fixed_len = document.getElementById("fixed-len")
    var dependentOn = document.getElementById("dependent")
    var dependentValue = document.getElementById("dep-val")
    jsonObj["fieldName"] = field.value
    jsonObj["type"] = type.value
    let reader = new FileReader();
    if (value != null){
     reader.addEventListener('load', function(e) {
            let text = e.target.result
            jsonObj["values"] = text.split('\n')
        });
        reader.readAsText(value)
    }
    jsonObj["length"] = fixed_len.value
    jsonObj["dependentOn"] = dependentOn.value
    jsonObj["dependentValue"] = dependentValue.value
    payload.push(jsonObj)
    console.log(payload)
}

async function sendConfigData(){
    var resp = await fetch('add-meta-data', {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (resp.status === 200) {
            var jsonData = await resp.json();
            console.log(jsonData)
            alert("Successfully Added Data");
    }
}