d3.csv('./data/candy.csv', function(error, dataset){
    if(error) {
        console.error('Error while loading candy csvdataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    nested = d3.nest()
        .key(function (d) {
            return d.Q4_COUNTRY;
        })
        .entries(dataset);

    console.log(nested);



});
