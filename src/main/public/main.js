var payload = []
var result = []
var fields = []
var fieldCount = 0
var configName = []


function checkIfConfigNameAlreadyExit(file_name) {
    if (configName.indexOf(file_name) !== -1) return 1
    return 0
}

function validateConfigName() {
    var file_name = document.getElementById("fileName").value
    var getCheckBox = document.getElementById("configCheckBox").checked
    if ((file_name === "" || checkIfConfigNameAlreadyExit(file_name)) && getCheckBox) {
        document.getElementById("config_name_validation").style.display = 'block';
        return 0
    }
    return 1
}

function csvReader() {
    localStorage.setItem("csv", document.getElementById("csv_id").value.split("\\")[2])
    var csv = document.getElementById("csv_id").files[0];
    const reader = new FileReader();
    reader.onload = async function (event) {
        csv = event.target.result
        console.log(document.getElementById("csv_id").value.split("\\")[2])
        var lines = csv.toString().split("\n");
        var headers = lines[0].split(",");
        showColFields(headers);
        fields.push(headers)
        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {};
            var currentLine = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j].replaceAll('"', '');
            }
            result.push(obj);
        }
    };
    reader.readAsText(csv);
}


async function getConfigFilesName() {
    var resp = await fetch('get-config-files', {
        method: 'GET',
    })

    if (resp.status === 200) {
        var jsonData = await resp.json();
        console.log(jsonData)
        setConfigInDropDown(jsonData)
    }
}

function setConfigInDropDown(object) {
    console.log(object)
    for (var i in object) {
        console.log(object[i])
        console.log(object[i] !== "")
        if (object[i] !== "") {
            for (j in object[i]) {
                let fileNameDropDown = document.getElementById("listOfFileNames");
                var fileNameDropdownOption = document.createElement("option");
                fileNameDropdownOption.value = object[i][j];
                fileNameDropdownOption.text = object[i][j];
                fileNameDropDown.appendChild(fileNameDropdownOption);
                configName.push(object[i][j]);
            }
        }
    }
}

async function getConfigResponse() {
    let configName = document.getElementById("listOfFileNames").value
    if (configName !== "") {
        var resp = await fetch('get-config-response', {
            method: 'POST',
            body: JSON.stringify([{"configName": configName}])
        })

        if (resp.status === 200) {
            var jsonData = await resp.json();
            console.log(jsonData)
            setValuesInConfig(jsonData)
        }
    }
}

function setValuesInConfig(object) {
    console.log(object)
    for (var i in object) {
        console.log(object[i])
        console.log(object[i] !== "")
        if (object[i] !== "") {
            for (j in object[i]) {
                changeDefaultValuesOfConfig(object[i][j])
            }
        }
    }
}

function changeDefaultValuesOfConfig(object) {
    for (var fields in object) {
        console.log(fields)
        console.log(`type${fields}`)
        var valueOfTypeId = document.getElementById(`type${fields}`.replaceAll('"', ''))
        if (valueOfTypeId !== null) {
            setDefaultValues(object, fields)
        }
    }
}

function setDefaultValues(object, fields) {
    document.getElementById(`type${fields}`.replaceAll('"', '')).value = object[fields]["type"];
    document.getElementById(`fixed-len${fields}`.replaceAll('"', '')).value = object[fields]["length"];
    document.getElementById(`allowNull${fields}`.replaceAll('"', '')).value = object[fields]["nullValue"];
    if (object[fields]["nullValue"] === "Allowed") {
        document.getElementById(`allowNull${fields}`.replaceAll('"', '')).checked = "checked";
    }
    document.getElementById(`date${fields}`.replaceAll('"', '')).value = object[fields]["date"];
    document.getElementById(`dateTime${fields}`.replaceAll('"', '')).value = object[fields]["dateTime"];
    document.getElementById(`dependent${fields}`.replaceAll('"', '')).value = object[fields]["dependentOn"];
    document.getElementById(`dep-val${fields}`.replaceAll('"', '')).value = object[fields]["dependentValue"];
    document.getElementById(`time${fields}`.replaceAll('"', '')).value = object[fields]["time"];

    alterDateTimeOptions(fields)
}

