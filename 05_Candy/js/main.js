/*
    Four Regions across US
    Note about data, Delware not in
 */
var Northeast = ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'New Jersey', 'New York', 'Pennsylvania',
    'Rhode Island', 'Vermont'];

var Midwest = ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska',
    'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin' ];


var South = ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Maryland', 'Mississippi',
    'North Carolina', 'Oklahoma', 'South Carolina',  'Tennessee', 'Texas', 'Virginia', 'Washington DC','West Virginia'];

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

var Trail_Mix = ['Q6_Trail_Mix'];



var chocolateData = 0;

var dataset = null;

var data_by_region_age_gender = null;



function get_candy_category(candy_string) {
  if (Chocolate.includes(candy_string)) {
    return "Chocolate";
  } else if (Fruit.includes(candy_string)) {
      return "Fruit";
  } else if (Other.includes(candy_string)) {
      return "Other";
  } else if (Gum.includes(candy_string)) {
      return "Gum";
  } else if (Licorice.includes(candy_string)) {
      return "Licorice";
  } else if (Trail_Mix.includes(candy_string)) {
      return "Trail Mix";
  }
}

function get_region(state) {
  if (Northeast.includes(state)) {
    return "Northeast";
  } else if (Midwest.includes(state)) {
    return "Midwest";
  } else if (South.includes(state)) {
    return "South";
  } else if (West.includes(state)) {
    return "West";
  }
  return "NA";
}

function get_age_group(age) {
  if (age < 18 ) {
    return "6-17";
  } else if (age < 35) {
    return "18-34";
  } else if (age < 60) {
    return "35-59";
  }
  return "60+";
}

function get_joy_value(joy_string) {
  if (joy_string == "JOY") {
    return 1.;
  } else if (joy_string == "MEH") {
    return 0.;
  }
  return -1.;
}

function get_category_joy(entry, category) {
  return d3.mean(category, function(d) {
     return get_joy_value(entry[d]);
  })
}

function get_joy_percentage(joy_value) {
  return (joy_value + 1)/2.
}

d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    var i = 0;
    //console.log(__dataset);
    dataset = __dataset

    data_by_region_age_gender =
      d3.nest()
        .key(function(d) {
          return get_region(d.Q5_STATE_PROVINCE_COUNTY_ETC);
        })
        .key(function(d) {
          return get_age_group(d.Q3_AGE);
        })
        .key(function(d) {
          return d.Q2_GENDER;
        }).entries(dataset);

    console.log(data_by_region_age_gender)
    console.log(get_category_joy(dataset[0], Chocolate))

    // data_by_state = d3.nest()
    //     .key(function (d) {
    //         //return d.Q3_AGE;
    //         return d.Q5_STATE_PROVINCE_COUNTY_ETC;
    //     }).sortKeys(d3.ascending)
    //     // .key(function (d) {
    //     //     return d.Q2_GENDER;
    //     // })
    //     // .key(function (d) {
    //     //     return d.Q3_AGE;
    //     // }).sortKeys(d3.ascending)
    //     // .rollup(function (d,i) {
    //     //     return {
    //     //         butterfingers : d.map(function (d) {
    //     //             if (d.Q6_Butterfinger == "JOY") {
    //     //                 joy++;
    //     //             } else if (d.Q6_Butterfinger == "DESPAIR") {
    //     //                 joy--;
    //     //             }
    //     //             var joyname = joy;
    //     //             joy = 0;
    //     //             return joyname;
    //     //         })
    //     //     };
    //     // })
    //     .entries(dataset);
    //
    // console.log(data_by_state);

    /**
    Uncomment setup!!
    **/
    //setup();
});

function setup() {
    //
    // filterNE = data_by_state.filter(function (d,i) {
    //     if (Northeast.includes(d.key)) {
    //         return d.key;
    //     }
    // });

    // filterMW = data_by_state.filter(function (d,i) {
    //     if (Midwest.includes(d.key)) {
    //         return d.key;
    //     }
    // });
    //
    // filterS = data_by_state.filter(function (d,i) {
    //     if (South.includes(d.key)) {
    //         return d.key;
    //     }
    // });
    //
    // filterW = data_by_state.filter(function (d,i) {
    //     if (West.includes(d.key)) {
    //         return d.key;
    //     }
    // });

    console.log('Northeast');
    //console.log(Northeast.length);
    console.log(filterNE);

    // console.log('Midwest');
    // //console.log(Midwest.length);
    // console.log(filterMW);
    //
    // console.log('South');
    // //console.log(South.length);
    // console.log(filterS);
    //
    // console.log('West');
    // //console.log(West.length);
    // console.log(filterW);

    /*
    Getting the NorthEast Data
     */





    /*
        Bins for the ages
        Range: 6 to 99

        Bin1:  6 to 17
        Bin2: 18 to 34
        Bin3: 35 to 59
        Bin4: 60 to 99
     */
    var bin1Male = 0;
    var bin2Male = 0;
    var bin3Male = 0;
    var bin4Male = 0;

    var bin1Female = 0;
    var bin2Female = 0;
    var bin3Female = 0;
    var bin4Female = 0;




    for ( i=0; i<Northeast.length; i++) {
        //console.log(filterNE[i].values.length);

        //console.log(filterNE[i].values[i].Q2_GENDER);

        for ( j=0; j<filterNE[i].values.length; j++) {
            var gender = filterNE[i].values[j].Q2_GENDER;
            var age = filterNE[i].values[j].Q3_AGE;


            if (gender == "Male") {
                if (age <= 17 ) {
                    bin1Male++;
                } else if (age <=34) {
                    bin2Male++;
                } else if (age <= 59) {
                    bin3Male++;
                } else {
                    candyCounter();
                    bin4Male++;
                }
            } else if (gender == "Female"){
                if (age <= 17 ) {
                    bin1Female++;
                } else if (age <=34) {
                    bin2Female++;
                } else if (age <= 59) {
                    bin3Female++;
                } else {
                    bin4Female++;
                }
            }
        }

    }

    console.log(chocolateData);

    // console.log(bin1Male);
    // console.log(bin2Male);
    // console.log(bin3Male);
    // console.log(bin4Male);
    //
    // console.log(bin1Female);
    // console.log(bin2Female);
    // console.log(bin3Female);
    // console.log(bin4Female);
    d3.graphScroll()
        .sections(d3.selectAll('#sections > div'))
        .on('active', function(i){ console.log(i + 'th section active') })

}

// var Chocolate = ['Q6_Butterfinger', 'Q6_Heath_Bar', 'Q6_Hershey_s_Dark_Chocolate', 'Q6_Hershey_s_Milk_Chocolate',
//     'Q6_Hershey_s_Kisses', 'Q6_Junior_Mints', 'Q6_Kit_Kat', 'Q6_Milk_Duds', 'Q6_Milky_Way', 'Q6_Regular_M_Ms',
//     'Q6_Peanut_M_M_s', 'Q6_Mint_Kisses', 'Q6_Mr_Goodbar', 'Q6_Nestle_Crunch', 'Q6_Reese_s_Peanut_Butter_Cups',
//     'Q6_Reese_s_Pieces', 'Q6_Rolos', 'Q6_Snickers', 'Q6_Three_Musketeers', 'Q6_Tolberone_something_or_other',
//     'Q6_Twix', 'Q6_Whatchamacallit_Bar', 'Q6_York_Peppermint_Patties'];

function candyCounter(){
    var level = filterNE[i].values[j].Q6_Butterfinger;
    if (level == "JOY") {
        chocolateData++;
    } else if(level == "DESPAIR") {
        chocolateData--;
    }
}






















//
