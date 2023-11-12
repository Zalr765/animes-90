const fs = require('fs');
const data = fs.readFileSync('modules/videoID.json');
const jsonContent = JSON.parse(data);
function addVideo (name, file_id)  {
    var lang = "rus"
    var num = name.substring(name.length-4, name.length-6)
    num = parseInt(num) - 1
    nname = name.slice(3, name.length-6)
    if("jap" === name.slice(0, 3)){
        lang = "jap"
        
    }
    for( e in jsonContent.anime)  {
        if(nname === jsonContent.anime[e].name){
            console.log(jsonContent.anime[e].vol[num].jap_id)
            if(lang === "rus"){
                jsonContent.anime[e].vol[num].id = file_id
                var updatedJson = JSON.stringify(jsonContent, null, 2)
                fs.writeFileSync('modules/videoID.json', updatedJson)
                console.log("Название " +  nname + " добавлена серия №" + `${num+1}`+ " язык " + lang)
                return
                
            }
            else if (lang ===  "jap"){
                jsonContent.anime[e].vol[num].jap_id = file_id
                var updatedJson = JSON.stringify(jsonContent, null, 2)
                fs.writeFileSync('modules/videoID.json', updatedJson)
                console.log("Название " +  nname + " добавлена серия №" + `${num+1}` + " язык " + lang)
                return
            }
            else{
                throw new Error("Ошибка file_id")
            }
        }
    }
}

module.exports = addVideo