function alterDateTimeOptions(fields) {
    alterDateOption(fields)
    alterDateTimeOption(fields)
    alterTimeOption(fields)

    const typeValue = document.getElementById(`type${fields}`.replaceAll('"', '')).value;
    if (typeValue !== "Date") {
        document.getElementById(`date${fields}`.replaceAll('"', '')).value = ''
    }
    if (typeValue !== "Time") {
        document.getElementById(`time${fields}`.replaceAll('"', '')).value = ''
    }
    if (typeValue !== "DateTime") {
        document.getElementById(`dateTime${fields}`.replaceAll('"', '')).value = ''
    }
}

function alterDateTimeOption(fields) {
    if (document.getElementById(`type${fields}`.replaceAll('"', '')).value === "DateTime") {
        document.getElementById(`dateTime${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`dateTimeDiv${fields}`.replaceAll('"', '')).style.display = 'flex'
        document.getElementById(`dateTimeFormats${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`time${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`date${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`fixed-len${fields}`.replaceAll('"', '')).value = ''
    }
}

function alterDateOption(fields) {
    if (document.getElementById(`type${fields}`.replaceAll('"', '')).value === "Date") {
        document.getElementById(`date${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`dateDiv${fields}`.replaceAll('"', '')).style.display = 'flex'
        document.getElementById(`dateFormats${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`dateTimeDiv${fields}`.replaceAll('"', '')).style.display = 'none'
        document.getElementById(`dateTime${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`time${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`fixed-len${fields}`.replaceAll('"', '')).value = ''
    }
}

function alterTimeOption(fields) {
    if (document.getElementById(`type${fields}`.replaceAll('"', '')).value === "Time") {
        document.getElementById(`time${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`timeDiv${fields}`.replaceAll('"', '')).style.display = 'flex'
        document.getElementById(`timeFormats${fields}`.replaceAll('"', '')).style.display = 'block'
        document.getElementById(`dateDiv${fields}`.replaceAll('"', '')).style.display = 'none'
        document.getElementById(`dateTime${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`date${fields}`.replaceAll('"', '')).value = ''
        document.getElementById(`fixed-len${fields}`.replaceAll('"', '')).value = ''
    }
}

function mySubmitFunction(e) {
    e.preventDefault();
    // someBug();
    return false;
}

function showColFields(lines) {
    for (var i = 1, j = 0; i <= lines.length; i++, j++) {
        fieldCount += 1
        var row = document.createElement('div');
        var field = `${lines[j]}`.replaceAll('"', '');
        row.setAttribute("class", "row")
        row.setAttribute("id", `row${field}`)

        row.innerHTML = `
        <div id="addConfig${field}">
            <div id = "fields">

              <h2 class="title"><b>${field}</b></h2>
                    <div class="form-row">

<!--                       <p><span id="typeEmpty${field}" class="error"></span></p>-->


                      <div class="form-group col-md-1.5" style="margin-left: 1%;">
                      <select class="form-control" data-cy="type" id="type${field}" 
                            onchange="showDateTimeOptions(this.value,'dateDiv${field}','dateFormats${field}' , 'date${field}','timeDiv${field}','timeFormats${field}','time${field}','dateTimeDiv${field}','dateTimeFormats${field}' , 'dateTime${field}' ,'length-div${field}', 'value-div${field},uploadFileDiv${field}');" required>
                               <option selected="selected" value="">Choose Type of Data</option>
                                <option value="Number">Number</option>
                                <option value="AlphaNumeric">AlphaNumeric</option>
                                <option value="Alphabets">Alphabets</option>
                                <option value="FloatingNumber">Floating Number</option>
                                <option value="Text">Text</option>
                                <option value="DateTime">Date Time</option>
                                <option value="Date">Date</option>
                                <option value="Time">Time</option>
                                <option value="Email">Email</option>
                            </select>
                      </div>
                      
                      
                      
              

                      <div class="form-group col-md-1." style="margin-left: 0.5%;display:flex;" id="length-div${field}">
                        <input type="number" class="form-control"  placeholder="Enter Length" min=1 onkeypress="return event.charCode >= 49" type="number" id="fixed-len${field}" data-cy="fixed-len" >
                      </div>
                      
                  
                    
                        <button style="margin-left: 0.8%;margin-top: 0.5%" class="btn btn-primary btn-sm" type="button"  data-toggle="modal" data-target="#chooseValues${field}">Upload or Type Values</button>
                     
         

                    <div style="margin-left: 1%;margin-top: 1%" id = "allowEmptyValues1${field}" class="form-group col-md-0" style=" ;margin-top: 1%;margin-left: 6%;">
                      <label >Allow Empty Values</label>
                    </div>

                    <div style= "margin-top: 1%;margin-left: -2.5% " id = "allowEmptyValues2${field}" class="form-group col-md-1" style=" white-space: nowrap;margin-left: -2%;margin-top:1%;">
                      <input id="allowNull${field}" value="Not Allowed" onclick="toggleYesOrNo(this.id);" style="margin-left: 1.5%;" type="checkbox" class="toggle">
                    </div>


                    <div class="form-group col-md-1.5" style="margin-left: -2%;">
                      <select id="dependent${field}" class="form-control">
                        <option disabled="disabled" value ="" selected="selected">Dependent Field</option>
                        ${lines.map((element) => {
            return `<option value='${element}'>${element.replaceAll('"', '')}</option>`;
        })}
                      </select>
                      </div>



                        <div class="form-group col-md-0" style="margin-left: 0.5%;margin-top: 0.5%">
                          <input id="dep-val${field}"  class="form-control" id="inputEmail4" placeholder="Dependent Value">
                        </div>
                        
                     </div>
                     
                      <div id = "dateTimeDiv${field}"  style="display: none; margin-left: 0.8%;width:19.5%;">
                        <label class ="required-field" for="datetime" id="dateTimeFormats${field}" style='display:none;'></label>
                        <select  class="form-control" name="datetime" id='dateTime${field}' style='display:none;'>
                             <option disabled = "disabled" selected="selected" value="">Choose Date Time format</option>
                             <option value="HH:mm:ss.SSSZ">HH:MM:SS.SSSZ</option>
                             <option value="MMMM dd, yy">MMMM DD, YYYY</option>
                             <option value="MMM dd, yyyy hh:mm:ss a">MMM dd, yyyy hh:mm:ss a</option>
                             <option value="MMM dd HH:mm:ss ZZZZ yyyy">MMM dd HH:mm:ss ZZZZ yyyy</option>
                             <option value="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'">yyyy-MM-dd'T'HH:mm:ss.SSS'Z'</option>
                             <option value="yyyy-MM-dd'T'HH:mm:ss">YYYY-MM-DD'T'HH:MM:SS</option>
                             <option value="MMM dd, yyyy hh:mm:ss a">MMM DD, YYYY HH:MM:SS AM</option>
                             <option value="dd/MMM/yyyy:HH:mm:ss ZZZZ">DD/MMM/YYYY:HH:MM:SS ZZZZ</option>
                             <option value="MMM dd HH:mm:ss ZZZZ yyyy">MMM DD HH:MM:SS ZZZZ YYYY</option>
                             <option value="MMM dd yyyy HH:mm:ss">MMM DD YYYY HH:MM:SS</option>
                             <option value="MM/dd/yyyy hh:mm:ss a">MM/DD/YYYY HH:MM:SS AM</option>
                             <option value="MM/dd/yyyy hh:mm:ss a:SSS">MM/DD/YYYY HH:MM:SS AM:SSS</option>
                             <option value="MMdd_HH:mm:ss.SSS">MMDD_HH:MM:SS.SSS</option>
                             <option value="MMdd_HH:mm:ss">MMDD_HH:MM:SS</option>
                             <option value="dd MMM yyyy HH:mm:ss*SSS">DD MMM YYYY HH:MM:SS*SSS</option>
                             <option value="dd MMM yyyy HH:mm:ss">DD MMM YYYY HH:MM:SS</option>
                             <option value="dd/MMM/yyyy HH:mm:ss"">DD/MMM/YYYY HH:MM:SS</option>
                             <option value="dd/MMM HH:mm:ss,SSS"">DD/MMM HH:MM:SS,SSS</option>
                        </select>
                        </div>
                        
                        <div id = "dateDiv${field}" style="display: none; margin-left: 0.8%;width:16.0%;">
                          <label class ="required-field"  for="date" id="dateFormats${field}" style='display:none;'></label>
                            <select  class="form-control" name="date" id='date${field}' style='display:none;'>
                                 <option selected="selected" value="">Choose Date Format</option>
                                 <option value="MM-dd-yyyy">MM-DD-YYYY</option>
                                 <option value="dd-MM-yyyy">DD-MM-YYYY</option>
                                 <option value="dd/MM/yyyy, yy">DD/MM/YYYY</option>
                                <option value="yy/MM/dd">YY/MM/DD</option>
                                <option value="yyyy/MM/dd">YYYY/MM/DD</option>
                                <option value="M/d/yyy">M/D/yyy</option>
                                <option value="d/M/yyyy">D/M/YYYY</option>
                                <option value="yyyy/M/dd">YYYY/M/DD</option>
                                <option value="ddMMyYYy">DDMMYYYY</option>
                                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                            </select>
                          </div>

                          <div id = "timeDiv${field}"  style="display: none; margin-left: 0.8%;width:16.0%;">
                            <label class ="required-field"  for="time" style='display:none;' id="timeFormats${field}"</label>
                           <select  class="form-control" name="time" id='time${field}' style='display:none;'>
                                <option value="">Choose Time Format</option>
                                <option value="hh:mm:ss">HH:MM:SS</option>
                                <option value="HH:mm:ss zzz">HH:MM:SS ZZZ</option>
                                <option value="HH:mm:ss.SSSZ">HH:MM:SS.SSSZ</option>
                           </select>
                            </div>
                     
                     
                                            
                     <!-- Modal -->
<div class="modal fade" id="chooseValues${field}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Choose Values</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-container">

          <h6>Upload Values in the form of text file</h6>

<!--          <div id="uploadFileDiv${field}"  class="form-group col-md-8" style="margin-top: 0.4%; display:flex; margin-left: 19%">-->
            <div class="mb-3">
              <input onchange="readFile(event,'${field}');" id="text_file_id${field}" style="display:flex;  accept=".txt" class="form-control" type="file" id="formFile">
            </div>
<!--          </div>-->

          <br><br><br>
          
          <h6 style="font-size: medium;margin-top: -10%">OR</h6>

          <button data-dismiss="modal" style="margin-left: 40%;"  type="button" class="btn btn-primary" data-toggle="modal" data-target="#typeValues${field}">
            Type Values
          </button>

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>



<!-- Modal -->
<div class="modal fade" id="typeValues${field}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Type Values</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-container">

          <textarea style="margin-right: 50%" id="textArea${field}" placeholder="Enter Values"></textarea>
          <div id = "list"> 
          <ul style='font-size:15px;font-family: "Bodoni", serif;margin-left: 47%; margin-top: -42%'>
               <li> Please Enter the values in newline without any delimiters</li> 
               <li> Example:</li>
               <ul>
                   <li> Val1 </li>
                   <li> Val2 </li>
                   <li> Val3 </li>
               </ul>

          </ul>
          </div>
      

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
                     
                  
               
                  </div>
                  </div>
                 `
        var card = document.getElementById("card-2")
        console.log(card.childNodes.length)
        if(card.childNodes.length === 2 || card.childNodes.length === 1){

            document.getElementById("card-2").appendChild(row)
        }
    }

    var name = document.createElement('div');
    row.setAttribute("id", `name`);

    name.innerHTML = `<button style="margin-left:45%; margin-top: 1%; margin-bottom: 1%" class="btn btn-dark" type="submit">Save</button>`
    document.getElementById("card-2").appendChild(name)

}


/*function typeMandatory() {
    var emptyFields = 0
    for (var i = 1, j = 0; i <= fieldCount; i++,j++){
        var typeField = document.getElementById(`type${fields[0][j]}`.replaceAll('"', ''))
        if (typeField.value == ""){
            document.getElementById(`typeEmpty${fields[0][j]}`.replaceAll('"', '')).innerHTML="Please select a type";
            document.getElementById("fields-empty").innerHTML = "You have left mandatory fields empty!"
            emptyFields += 1
        }
        else {
            document.getElementById(`typeEmpty${fields[0][j]}`.replaceAll('"', '')).innerHTML="";
        }
    }
    return (emptyFields == 0)
}*/


function toggleYesOrNo(element) {
    let oldValue = document.getElementById(element).value
    if (oldValue === "Not Allowed") {
        document.getElementById(element).value = "Allowed"
        return
    }
    document.getElementById(element).value = "Not Allowed"
}

function showDateTimeOptions(value, dateDivID, dateFormatId, dateId, timeDivID, timeFormatId, timeId, dateTimeDivID, dateTimeFormatId, dateTimeId, lengthDivId, valueDivId, uploadFileDiv) {
    var dateDivIDElement = document.getElementById(dateDivID);
    var dateFormatElement = document.getElementById(dateFormatId);
    var dateIdFormatElement = document.getElementById(dateId);
    var timeDivIDElement = document.getElementById(timeDivID);
    var timeFormatElement = document.getElementById(timeFormatId);
    var timeIdFormatElement = document.getElementById(timeId);
    var lengthDivElement = document.getElementById(lengthDivId);
    var valueDivElement = document.getElementById(valueDivId);
    var dateTimeDivIDElement = document.getElementById(dateTimeDivID);
    var dateTimeFormatElement = document.getElementById(dateTimeFormatId);
    var dateTimeIdFormatElement = document.getElementById(dateTimeId);
    var uploadFileElement = document.getElementById(uploadFileDiv);

    if (value === 'DateTime') {
        showDateTimeField(uploadFileElement, dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement)
    } else if (value === 'Date') {
        showDateField(dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement)
    } else if (value === 'Time') {
        showTimeField(dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement)
    } else {
        dateDivIDElement.style.display = 'none';
        dateFormatElement.style.display = 'none';
        dateIdFormatElement.style.display = 'none';
        dateTimeDivIDElement.style.display = 'none';
        dateTimeFormatElement.style.display = 'none';
        dateTimeIdFormatElement.style.display = 'none';
        timeDivIDElement.style.display = 'none';
        timeFormatElement.style.display = 'none';
        timeIdFormatElement.style.display = 'none';
        dateTimeDivIDElement.style.display = 'none';
        dateTimeFormatElement.style.display = 'none';
        dateTimeIdFormatElement.style.display = 'none';
        // valueDivElement.style.display = 'flex';
        lengthDivElement.style.display = 'block';
    }
}

function showDateField(dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement) {
    dateDivIDElement.style.display = 'flex';
    dateFormatElement.style.display = 'block';
    dateIdFormatElement.style.display = 'block';
    timeDivIDElement.style.display = 'none';
    timeFormatElement.style.display = 'none';
    timeIdFormatElement.style.display = 'none';
    dateTimeDivIDElement.style.display = 'none';
    dateTimeFormatElement.style.display = 'none';
    dateTimeIdFormatElement.style.display = 'none';
    // valueDivElement.style.display = 'none';
    lengthDivElement.style.display = 'none';
}

function showTimeField(dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement) {
    timeDivIDElement.style.display = 'flex';
    timeFormatElement.style.display = 'block';
    timeIdFormatElement.style.display = 'block';
    dateDivIDElement.style.display = 'none';
    dateFormatElement.style.display = 'none';
    dateIdFormatElement.style.display = 'none';
    dateTimeDivIDElement.style.display = 'none';
    dateTimeFormatElement.style.display = 'none';
    dateTimeIdFormatElement.style.display = 'none';
    // valueDivElement.style.display = 'none';
    lengthDivElement.style.display = 'none';
}

function showDateTimeField(uploadFileDivElement, dateDivIDElement, dateFormatElement, dateIdFormatElement, timeDivIDElement, timeFormatElement, timeIdFormatElement, lengthDivElement, valueDivElement, dateTimeDivIDElement, dateTimeFormatElement, dateTimeIdFormatElement) {
    dateTimeDivIDElement.style.display = 'flex';
    dateTimeFormatElement.style.display = 'block';
    dateTimeIdFormatElement.style.display = 'block';
    // uploadFileDivElement.style.display = 'none';
    dateDivIDElement.style.display = 'none';
    dateFormatElement.style.display = 'none';
    dateIdFormatElement.style.display = 'none';
    timeDivIDElement.style.display = 'none';
    timeFormatElement.style.display = 'none';
    timeIdFormatElement.style.display = 'none';
    // valueDivElement.style.display = 'none';
    lengthDivElement.style.display = 'none';
}

function readFile(event, fieldName) {
    var value = document.getElementById(`text_file_id${fieldName}`).files[0];
    if (value != null) {
        let reader = new FileReader();
        reader.addEventListener('load', function (e) {
            let text = e.target.result
            console.log(JSON.stringify(text.split('\n')))
            localStorage.setItem(fieldName, JSON.stringify(text.split('\n')));
        });
        reader.readAsText(value)
    }
    return null;
}

function addDataToJson() {
    for (var i = 1, j = 0; i <= fieldCount; i++, j++) {
        let jsonObj = {}
        var field = fields[0][j]
        var configName = document.getElementById("fileName")
        var type = document.getElementById(`type${fields[0][j]}`.replaceAll('"', ''))
        var value = document.getElementById(`text_file_id${fields[0][j]}`.replaceAll('"', '')).files[0]
        var typedValues = document.getElementById(`textArea${fields[0][j]}`.replaceAll('"', ''))
        var fixed_len = document.getElementById(`fixed-len${fields[0][j]}`.replaceAll('"', ''))
        var dependentOn = document.getElementById(`dependent${fields[0][j]}`.replaceAll('"', ''))
        var dependentValue = document.getElementById(`dep-val${fields[0][j]}`.replaceAll('"', ''))
        var dateFormat = document.getElementById(`date${fields[0][j]}`.replaceAll('"', ''))
        var timeFormat = document.getElementById(`time${fields[0][j]}`.replaceAll('"', ''))
        var dateTimeFormat = document.getElementById(`dateTime${fields[0][j]}`.replaceAll('"', ''))
        var nullValues = document.getElementById(`allowNull${fields[0][j]}`.replaceAll('"', ''))
        var configCheckBox = document.getElementById("configCheckBox").checked

        jsonObj["configName"] = document.getElementById("fileName").value
        console.log(document.getElementById("fileName").value)
        jsonObj["datetime"] = dateTimeFormat.value
        jsonObj["date"] = dateFormat.value
        jsonObj["time"] = timeFormat.value
        jsonObj["nullValue"] = nullValues.value
        console.log(nullValues.value)
        jsonObj["fieldName"] = field
        jsonObj["type"] = type.value
        if (!configCheckBox) {
            jsonObj["configName"] = ""
        }
        if (value != null) {
            jsonObj["values"] = JSON.parse(localStorage.getItem(field))
            console.log(localStorage.getItem(field))
        }
        if (typedValues.value !== '') {
            jsonObj["values"] = typedValues.value.split('\n')
        }
        jsonObj["length"] = fixed_len.value
        jsonObj["dependentOn"] = dependentOn.value
        jsonObj["dependentValue"] = dependentValue.value
        const typeValue = type.value
        if (typeValue !== "Date" && typeValue !== "Time" && typeValue !== "DateTime") {
            jsonObj["datetime"] = ''
            jsonObj["date"] = ''
            jsonObj["time"] = ''
        } else if (typeValue === "Date") {
            jsonObj["datetime"] = ''
            jsonObj["length"] = ''
            jsonObj["time"] = ''
        } else if (typeValue === "Time") {
            jsonObj["datetime"] = ''
            jsonObj["date"] = ''
            jsonObj["length"] = ''
        } else if (typeValue === "DateTime") {
            jsonObj["length"] = ''
            jsonObj["date"] = ''
            jsonObj["time"] = ''
        }

        payload.push(jsonObj)
    }
    console.log(payload)
}

async function sendConfigData() {
    addDataToJson()
    var resp = await fetch('add-meta-data', {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (resp.status === 200) {
        var jsonData = await resp.json();
        console.log(jsonData)
    }
}

async function displayErrors() {
    emptyErrorList()
    document.getElementById("config_name_validation").style.display = 'none';
    if (validateConfigName()) {
        document.getElementById("fields-empty").innerHTML = ""
        loadingEffect()
        sendConfigData()
        const response = await fetch('csv', {
            method: 'POST',
            body: JSON.stringify(result)
        })

        if (response.status === 200) {
            var jsonData = await response.json();
            loadingEffect();
            console.log(jsonData)
            traverse(jsonData)
        }
        var loader = document.getElementById("button-load")
        loader.style.visibility = "hidden";
        payload = []
        configName = []
    }
}

function traverse(object) {
    let errorBase = document.getElementById("error-msgs");
    for (var i in object) {
        let key = Object.keys(object[i])[0]
        console.log(key)
        key = key.replaceAll('"', '')
        let value = Object.values(object[i])
        createDivElement(key, value[0])
        let fieldsDivElement = document.getElementById(`${key}`)
        if (fieldsDivElement.innerHTML === '') {
            removeErrorDiv(key)
        }
    }
    if (errorBase.innerHTML === '') {
        createSuccessErrMsg(errorBase)
    }
}

function createSuccessErrMsg(errorBase) {
    let row = document.createElement("div");
    row.innerHTML = `
        <div style="display:flex; flex-direction: row;padding:20px;">
          <div style="width: 92%;font-size:20px; font-weight:400; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);  border-radius: 3px;  padding:38px; text-align:left;color:white;margin:auto">
          <marquee scrollamount="12">No Error Found In Your CSV File</marquee>
          </div>
      </div>`;

    errorBase.appendChild(row);
}

function removeErrorDiv(key) {
    let errorBase = document.getElementById("error-msgs");
    var child = document.getElementById(key + " error");
    errorBase.removeChild(child);
}

function createDivElement(key, value) {
    key = key.replaceAll('"', '')
    let errorBase = document.getElementById("error-msgs");
    let row = document.createElement("div");
    row.setAttribute("id", key + " error")
    row.innerHTML = `
                <div style="display:flex; flex-direction: row;padding:20px;width:700px">
                  <div style="width: 150%;font-size:20px; font-weight:400; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);  border-radius: 3px;  padding:18px; text-align:left;color:white;margin:auto">
                  <p style="margin:auto;">${key}
                  <svg  style="float:right;" width="15" height="25" viewBox="0 0 9 7" fill="black" xmlns="http://www.w3.org/2000/svg" >
                  <path style="display:block;z-index:-1" d="M5.81565 1.5L4.4261 3.75802L2.86285 1.5H5.81565Z" stroke="black" stroke-width="4" onclick="goUp('${key}')" id="UpDrop${key}"/>
                  </svg>
                  </p>
                  </div>
              </div>
              <div class="card-panel left-align" style=" width:63%; font-size:20px;font-weight:200;
                background: radial-gradient(
            hsl(30, 41%, 48%),
            hsl(199, 14%, 49%)
    ) fixed ; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); border-radius: 3px; padding:50px;
              text-align:left; color:black; display:none;width: 100%;margin-left: 20%;border-radius: 9px;"
              id="${key}"></div>
          </div>
        `;

    errorBase.appendChild(row)
    for (i in value) {
        console.log(value[i].length)
        if (i === 'Duplicate Errors' && value[i].length !== 0 && document.getElementById("Duplicate Errors error") === null) {
            createDuplicationErrMsg(value[i], i)
        }
        console.log(i)
        if (value[i].length !== 0 && i !== 'Duplicate Errors') {
            createTableForDisplayingErrorMsg(value[i], key, i)
        }
    }
}

function createDuplicationErrMsg(value, key) {
    let errorBase = document.getElementById("error-msgs");
    let row = document.createElement("div");
    row.setAttribute("id", key + " error")
    row.innerHTML = `
        <div style="display:flex; flex-direction: row;padding:20px;">
          <div style="width: 92%;font-size:20px; font-weight:400; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);  border-radius: 3px;  padding:18px; text-align:left;color:white;margin:auto">
          <p style="margin:auto;">${key}
          <svg  style="float:right;" width="15" height="25" viewBox="0 0 9 7" fill="black" xmlns="http://www.w3.org/2000/svg" >
          <path style="display:block;z-index:-1" d="M5.81565 1.5L4.4261 3.75802L2.86285 1.5H5.81565Z" stroke="black" stroke-width="4" onclick="goUp('${key}')" id="UpDrop${key}"/>
          </svg>
          </p>
          </div>
      </div>
      <div class="card-panel left-align" style="margin:auto; width:83%; font-size:20px; font-weight:200;  background: radial-gradient(
            hsl(30, 41%, 48%),
            hsl(199, 14%, 49%)
    ) fixed;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); border-radius: 3px; padding:50px; text-align:left; color:black; display:none;
      "
      id="${key}"></div>
      </div>
    `;

    errorBase.appendChild(row)
    createTableForDuplicateErrors(value, key)
}

function createTableForDuplicateErrors(value, key) {
    let p = document.createElement("p")
    p.setAttribute("id", "error")
    p.style.marginTop = "0px"
    p.innerHTML = `<b style="font-weight: 900;">${key} present in rows:</b><br/><br/>`
    let table = document.createElement("table")
    console.log(table)
    let i = 0;
    console.log("size", value.length)
    let firstRow = document.createElement("tr");
    let firstHeading = document.createElement("td")
    let secondHeading = document.createElement("td")
    firstHeading.innerHTML = "Row Number "
    secondHeading.innerHTML = "Copied From Row Number"
    firstRow.appendChild(firstHeading);
    firstRow.appendChild(secondHeading);
    table.appendChild(firstRow)
    while (i < value.length) {
        let newRow = document.createElement("tr");
        let td_1 = document.createElement("td")
        let td_2 = document.createElement("td")
        td_1.innerHTML = value[i]
        td_2.innerHTML = value[i + 1]
        newRow.appendChild(td_1);
        newRow.appendChild(td_2);
        table.appendChild(newRow)
        i = i + 2;
    }

    p.appendChild(table)
    let parent = document.getElementById(`${key}`)
    parent.appendChild(p)
}

function createTableForDisplayingErrorMsg(value, key, type) {
    let p = document.createElement("p")
    p.setAttribute("id", "error")
    p.style.marginTop = "0px"
    p.innerHTML = `<b style="font-weight: 900;">${type} present in rows:</b><br/><br/>`
    let table = document.createElement("table")
    console.log(table)
    let i = 0;
    let j = 0;
    console.log("size", value.length)
    while (i < value.length) {
        let newRow = document.createElement("tr");
        while (j < i + 5 && j < value.length) {
            let td = document.createElement("td")
            td.innerHTML = value[j]
            newRow.appendChild(td);
            j++;
        }
        table.appendChild(newRow)
        i = j;
    }
    p.appendChild(table)
    let parent = document.getElementById(`${key}`)
    parent.appendChild(p)
}

function goDown(key) {
    document.getElementById(`DownDrop${key}`).outerHTML = `<path style="display:block;z-index:-1" d="M5.81565 1.5L4.4261 3.75802L2.86285 1.5H5.81565Z" stroke="black" stroke-width="4" onclick="goUp('${key}')" id="UpDrop${key}"/>`
    document.getElementById(`${key}`).style.display = "none"
}

function goUp(key) {
    document.getElementById(`UpDrop${key}`).outerHTML = `  <path d="M5.81565 5L4.4261 2.74198L2.86285 5H5.81565Z" stroke="black" stroke-width="4" onclick="goDown('${key}')" id="DownDrop${key}"/>`
    document.getElementById(`${key}`).style.display = "block"
}


function emptyErrorList() {
    const el = document.getElementById("error-msgs");
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

function loadingEffect() {
    var loader = document.getElementById("button-load")
    loader.style.visibility = "visible";
}