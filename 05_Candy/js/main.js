/*
    Four Regions across US
    Note about data, Delware not in
 */

var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var chartWidth = 600;
var chartHeight = 400;

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
'Q6_Twix', 'Q6_Whatchamacallit_Bars', 'Q6_York_Peppermint_Patties'];

var Fruit = ['Q6_Fuzzy_Peaches', 'Q6_Gummy_Bears_straight_up', 'Q6_Jolly_Rancher_bad_flavor',
'Q6_Jolly_Ranchers_good_flavor', 'Q6_LaffyTaffy', 'Q6_LemonHeads', 'Q6_Mike_and_Ike',
'Q6_Nerds', 'Q6_Pixy_Stix', 'Q6_Skittles', 'Q6_Sourpatch_Kids_i_e_abominations_of_nature',
'Q6_Starburst', 'Q6_Healthy_Fruit'];

var Other = ['Q6_Candy_Corn', 'Q6_Lollipops', 'Q6_Peeps', 'Q6_Swedish_Fish'];

var Gum = ['Q6_Chiclets', 'Q6_Dots', 'Q6_Tic_Tacs'];

var Licorice = ['Q6_Good_N_Plenty', 'Q6_Licorice_not_black', 'Q6_Licorice_yes_black'];

var Trail_Mix = ['Q6_Trail_Mix'];

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
      return "Trail_Mix";
  }
}

function get_region(state) {
  if (Northeast.includes(state)) {
    return "Northeast";
  } else if (Midwest.includes(state)) {
    return "Midwest";
  } else if (West.includes(state)) {
    return "Owest";
  } else if (South.includes(state)) {
      return "South";
  }
}

var age_groups = ["6-17", "18-34", "35-59", "60+"]

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
      //console.log(d);
      //console.log(entry[d]);
     return get_joy_value(entry[d]);
  })
}

function get_joy_percentage(joy_value) {
  return (joy_value + 1)/2.
}

var candy_counter = 0;

var choco_arr = [];
var fruit_arr = [];
var other_arr = [];
var gum_arr = [];
var licorice_arr = [];
var trail_mix_arr = [];

/*
    Keep track of number of values
 */
var choco_amount = [];
var fruit_amount = [];
var other_amount = [];
var gum_amount = [];
var licorice_amount = [];
var trail_mix_amount = [];


var regions_names = null;
var categories_names = null;
var categories_amount = null;
var candy_categories_names = null;


d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }

    dataset = __dataset;

    data_by_region_age_gender = d3.nest()
        .key(function(d) {
          return get_region(d.Q5_STATE_PROVINCE_COUNTY_ETC);
        }).sortKeys(d3.ascending)
        .key(function(d) {
          return get_age_group(d.Q3_AGE);
        })
        .key(function(d) {
          return d.Q2_GENDER;
        }).sortKeys(d3.descending)
        .entries(dataset);

     console.log(data_by_region_age_gender);

    for (var a=0; a<data_by_region_age_gender.length; a++) {
        for (var b=0; b<data_by_region_age_gender[a].values.length; b++) {
            for (var c=0; c<data_by_region_age_gender[a].values[b].values.length; c++) {

                var c_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Chocolate);
                });
                choco_arr.push(c_num);
                choco_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);

                var fruit_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Fruit);
                });
                fruit_arr.push(fruit_num);
                fruit_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var other_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Other);
                });
                other_arr.push(other_num);
                other_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var gum_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Gum);
                });
                gum_arr.push(gum_num);
                gum_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var licorice_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Licorice);
                });
                licorice_arr.push(licorice_num);
                licorice_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var trail_mix_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Trail_Mix);
                });
                trail_mix_arr.push(trail_mix_num);
                trail_mix_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);



            }
        }

    }


      /*
          Slicing data into its respective regions
       */
      regions_names = ['NE', 'MW', 'W', 'S'];
      categories_names = [choco_arr, fruit_arr, other_arr, gum_arr, licorice_arr, trail_mix_arr];
      categories_amount = [choco_amount, fruit_amount, other_amount, gum_amount, licorice_amount, trail_mix_amount];
      candy_categories_names = ['Chocolate', 'Fruit', 'Other', 'Gum', 'Licorice', 'Trail_Mix'];

      var button_container_select = svg.selectAll("g.radio")
        .data([0])
        var button_container = button_container_select.enter()
          .append("g")
          .attr("class", "radio")
          .attr("transform", "translate(100,900)")
        var button_category_select = button_container.selectAll(".button_category").data(candy_categories_names)
        var button_category_group = button_category_select.enter()
        .append("g")
        .attr("class", "button_category")
        .style("cursor","pointer")
        .on("click",function(d,i) {
            console.log("hey ya!")
            drawMeanChart(i)
        })
        .attr("transform", function (d, i) { return "translate("+ (200)*i +",0)";})
        var button_circle = button_category_group.selectAll("image").data([0]).enter().append("image")
        button_circle
        //.attr("r", 20)
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", -20)
        .attr("xlink:href", "images/candy-cane-clipart-blue-candy-3.png")
        var button_label = button_category_group.append("text")
        button_label
        .attr("class","buttonText")
        .text(function(d) {return d;})
        .attr("text-anchor","middle")
        .attr("transform", "translate(0,-30)")

      drawMeanChart(0)
      drawMeanChart(0)
      drawMeanChart(0)
      d3.graphScroll(0)
      	.graph(d3.selectAll('#graph'))
      	.container(d3.select('#container'))
        .sections(d3.selectAll('#sections > div'))
        .on('active', function(i){
          if (i < 6) {
            console.log(i + 'th section active') ;
          }
        })








});


