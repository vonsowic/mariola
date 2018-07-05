const request = require('axios');


function download(url){
    let date = new Date();
    return request.get(url, {
        params: {
            start: `${date.getFullYear()-1}-01-01`,
            end: `${date.getFullYear()+1}-01-31`
        }
    })
}

function parse(eaiibCourseItems) {
    return eaiibCourseItems
        .data
        .map(convertFromEAIIBFormat)
        .reduce(
            (plan, item) => {
                const k = key(item);
                if(plan[k]){
                    let collectedDetails = plan[k].coursesDetails;
                    collectedDetails = collectedDetails.concat(item.coursesDetails);
                    item.coursesDetails = collectedDetails
                }

                return Object.assign({}, plan, {[k]: item})
            },
            {})
}

const convertFromEAIIBFormat = item => {
    let title = parseTitleField(item.title);
    return {
        name: title[0],
        group: item.group.toString().replace('.1', 'a').replace('.2', 'b'),
        other: title[1],
        coursesDetails: [{
            start: item.start.toLocaleString(),
            end: item.end.toLocaleString()
        }]
    }
};

function parseTitleField(it){
    if(it.includes("Informacja")){
        it = it.substring(0, it.indexOf("Informacja"))
    }

    return it
        .replace(/<br\/>/g, ',')
        .split(/,(.+)/);
}

function key(obj){
    return `${obj.name}&&&${obj.group}`
}


module.exports= url => download(url).then(res => Object.values(parse(res)));