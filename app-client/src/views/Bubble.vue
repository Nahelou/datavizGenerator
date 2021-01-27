<template>
    <v-container>
      <h1 class="font-weight-light mb-10" >Bubble Plot</h1>
          <v-select :items="Object.keys(featuresFields)" label="x value" @change="getXValue" >
          </v-select>
          <v-select :items="Object.keys(featuresFields)" label="y value" @change="getYValue" >
          </v-select>
          <div id="bubbleChart"></div>
    </v-container>
</template>

<script>
import Chart from "chart.js";
import * as d3 from "d3";
export default {
  name: "Bubble",
  dataOthers: null,
  props: {
    dataParsed: {
      type: Array,
    },
    fields: {
      type: Object,
    }
  },
  dataInOut: null,
  bubbleChartData: null,
  data() {
    return {
        dataArray: this.$props.dataParsed,
        featuresFields: this.$props.fields,
        fieldX: null,
        fieldY: null,
        };
  },
  created() {
    this.dataArray = this.$props.dataParsed;
    this.featuresFields= this.$props.fields;
  },
mounted() {
      console.log(JSON.parse(JSON.stringify(this.dataArray)));
      console.log(JSON.parse(JSON.stringify(this.featuresFields)));
      // this.createChart("planet-chart2", this.bubbleChartData);
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    getChartData(){
      let data = [];
      let dataToScale = [];
      for(let i in this.dataArray){
          let dataOthers = {};
          dataOthers.y = this.dataArray[i].sum2019
          dataOthers.x = this.dataArray[i].pct_evol_eurostats
          dataOthers.label = this.dataArray[i].ville
          dataOthers.pass = this.dataArray[i].sum2019
          dataToScale.push(this.dataArray[i].sum2019)
          data.push(dataOthers);
      }
      let maxOut = d3.max(Object.values(dataToScale));
      let meanOut = d3.mean(Object.values(dataToScale));
      let minOut = d3.min(Object.values(dataToScale));
      let valued3 = d3
          .scaleLinear(10)
          .domain([minOut, meanOut, maxOut])
          .range([5, 15, 30, 60]);
      for(let j=0; j<data.length;j++){
        data[j].r = valued3(data[j].pass);
      }
      this.dataOthers = data;
      this.bubbleChartData = {
      type: "bubble",
      data: {
        datasets: [
          {
          label: ["Test"],
          data : [{
            y: this.dataSelected.sum2019,
            x: this.dataSelected.pct_evol_eurostats,
            r: valued3(this.dataSelected.sum2019),
            label: this.dataSelected.ville,
            pass: this.dataSelected.sum2019
          }],
          backgroundColor: [
                "rgba(255, 0, 102,.5)",
              ],
              borderColor: [
                "rgba(255, 0, 102)",
              ],
              borderWidth: 1,
          },
        {
          label:"Autres villes aéroportuaires",
          data,
            backgroundColor: [
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
              "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
                "rgba(0, 102, 255,.5)",
              ],
              borderColor: [
              ],
              borderWidth: 1,
          },
        ],
      },
        options: {
          legend: {
            labels: {
                fontColor: 'black'
            }},
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                scaleLabel : {
                  display: true,
                  labelString: 'Nombre de passagers transportés (intra et hors France) en 2019',
                  fontColor: 'black'
                },
                ticks: {
                  beginAtZero: false,
                  padding: 25,
                  fontColor: 'black'
                },
              },
            ],
            xAxes: [
              {
                scaleLabel :{
                  display: true,
                  labelString: 'Evolution du nombre de passagers transportés (intra et hors France) de 2010 à 2019',
                  fontColor: 'black'
                },
                ticks: {
                  fontColor: 'black'
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                  let test = null;
                  data.datasets[tooltipItem.datasetIndex].data.forEach((e)=>{
                    if(e.x == parseFloat(tooltipItem.xLabel) && e.y == parseFloat(tooltipItem.yLabel)){
                      test = e;
                    }
                  });
                    var label = test.label || ' : <br>Nombre de passagers en 2019 : ' + test.pass;
                    if (label) {
                        label += ': ';
                    }
                    label += "Evolution du nb de passagers totaux (intra et hors France) depuis 2010 : "+tooltipItem.xLabel+ "%";
                    label += ";  Nombre de passagers (intra et hors France) en 2019 : " + test.pass;
                    return label;
                },
            },
            enabled: false,
            custom: function(tooltipModel) {
                var tooltipEl = document.getElementById('chartjs-tooltip');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }
                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);
                    var innerHtml = '<thead>';
                    titleLines.forEach(function(title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';
                    bodyLines.forEach(function(body, i) {
                        var colors = tooltipModel.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span style="' + style + '"></span>';
                        innerHtml += '<tr><td>' + span + body + '</td></tr>';
                    });
                    innerHtml += '</tbody>';
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var position = this._chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = 1;
                tooltipEl.style.backgroundColor = "white";
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
            }
        },
        },
      };
    },
    getXValue(e){
      this.fieldX = e;
    },
    getYValue(e){
      this.fieldY = e;
    }
  },
};
</script>

<style>

</style>