function drawMeanChart(scroll_number) {



  /*
      Candy Selector
   */
  console.log(scroll_number);


  var candy_name = candy_categories_names[scroll_number];
  var all_selected = categories_names[scroll_number];
  var all_amount_selected = categories_amount[scroll_number];

  console.log(all_selected)

  var bar_data = [];
  for (var i=0; i<4; i++) {
      bar_data.push({
          key: regions_names[i],
          value: {


              bar_value: all_selected.slice(i * 8, i * 8 + 8),

              amount_of_people: all_amount_selected.slice(i * 8, i * 8 + 8)

          }
      });
  }
  console.log(bar_data);

  /*
      Getting all the information into the all array
   */

  var all_array = [0,0,0,0,0,0,0,0];
  var num_array = [0,0,0,0,0,0,0,0];
  for (var j=0; j<32; j++) {
      all_array[j%8] = all_array[j%8] + all_selected[j];
      num_array[j%8] = num_array[j%8] + all_amount_selected[j];
  }

  for (var k =0; k<all_array.length; k++) {
      all_array[k] = all_array[k]/4;
  }

  /*
   X and Y axis for the bar chart
   */

  yScale = d3.scaleLinear()
      .range([chartHeight-40,0])
      .domain([-1, 1]);

  xScale = d3.scaleLinear()
      .range([0,chartWidth-170])
      .domain([-1, 1]);

  /*
      Rectangle
   */

  var padding = {t: 10, r: 20, b: 10, l: 40};
  var dum = ['A', 'B', 'C', 'D'];

  var all = [1];

  /*
      Regions rectangle
   */

  var bg_select = svg.selectAll('.background')
      .data(dum)

      bg_select.enter()
      .append('rect')
      .attr('class', 'background')

      bg_select.exit().remove()

      bg_select
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('transform', function(d, i) {
          var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
          var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t;
          return 'translate('+[tx, ty]+')';
      })
      .style('fill', 'white');



      /*
          Y and X Axis
       */

  xAxis = d3.axisBottom(xScale).ticks(0);
  yAxis = d3.axisLeft(yScale).ticks(8);

  var trellisG_select = svg.selectAll('.trellis')
      .data(data_by_region_age_gender)

      var trellisG_enter = trellisG_select.enter()
      .append('g')
      .attr('class', 'trellis')
      trellisG_enter.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
          .call(xAxis);
      trellisG_enter.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(10,10)')
          .call(yAxis);
      trellisG_enter.append('text')
              .attr('class', 'CardinalTitle')
              .attr("font-size", 30)
              .attr('transform', 'translate(' + [170,40] + ')')
              .text(function (d) {
                  if (d.key == 'Owest') {
                      return 'West'
                  }
                  return d.key;
              })
      trellisG_select.exit().remove()
      trellisG_select
      .attr('transform', function (d, i) {
          // Use indices to space out the trellis groups in 2x2 matrix
          var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
          var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t;
          return 'translate(' + [tx, ty] + ')';
      });

  /*
      All category rectangle
   */
  svg.selectAll('.all_rect')
      .data(all)
      .enter()
      .append('rect')
      .attr('class', 'all_rect')
      .attr('width', chartWidth-20)
      .attr('height', chartHeight)
      .attr('transform', 'translate(1300,10)')
      .style('fill', 'white');

  var all_rect = svg.selectAll('.all')
      .data(all)
      .enter()
      .append('g')
      .attr('class', 'all')
      .attr('transform','translate(1300,10)');


  /*
      Axes for Regions
   */
  // trellisG_select.append('g')
  //     .attr('class', 'x axis')
  //     .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
  //     .call(xAxis);
  // trellisG_select.append('g')
  //     .attr('class', 'y axis')
  //     .attr('transform', 'translate(10,10)')
  //     .call(yAxis);
  /*
   Axes for All
   */

  all_rect.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
      .call(xAxis);

  console.log(data_by_region_age_gender)
  // var x0 = d3.scaleBand()
  //     .rangeRound([0, width])
  //     .paddingInner(0.1);
  //   x0.domain(data.map(function(d) { return d.State; }));
  //
  all_rect.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(10,' + (chartHeight-10) + ')')
          .call(xAxis);
  all_rect.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(10,' + 10 + ')')
      .call(yAxis);

  /*
      Appending the group to the rectangles
   */

  var trellisSelection = svg.selectAll('.tSelections').data(bar_data)

  trellisSelection.enter()
      .append('g')
      .attr('class', 'tSelections')

  trellisSelection.exit().remove()

  trellisSelection.attr('transform', function (d, i) {
      // Use indices to space out the trellis groups in 2x2 matrix
      var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
      var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t + 5;
      return 'translate(' + [tx, ty+5] + ')';
  })


  /*
      Appending the rectangles
   */
  var rect_selection = trellisSelection.selectAll('.candyrect')
      .data(function (d) {
          return d.value.bar_value;
      })
  //static attributes for new elements
  rect_selection.enter()
      .append('rect')
      .attr('class', 'candyrect')
      .attr('width', 40)

  rect_selection.exit().remove()
  // changing attributes below
  rect_selection.attr('x',  function (d,i) {
      if (i<=1) {
          return i*40 + 30;
      } else if (i<=3) {
          return i*40 + 60;
      } else if (i<=5) {
          return i*40 + 90;
      } else {
          return i*40 + 120;
      }
  })
  .attr('y', function (d) {
      if (d > 0) {
          return yScale(d);
      } else {
          return yScale(0);
      }
  })
  .attr('height', function (d) {
      return Math.abs(yScale(d)- yScale(0));
  }).style('fill', function (d,i) {
      if (i%2==0) {
          return '#00BFFF';
      } else {
          return 'pink';
      }
  })


  // var text_selection = trellisSelection.selectAll('text.trellis_text')
  //     .data(function (d) {
  //         return d.value.amount_of_people;
  //     })
  // //add non-changing attributes to new elements
  //     var text_enter = text_selection.enter()
  //     .append('text')
  //     .attr("class", "trellis_text")
  //     text_selection.exit().remove()
  //     text_enter.text(function (d) {
  //         return d;
  //     })
  //     .attr('x',  function (d,i) {
  //         //console.log(d);
  //         if (i<=1) {
  //             return i*40 + 30;
  //         } else if (i<=3) {
  //             return i*40 + 60;
  //         } else if (i<=5) {
  //             return i*40 + 90;
  //         } else {
  //             return i*40 + 120;
  //         }
  //     })
  //     .text(function (d) {
  //         return d;
  //     }).style('fill', function (d,i) {
  //         if (i%2 == 0) {
  //             return 'grey'
  //         }
  //     }).attr('transform', 'translate(13,205)')

  var all_Selection = svg.selectAll('.allSelections')
            .data(all)
        all_Selection.enter()
            .append('g')
            .attr('class', 'allSelections')
            .attr('transform', 'translate(1300,20)');
        all_Selection.exit().remove()

  var all_rect = all_Selection.selectAll('.allrect')
      .data(all_array)
      all_rect.enter()
      .append('rect')
      .attr("class", "allrect")
      all_rect.exit().remove()
      all_rect.attr('x',  function (d,i) {
          if (i<=1) {
              return i*40 + 30;
          } else if (i<=3) {
              return i*40 + 60;
          } else if (i<=5) {
              return i*40 + 90;
          } else {
              return i*40 + 120;
          }
      })
      .attr('y', function (d) {
          if (d > 0) {
              return yScale(d);
          } else {
              return yScale(0);
          }
      })
      .attr('height', function (d) {
          return Math.abs(yScale(d)- yScale(0));
      })
      .attr('width', 40)
      .style('fill', function (d,i) {
          if (i%2==0) {
              return '#00BFFF';
          } else {
              return 'pink';
          }
      });

  var all_pop_txt = all_Selection.selectAll('.all_pop')
      .data(num_array)
      all_pop_txt.enter()
      .append('text')
      .attr("class", "all_pop")
      .attr('x',  function (d,i) {
          //console.log(d);
          if (i<=1) {
              return i*40 + 30;
          } else if (i<=3) {
              return i*40 + 60;
          } else if (i<=5) {
              return i*40 + 90;
          } else {
              return i*40 + 120;
          }
      })
      all_pop_txt.exit().remove()
      all_pop_txt.text(function (d) {
          return d;
      })
      .attr('transform', 'translate(13,205)');


  /*
      Labels on the graph
   */

  var all_title_select = all_Selection.selectAll("text.AllTitle").data([0])
      all_title_select.enter()
      .append('text')
      .attr('class', 'AllTitle')
      .attr('transform', 'translate(' + [170,40] + ')')
      .text('All');

  var candy_txt_select = all_Selection.selectAll("text.candyTitle").data([0])
    candy_txt_select.enter()
      .append('text')
      .attr('transform', 'translate(' + [170,500] + ')')
      .attr('class', 'candyTitle')
    candy_txt_select.exit().remove()
    candy_txt_select
    .text(candy_name);

  all_Selection.exit().remove()

}




function drawMeanUpdate(scroll_number) {


}








//
