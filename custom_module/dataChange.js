
function dataChange(params) {
    
 // It's simple multyple bpi function

    let newNode = {};
    Object.entries(params.bpi).forEach(([key, val]) => (newNode[key] = val * 1000));

    params.bpi = newNode;


    return params
}

module.exports = dataChange;