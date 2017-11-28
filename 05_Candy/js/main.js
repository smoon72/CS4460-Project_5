/*
    Four Regions across US
    Note about data, Delware not in
 */



var Northeast = ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'New Jersey', 'New York', 'Pennslyvania',
    'Rhode Island', 'Vermont'];

var Midwest = ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska',
    'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin' ];


var South = ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Maryland', 'Mississippi',
    'North Carolina', 'Oklahoma', 'South Carolina',  'Tennessee', 'Texas', 'Virginia', 'West Virginia'];

var West = ['Alaska', 'Arizona', 'California', 'Colorado', 'Hawaii', 'Idaho', 'Montana', 'Nevada', 'New Mexico',
    'Oregon', 'Utah', 'Washington', 'Wyoming'];


/*
    Candy Categories
 */
var Chocolate = ['Q6_Butterfinger', 'Q6_Heath_Bar', 'Q6_Hershey_s_Dark_Chocolate', 'Q6_Hershey_s_Milk_Chocolate',
'Q6_Hershey_s_Kisses', 'Q6_Junior_Mints', 'Q6_Kit_Kat', 'Q6_Milk_Duds', 'Q6_Milky_Way', 'Q6_Regular_M_Ms',
'Q6_Peanut_M_M_s', 'Q6_Mint_Kisses', 'Q6_Mr_Goodbar', 'Q6_Nestle_Crunch', 'Q6_Reese_s_Peanut_Butter_Cups',
'Q6_Reese_s_Pieces', 'Q6_Rolos', 'Q6_Snickers', 'Q6_Three_Musketeers', 'Q6_Tolberone_something_or_other',
'Q6_Twix', 'Q6_Whatchamacallit_Bar', 'Q6_York_Peppermint_Patties'];

var Fruit = ['Q6_Fuzzy_Peaches', 'Q6_Gummy_Bears_straight_up', 'Q6_Jolly_Rancher_bad_flavor',
'Q6_Jolly_Ranchers_good_flavor', 'Q6_LaffyTaffy', 'Q6_LemonHeads', 'Q6_Mike_and_Ike',
'Q6_Nerds', 'Q6_Pixy_Stix', 'Q6_Skittles', 'Q6_Sourpatch_Kids_i_e_abominations_of_nature',
'Q6_Starburst', 'Q6_Healthy_Fruit'];

var Other = ['Q6_Candy_Corn', 'Q6_Lollipops', 'Q6_Peeps', 'Q6_Swedish_Fish'];

var Gum = ['Q6_Chiclets', 'Q6_Dots', 'Q6_Tic_Tacs'];

var Licorice = ['Q6_Good_N_Plenty', 'Q6_Licorice_not_black', 'Q6_Licorice_yes_black'];

var Trail_Mix = ['Trail Mix:'];






d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    //console.log(__dataset);
    dataset = __dataset
    data_by_state = d3.nest()
        .key(function (d) {
            return d.Q5_STATE_PROVINCE_COUNTY_ETC;
        })
        .entries(dataset);

    console.log(data_by_state);
    setup();
});

function setup() {

    var filterNE = data_by_state.filter(function (d,i) {
        if (Northeast.includes(d.key)) {
            return d.key;
        }
    });

    var filterMW = data_by_state.filter(function (d,i) {
        if (Midwest.includes(d.key)) {
            return d.key;
        }
    });

    var filterS = data_by_state.filter(function (d,i) {
        if (South.includes(d.key)) {
            return d.key;
        }
    });

    var filterW = data_by_state.filter(function (d,i) {
        if (West.includes(d.key)) {
            return d.key;
        }
    });

    console.log('Northeast');
    console.log(Northeast.length);
    console.log(filterNE);

    console.log('Midwest');
    console.log(Midwest.length);
    console.log(filterMW);

    console.log('South');
    console.log(South.length);
    console.log(filterS);

    console.log('West');
    console.log(West.length);
    console.log(filterW);

    /*
    Getting the NorthEast Data
     */
    // var maleCount = 0;
    // var femaleCount = 0;
    //
    // for (var i=0; i<Northeast.length; i++) {
    //
    // }


}
























//